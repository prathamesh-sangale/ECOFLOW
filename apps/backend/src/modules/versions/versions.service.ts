import prisma from '../../utils/prisma';
import { PrismaClient } from '@prisma/client';
import { auditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
import { createNotification } from '../notifications/notifications.service';



export class VersionsService {
  async generateVersion(ecoId: string, reviewerId: string) {
    const eco = await prisma.eCO.findUnique({
      where: { id: ecoId },
      include: {
        product: { include: { boms: true } },
      }
    });

    if (!eco) throw new Error('ECO not found');
    if (eco.status !== 'Approved') throw new Error('Only approved ECOs can generate versions.');

    const product = eco.product;
    if (!product) throw new Error('Product not found for ECO');

    // We will get the current full product and BOM, and snapshot them
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { attachments: true, boms: { include: { components: true } } }
    });

    const fullBOM = await prisma.bOM.findUnique({
      where: { id: eco.bom_id },
      include: { components: true }
    });

    if (!fullProduct || !fullBOM) throw new Error('Product or BOM data missing');

    const result = await prisma.$transaction(async (tx) => {
      // Deactivate old active versions
      await tx.productVersion.updateMany({
        where: { product_id: product.id, is_active: true },
        data: { is_active: false }
      });
      await tx.bOMVersion.updateMany({
        where: { bom_id: eco.bom_id, is_active: true },
        data: { is_active: false }
      });

      // Calculate new version numbers
      const prevProdVersions = await tx.productVersion.count({ where: { product_id: product.id } });
      const newProdVersionNum = `V${prevProdVersions + 1}`;
      
      const prevBOMVersions = await tx.bOMVersion.count({ where: { bom_id: eco.bom_id } });
      const newBOMVersionNum = `V${prevBOMVersions + 1}`;

      // Create Product Version
      const productVersion = await tx.productVersion.create({
        data: {
          product_id: product.id,
          version_number: newProdVersionNum,
          eco_id: eco.id,
          snapshot: fullProduct as any,
          created_by: reviewerId,
          is_active: true,
          release_notes: `Generated from ECO: ${eco.eco_number}`
        }
      });

      // Create BOM Version
      const bomVersion = await tx.bOMVersion.create({
        data: {
          bom_id: eco.bom_id,
          version_number: newBOMVersionNum,
          eco_id: eco.id,
          snapshot: fullBOM as any,
          created_by: reviewerId,
          is_active: true,
          release_notes: `Generated from ECO: ${eco.eco_number}`
        }
      });

      // Create Release Tracking Record
      await tx.versionRelease.create({
        data: {
          product_version_id: productVersion.id,
          bom_version_id: bomVersion.id,
          released_by: reviewerId,
          notes: `Initial release of ${newProdVersionNum} and ${newBOMVersionNum}`
        }
      });

      // Log Activities
      await tx.versionActivity.create({
        data: {
          product_version_id: productVersion.id,
          action: 'Version Generated',
          metadata: `Generated Product ${newProdVersionNum} & BOM ${newBOMVersionNum}`,
          user_id: reviewerId
        }
      });

      return { productVersion, bomVersion };
    });

    await auditService.log({
      entity_type: 'Version',
      entity_id: result.productVersion.id,
      action: 'CREATED',
      new_value: { productVersion: result.productVersion, bomVersion: result.bomVersion },
      performed_by: reviewerId
    });

    // Notify users
    try {
      const targetRoles = ['Production Manager', 'Production', 'Admin'];
      const usersToNotify = await UsersService.getUsersByRoleNames(targetRoles);
      
      const userIds = new Set(usersToNotify.map(u => u.id));
      userIds.add(eco.submitted_by); // Also notify the Engineer

      for (const uid of userIds) {
        await createNotification({
          user_id: uid,
          title: 'New Product Version Released',
          message: `Version ${result.productVersion.version_number} for ${product.product_name} has been released.`,
          link: `/versions`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Failed to send notification for version generation:', err);
    }

    return result;
  }

  async getVersionsByProduct(productId: string) {
    return prisma.productVersion.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
      include: { creator: { select: { full_name: true } }, eco: true }
    });
  }

  async getVersionsByBOM(bomId: string) {
    return prisma.bOMVersion.findMany({
      where: { bom_id: bomId },
      orderBy: { created_at: 'desc' },
      include: { creator: { select: { full_name: true } }, eco: true }
    });
  }

  async getReleases() {
    return prisma.versionRelease.findMany({
      orderBy: { release_date: 'desc' },
      include: {
        product_version: { include: { product: true } },
        bom_version: { include: { bom: true } },
        releaser: { select: { full_name: true } }
      }
    });
  }
}

export const versionsService = new VersionsService();
