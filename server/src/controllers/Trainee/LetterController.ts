import { Request, Response, NextFunction } from 'express';
import { ResponseError, Trainee } from '../../models';
import { LetterData, LetterGeneratorType, LetterType } from '../../services';
import { TraineesRepository } from '../../repositories';
import sentry from '@sentry/node';

export interface LetterControllerType {
  generateLetter(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class LetterController implements LetterControllerType {
  constructor(
    private readonly letterGenerator: LetterGeneratorType,
    private readonly traineeRepository: TraineesRepository
  ) {}

  async generateLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { type } = req.body as { type: LetterType };
    const traineeID = req.params.id;

    const trainee = await this.traineeRepository.getTrainee(traineeID);
    if (!trainee) {
      const error = new ResponseError(`Trainee with ID ${traineeID} not found`);
      res.status(404).json(error);
      return;
    }

    if (!type || !Object.values(LetterType).includes(type)) {
      const error = new ResponseError(`Invalid letter type provided. Available types: [${Object.values(LetterType)}]`);
      res.status(400).json(error);
      return;
    }

    try {
      const data = this.getLetterData(trainee, type);
      const pdfStream = await this.letterGenerator.generateLetter(type, data);
      res.status(200).header({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${this.getLetterFileName(trainee, type)}"`,
      });
      pdfStream.pipe(res);
    } catch (error) {
      sentry.captureException(error);
      next(error);
    }
  }

  private getLetterData(trainee: Trainee, type: LetterType): LetterData {
    const dateString = new Date().toLocaleDateString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' });

    if (type === LetterType.GITHUB_TRAINEE) {
      return {
        NAME: trainee.personalInfo.firstName + ' ' + trainee.personalInfo.lastName,
        GITHUB: trainee.contactInfo.githubHandle ?? 'N/A',
        DATE: dateString,
      };
    } else {
      throw new Error(`Unsupported letter type: ${type}`);
    }
  }

  private getLetterFileName(trainee: Trainee, type: LetterType): string {
    const typeMap = {
      [LetterType.GITHUB_TRAINEE]: 'GitHub',
    };
    const fullName = `${trainee.personalInfo.firstName} ${trainee.personalInfo.lastName}`;
    return `${fullName} - ${typeMap[type] ?? type}.pdf`;
  }
}
