import { Request, Response } from 'express';
import { attachmentsService } from './attachments.service';

export class AttachmentsController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const attachment = await attachmentsService.addAttachment(
        req.params.id,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        (req as any).user.id
      );

      res.status(201).json(attachment);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to upload attachment' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await attachmentsService.removeAttachment(req.params.attachmentId, (req as any).user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete attachment' });
    }
  }
}

export const attachmentsController = new AttachmentsController();
