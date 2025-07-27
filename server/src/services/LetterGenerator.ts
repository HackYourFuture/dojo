import { PDFServiceType } from './PDFService';
import { StorageServiceType } from './StorageService';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import Stream from 'stream';

export type LetterData = {
  [key: string]: string;
};

export enum LetterType {
  GITHUB_TRAINEE = 'github_trainee',
}

export interface LetterGeneratorType {
  generateLetter(type: LetterType, data: LetterData): Promise<Stream.Readable>;
}

export class LetterGenerator implements LetterGeneratorType {
  constructor(
    private readonly pdfService: PDFServiceType,
    private readonly storageService: StorageServiceType
  ) {}

  async generateLetter(type: LetterType, data: LetterData): Promise<Stream.Readable> {
    // 1. Download the template docx document from storage
    let templateDocumentStream: Stream.Readable;
    const key = `templates/letters/${type}.docx`;
    try {
      templateDocumentStream = await this.storageService.download(key);
    } catch (error) {
      throw new Error(`Letter generation error: failed to download template in ${key}: ${String(error)}`);
    }

    // 2. Replace the placeholders in the template with actual data
    let outputDocument: Buffer;
    try {
      const templateDocument = Buffer.concat(await Array.fromAsync(templateDocumentStream));
      outputDocument = await this.populateTemplate(templateDocument, data);
    } catch (error) {
      throw new Error(`Letter generation error: failed to generate document from template: ${String(error)}`);
    }

    // 3. Convert the populated docx document to PDF
    const pdfStream = await this.pdfService.convertDocxToPDF(Stream.Readable.from(outputDocument));
    return pdfStream;
  }

  // This function takes a docx template document and replaces the placeholders with actual data.
  // The process involves unzipping the docx file, parsing it with Docxtemplater, and then generating a new docx file.
  private async populateTemplate(templateDocument: Buffer, letterData: LetterData): Promise<Buffer> {
    // Unzip the content of the docx file
    const zip = new PizZip(templateDocument);

    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Replace templates with values. Placeholders must be in the data object
    doc.render(letterData);

    // Output new docx
    const outputBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    return outputBuffer;
  }
}
