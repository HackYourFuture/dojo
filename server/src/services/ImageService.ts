import sharp from 'sharp';

export interface ImageServiceType {
  resizeImage(inputFile: string, outputFile: string, width: number, height: number): Promise<void>;
}

export class ImageService implements ImageServiceType {
  async resizeImage(inputFile: string, outputFile: string, width: number, height: number | null = null): Promise<void> {
    await sharp(inputFile)
      .resize(width, height)
      .jpeg()
      .toFile(outputFile);
  }
}