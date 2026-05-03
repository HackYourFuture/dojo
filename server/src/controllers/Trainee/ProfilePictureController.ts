import { TraineesRepository } from '../../repositories';
import { StorageServiceType, ImageServiceType, AccessControl } from '../../services';
import { NotFoundError } from '../../errors';
import * as Sentry from '@sentry/node';
import fs from 'fs';

export interface ProfilePictureURLs {
  imageURL: string;
  thumbnailURL: string;
}

export interface SetProfilePictureParams {
  traineeId: string;
  uploadedFilePath: string;
  baseURL: string;
}

export interface ProfilePictureControllerType {
  setProfilePicture(params: SetProfilePictureParams): Promise<ProfilePictureURLs>;
  deleteProfilePicture(traineeId: string): Promise<void>;
}

export class ProfilePictureController implements ProfilePictureControllerType {
  constructor(
    private readonly traineesRepository: TraineesRepository,
    private readonly storageService: StorageServiceType,
    private readonly imageService: ImageServiceType
  ) {}

  async setProfilePicture({ traineeId, uploadedFilePath, baseURL }: SetProfilePictureParams): Promise<ProfilePictureURLs> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    const largeFilePath = uploadedFilePath + '_large';
    const smallFilePath = uploadedFilePath + '_small';

    try {
      await this.imageService.resizeImage(uploadedFilePath, largeFilePath, 700, 700);
      await this.imageService.resizeImage(largeFilePath, smallFilePath, 70, 70);

      const imageURL = new URL(this.getImageKey(trainee.id), baseURL).href;
      const thumbnailURL = new URL(this.getThumbnailKey(trainee.id), baseURL).href;

      const largeFileStream = fs.createReadStream(largeFilePath);
      const smallFileStream = fs.createReadStream(smallFilePath);
      await this.storageService.upload(this.getImageKey(trainee.id), largeFileStream, AccessControl.Public);
      await this.storageService.upload(this.getThumbnailKey(trainee.id), smallFileStream, AccessControl.Public);

      trainee.imageURL = imageURL;
      trainee.thumbnailURL = thumbnailURL;
      await this.traineesRepository.updateTrainee(trainee);
      return { imageURL, thumbnailURL };
    } finally {
      this.cleanupFile(uploadedFilePath);
      this.cleanupFile(largeFilePath);
      this.cleanupFile(smallFilePath);
    }
  }

  async deleteProfilePicture(traineeId: string): Promise<void> {
    const trainee = await this.traineesRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError('Trainee not found');
    }

    await this.storageService.delete(this.getImageKey(trainee.id));
    await this.storageService.delete(this.getThumbnailKey(trainee.id));

    trainee.imageURL = undefined;
    trainee.thumbnailURL = undefined;
    await this.traineesRepository.updateTrainee(trainee);
  }

  private cleanupFile(filePath: string) {
    fs.unlink(filePath, (error) => {
      if (error && (error as NodeJS.ErrnoException).code !== 'ENOENT') {
        Sentry.captureException(error);
      }
    });
  }

  private getImageKey(traineeId: string) {
    return `images/profile/${traineeId}.jpeg`;
  }

  private getThumbnailKey(traineeId: string) {
    return `images/profile/${traineeId}_thumb.jpeg`;
  }
}
