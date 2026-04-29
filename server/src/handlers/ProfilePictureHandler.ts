import { Request, Response, NextFunction } from 'express';
import { ProfilePictureControllerType } from '../controllers/Trainee/ProfilePictureController';
import { UploadServiceType, UploadServiceError } from '../services';
import { ResponseError } from '../models';
import { sendError } from './Handler';

export interface ProfilePictureHandlerType {
  setProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class ProfilePictureHandler implements ProfilePictureHandlerType {
  constructor(
    private readonly controller: ProfilePictureControllerType,
    private readonly uploadService: UploadServiceType,
    private readonly storageBaseURL: string
  ) {}

  async setProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.uploadService.uploadImage(req, res, 'profilePicture');
    } catch (error: any) {
      if (error instanceof UploadServiceError) {
        res.status(400).json(new ResponseError(error.message));
        return;
      }
      next(error);
      return;
    }

    if (!req.file?.path) {
      res.status(400).json(new ResponseError('No file was uploaded'));
      return;
    }

    try {
      const urls = await this.controller.setProfilePicture({
        traineeId: String(req.params.id),
        uploadedFilePath: req.file.path,
        baseURL: this.storageBaseURL,
      });
      res.status(201).json(urls);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async deleteProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.controller.deleteProfilePicture(String(req.params.id));
      res.status(204).end();
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
