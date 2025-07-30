import { Request, Response, NextFunction } from 'express';
import { TraineesRepository } from '../../repositories';
import {
  StorageServiceType,
  UploadServiceType,
  UploadServiceError,
  ImageServiceType,
  AccessControl,
} from '../../services';
import { ResponseError } from '../../models';
import * as Sentry from '@sentry/node';
import fs from 'fs';

export interface ProfilePictureControllerType {
  setProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class ProfilePictureController implements ProfilePictureControllerType {
  private readonly traineesRepository: TraineesRepository;
  private readonly storageService: StorageServiceType;
  private readonly uploadService: UploadServiceType;
  private readonly imageService: ImageServiceType;
  constructor(
    traineesRepository: TraineesRepository,
    storageService: StorageServiceType,
    uploadService: UploadServiceType,
    imageService: ImageServiceType
  ) {
    this.traineesRepository = traineesRepository;
    this.storageService = storageService;
    this.uploadService = uploadService;
    this.imageService = imageService;
  }

  async setProfilePicture(req: Request, res: Response, next: NextFunction) {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    // Handle file upload.
    try {
      await this.uploadService.uploadImage(req, res, 'profilePicture');
    } catch (error) {
      if (error instanceof UploadServiceError) {
        res.status(400).send(new ResponseError(error.message));
      } else {
        next(error);
      }
      return;
    }
    if (!req.file?.path) {
      res.status(400).send(new ResponseError('No file was uploaded'));
      return;
    }

    // Resize image to reduce file size and create a smaller version
    const originalFilePath = req.file.path;
    const largeFilePath = originalFilePath + '_large';
    const smallFilePath = originalFilePath + '_small';

    await this.imageService.resizeImage(originalFilePath, largeFilePath, 700, 700);
    await this.imageService.resizeImage(largeFilePath, smallFilePath, 70, 70);

    // Upload image to storage
    const baseURL = process.env.STORAGE_BASE_URL ?? '';
    const imageURL = new URL(this.getImageKey(trainee.id), baseURL).href;
    const thumbnailURL = new URL(this.getThumbnailKey(trainee.id), baseURL).href;

    // Upload images to storage
    const largeFileStream = fs.createReadStream(largeFilePath);
    const smallFileStream = fs.createReadStream(smallFilePath);
    await this.storageService.upload(this.getImageKey(trainee.id), largeFileStream, AccessControl.Public);
    await this.storageService.upload(this.getThumbnailKey(trainee.id), smallFileStream, AccessControl.Public);

    // update the trainee object with the new image URL
    trainee.imageURL = imageURL;
    trainee.thumbnailURL = thumbnailURL;
    await this.traineesRepository.updateTrainee(trainee);
    res.status(201).send({ imageURL, thumbnailURL });

    // Cleanup
    fs.unlink(originalFilePath, (error) => {
      if (error) {
        Sentry.captureException(error);
      }
    });
    fs.unlink(largeFilePath, (error) => {
      if (error) {
        Sentry.captureException(error);
      }
    });
    fs.unlink(smallFilePath, (error) => {
      if (error) {
        Sentry.captureException(error);
      }
    });
  }

  async deleteProfilePicture(req: Request, res: Response, next: NextFunction) {
    const trainee = await this.traineesRepository.getTrainee(req.params.id);
    if (!trainee) {
      res.status(404).send(new ResponseError('Trainee not found'));
      return;
    }

    await this.storageService.delete(this.getImageKey(trainee.id));
    await this.storageService.delete(this.getThumbnailKey(trainee.id));

    // update the trainee object with the new image URL
    trainee.imageURL = undefined;
    trainee.thumbnailURL = undefined;
    await this.traineesRepository.updateTrainee(trainee);

    res.status(204).end();
  }

  private getImageKey(traineeId: string) {
    return `images/profile/${traineeId}.jpeg`;
  }

  private getThumbnailKey(traineeId: string) {
    return `images/profile/${traineeId}_thumb.jpeg`;
  }
}
