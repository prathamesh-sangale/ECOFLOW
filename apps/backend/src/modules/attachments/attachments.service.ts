import { PrismaClient } from '@prisma/client';
import { uploadProductAttachment, deleteProductAttachment } from '../../utils/supabase';
import { auditService } from '../audit/audit.service';

const prisma = new PrismaClient();

export class AttachmentsService {
  async addAttachment(productId: string, fileBuffer: Buffer, originalName: string, mimeType: string, userId: string) {
    const timestamp = Date.now();
    const fileName = `${productId}_${timestamp}_${originalName.replace(/\s+/g, '_')}`;

    let fileUrl = '';
    try {
      fileUrl = await uploadProductAttachment(fileBuffer, fileName, mimeType);
    } catch (error) {
      console.warn('Supabase upload failed or not configured, using mock URL.', error);
      fileUrl = `https://mock.storage/${fileName}`;
    }

    const attachment = await prisma.productAttachment.create({
      data: {
        product_id: productId,
        file_name: originalName,
        file_url: fileUrl,
        file_type: mimeType,
        uploaded_by: userId,
      }
    });

    await prisma.productActivity.create({
      data: {
        product_id: productId,
        action: 'Attachment Added',
        details: `File attached: ${originalName}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Attachment',
      entity_id: attachment.id,
      action: 'CREATED',
      new_value: attachment,
      performed_by: userId
    });

    return attachment;
  }

  async removeAttachment(attachmentId: string, userId: string) {
    const attachment = await prisma.productAttachment.findUnique({ where: { id: attachmentId } });
    if (!attachment) throw new Error('Attachment not found');

    try {
      await deleteProductAttachment(attachment.file_url);
    } catch (error) {
      console.warn('Supabase delete failed or not configured.', error);
    }

    await prisma.productAttachment.delete({ where: { id: attachmentId } });

    await prisma.productActivity.create({
      data: {
        product_id: attachment.product_id,
        action: 'Attachment Removed',
        details: `File removed: ${attachment.file_name}`,
        user_id: userId
      }
    });

    await auditService.log({
      entity_type: 'Attachment',
      entity_id: attachmentId,
      action: 'DELETED',
      old_value: attachment,
      performed_by: userId
    });

    return true;
  }
}

export const attachmentsService = new AttachmentsService();
