import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import stream from 'stream';

export interface StorageServiceType {
  download(key: string): Promise<stream.Readable>;
  upload(path: string, input: stream.Readable, accessControl: AccessControl): Promise<string>;
  delete(key: string): Promise<void>;
}

export enum AccessControl {
  Public = 'public',
  Private = 'private',
}

export class StorageService implements StorageServiceType {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    endpoint: string,
    region: string,
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
    forcePathStyle: boolean
  ) {
    if (!endpoint) {
      throw new Error('Missing required configuration: endpoint');
    }
    if (!region) {
      throw new Error('Missing required configuration: region');
    }
    if (!bucketName) {
      throw new Error('Missing required configuration: bucketName');
    }
    if (!accessKeyId) {
      throw new Error('Missing required configuration: accessKeyId');
    }
    if (!secretAccessKey) {
      throw new Error('Missing required configuration: secretAccessKey');
    }
    this.bucketName = bucketName;
    this.s3Client = new S3Client({
      endpoint,
      forcePathStyle: forcePathStyle,
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(key: string, input: stream.Readable, accessControl: AccessControl): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        ACL: accessControl === AccessControl.Public ? 'public-read' : 'private',
        Body: input,
      },
    });

    const uploadResponse = await upload.done();
    if (!uploadResponse.Location) {
      throw new Error(`Failed to upload file ${uploadResponse.$metadata}`);
    }

    return uploadResponse.Location;
  }

  async download(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    return response.Body as stream.Readable;
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
