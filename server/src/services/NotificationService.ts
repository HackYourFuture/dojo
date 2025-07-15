import {
  AuthenticatedUser,
  getProfileURL,
  InteractionWithReporter,
  StrikeWithReporter,
  Test,
  TestResult,
  Trainee,
} from '../models';
import { App } from '@slack/bolt';
import * as Sentry from '@sentry/node';

export interface UpdateChange {
  fieldName: string;
  previousValue: string;
  newValue: string;
}

export interface NotificationService {
  traineeUpdated(trainee: Trainee, changes: UpdateChange[], user: AuthenticatedUser): Promise<void>;
  interactionCreated(trainee: Trainee, interaction: InteractionWithReporter): Promise<void>;
  strikeCreated(trainee: Trainee, strike: StrikeWithReporter): Promise<void>;
  testCreated(trainee: Trainee, test: Test): Promise<void>;
}

export interface SlackNotificationServiceConfig {
  readonly token: string;
  readonly signingSecret: string;
  readonly notificationChannel: string;
}
export class SlackNotificationService implements NotificationService {
  private readonly slack: App;
  private readonly notificationChannel: string;
  private initialized = false;
  constructor(config: SlackNotificationServiceConfig) {
    this.notificationChannel = config.notificationChannel;
    this.slack = new App({
      token: config.token,
      signingSecret: config.signingSecret,
      socketMode: false,
      deferInitialization: true,
    });
    this.initializeSlack();
  }

  private async initializeSlack(): Promise<void> {
    try {
      await this.slack.init();
      await this.slack.start();
      this.initialized = true;
    } catch (error) {
      console.warn(`⚠️ Slack is not initialized. Slack notifications will not work. (${error}).`);
      console.warn('If you do not need to use Slack notifications, you can ignore this warning.\n');
    }
  }

  async traineeUpdated(trainee: Trainee, changes: UpdateChange[], user: AuthenticatedUser): Promise<void> {
    const message = [`✏️ *New update* for <${getProfileURL(trainee)}|${trainee.displayName}>`, `*By:* ${user.name}`];
    changes.forEach((change) => {
      message.push(`> - *${change.fieldName}*: ${change.previousValue} → ${change.newValue}`);
    });
    this.postMessageToSlack(message.join('\n'));
  }

  async interactionCreated(trainee: Trainee, interaction: InteractionWithReporter): Promise<void> {
    const message = [
      `📝 *New interaction* for <${getProfileURL(trainee)}|${trainee.displayName}>`,
      `*By:* ${interaction.reporter.name}`,
      `[${interaction.type}] *${interaction.title}*`,
    ].join('\n');

    this.postMessageToSlack(message);
  }

  async strikeCreated(trainee: Trainee, strike: StrikeWithReporter): Promise<void> {
    const message = [
      `🛑 *New strike* for <${getProfileURL(trainee)}|${trainee.displayName}>`,
      `*By:* ${strike.reporter.name}`,
      `*Reason:* ${strike.reason}`,
    ].join('\n');

    this.postMessageToSlack(message);
  }

  async testCreated(trainee: Trainee, test: Test): Promise<void> {
    let resultIcon = '';
    if (test.result === TestResult.Failed) {
      resultIcon = '❌';
    } else if (test.result === TestResult.Passed) {
      resultIcon = '✅';
    } else if (test.result === TestResult.PassedWithWarning) {
      resultIcon = '🟡';
    } else if (test.result === TestResult.Disqualified) {
      resultIcon = '‼️';
    }

    let message = [
      `📊 *New test result* for <${getProfileURL(trainee)}|${trainee.displayName}>`,
      `${test.type}`,
      `${resultIcon} ${test.result}`,
    ].join('\n');

    if (test.score) {
      message += ` (Score: ${test.score})`;
    }
    this.postMessageToSlack(message);
  }

  private async postMessageToSlack(message: string): Promise<void> {
    if (!this.initialized || !this.notificationChannel) {
      return;
    }
    try {
      const response = await this.slack.client.chat.postMessage({
        channel: this.notificationChannel,
        text: message,
      });
      if (!response.ok) {
        throw new Error(`Slack API error: ${response.error}`);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
