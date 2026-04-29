import Stream from 'stream';
import { Trainee } from '../../models';
import { LetterData, LetterGeneratorType, LetterType } from '../../services';
import { TraineesRepository } from '../../repositories';
import { BadRequestError, NotFoundError } from '../../errors';

export interface GenerateLetterParams {
  traineeId: string;
  type: LetterType;
}

export interface GeneratedLetter {
  stream: Stream.Readable;
  fileName: string;
  contentType: string;
}

export interface LetterControllerType {
  generateLetter(params: GenerateLetterParams): Promise<GeneratedLetter>;
}

export class LetterController implements LetterControllerType {
  constructor(
    private readonly letterGenerator: LetterGeneratorType,
    private readonly traineeRepository: TraineesRepository
  ) {}

  async generateLetter({ traineeId, type }: GenerateLetterParams): Promise<GeneratedLetter> {
    const trainee = await this.traineeRepository.getTrainee(traineeId);
    if (!trainee) {
      throw new NotFoundError(`Trainee with ID ${traineeId} not found`);
    }

    if (!type || !Object.values(LetterType).includes(type)) {
      throw new BadRequestError(
        `Invalid letter type provided. Available types: [${Object.values(LetterType)}]`
      );
    }

    const data = this.getLetterData(trainee, type);
    const stream = await this.letterGenerator.generateLetter(type, data);
    return {
      stream,
      fileName: this.getLetterFileName(trainee, type),
      contentType: 'application/pdf',
    };
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
