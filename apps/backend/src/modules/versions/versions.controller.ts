import { Request, Response } from 'express';
import { versionsService } from './versions.service';

export class VersionsController {
  async getVersionsByProduct(req: Request, res: Response) {
    try {
      const versions = await versionsService.getVersionsByProduct(req.params.productId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product versions' });
    }
  }

  async getVersionsByBOM(req: Request, res: Response) {
    try {
      const versions = await versionsService.getVersionsByBOM(req.params.bomId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOM versions' });
    }
  }

  async getReleases(req: Request, res: Response) {
    try {
      const releases = await versionsService.getReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch releases' });
    }
  }
}

export const versionsController = new VersionsController();
