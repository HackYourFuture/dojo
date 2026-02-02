import multer from 'multer';
import { Request, Response } from 'express';
import fs from 'fs';
import * as size from '../utils/fileSize';
import * as Sentry from '@sentry/node';

const IMAGE_MAX_SIZE = size.MB(10);
type UploadFileFilter = (req: unknown, file: Express.Multer.File, callback: multer.FileFilterCallback) => void;

export class UploadServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadServiceError';
  }
}

export interface UploadServiceType {
  uploadImage(req: Request, res: Response, fieldName: string): Promise<void>;
}

export class UploadService implements UploadServiceType {
  private readonly tempDir: string;
  constructor(tempDir: string) {
    this.tempDir = tempDir;
  }

  async uploadImage(req: Request, res: Response, fieldName: string): Promise<void> {
    const limits = { fileSize: IMAGE_MAX_SIZE };
    const upload = multer({
      dest: this.tempDir,
      fileFilter: this.imageFileFilter,
      limits,
    }).single(fieldName);

    return new Promise((resolve, reject) => {
      void upload(req, res, (error) => {
        if (!error) {
          resolve();
          return;
        }

        let rejectionReason: Error;
        if (error instanceof multer.MulterError) {
          rejectionReason = new UploadServiceError(error.message);
        } else if (error instanceof Error) {
          rejectionReason = error;
        } else {
          rejectionReason = new Error(String(error));
        }

        reject(rejectionReason);
        return;
      });
    });
  }

  cleanupTempFiles(): void {
    console.log(`Cleaning up temp directory: ${this.tempDir}`);
    fs.rm(this.tempDir, { recursive: true, force: true }, (error) => {
      if (error) {
        Sentry.captureException(error);
      }
    });
  }

  private get imageFileFilter(): UploadFileFilter {
    return (_: unknown, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
      const isImage = file.mimetype.toLocaleLowerCase().startsWith('image/');
      if (isImage) {
        callback(null, isImage);
      } else {
        callback(new UploadServiceError('Unsupported file type. Only images are allowed.'));
        return;
      }
    };
  }
}
