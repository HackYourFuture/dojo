import stream from 'stream';
import sentry from '@sentry/node';

export interface PDFServiceType {
  convertDocxToPDF(input: stream.Readable): Promise<stream.Readable>;
}

// This service uses Gotenberg to convert DOCX files to PDF.
// You must have a Gotenberg instance running to use this service.
// Read more about Gotenberg here: https://gotenberg.dev/
export class PDFService implements PDFServiceType {
  private readonly gotenbergUrl: URL | null;
  constructor(gotenbergUrl: string) {
    try {
      this.gotenbergUrl = new URL(gotenbergUrl);
    } catch {
      this.gotenbergUrl = null;
    }

    if (!this.gotenbergUrl?.protocol.startsWith('http')) {
      console.warn('⚠️ PDF converter URL is invalid. PDF generation will not work.');
    }
  }

  async convertDocxToPDF(input: stream.Readable): Promise<stream.Readable> {
    if (!this.gotenbergUrl) {
      throw new Error('PDF converter URL is not set or invalid.');
    }

    const url = new URL('forms/libreoffice/convert', this.gotenbergUrl);
    const formData = new FormData();
    formData.append('merge', 'true');
    formData.append('pdfa', 'PDF/A-1b');
    formData.append('metadata', JSON.stringify({ Author: 'HackYourFuture', Creator: 'Dojo', Producer: 'Dojo' }));

    const blob = await new Response(input).blob();
    formData.append('files', blob, 'document.docx');

    // Send request to Gotenberg service. The service will try to convert the input stream to PDF.
    // The response will be a readable stream of the PDF file.
    let response: Response;
    try {
      response = await fetch(url, { method: 'POST', body: formData });
    } catch (error) {
      const errorMessage = `Failed to connect to Gotenberg service at ${this.gotenbergUrl.toString()}: ${String(error)}`;
      sentry.captureException(new Error(errorMessage));
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      const error = new Error(`Failed to convert to PDF: ${response.statusText}`);
      sentry.captureException(error);
      throw error;
    }

    if (!response.body) {
      const error = new Error('No response body from Gotenberg service');
      sentry.captureException(error);
      throw error;
    }

    // Return the PDF as a readable stream for later processing.
    return stream.Readable.fromWeb(response.body);
  }
}
