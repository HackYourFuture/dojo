import { getProfileURL, InteractionWithReporter, StrikeWithReporter, Test, TestResult, Trainee } from '../models';
import { App } from '@slack/bolt';
import * as Sentry from '@sentry/node';

export interface UpdateChange {
  fieldName: string;
  previousValue: string;
  newValue: string;
}

export interface NotificationService {
  traineeUpdated(trainee: Trainee, changes: UpdateChange[]): Promise<void>;
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
  constructor(config: SlackNotificationServiceConfig) {
    this.slack = new App({ token: config.token, signingSecret: config.signingSecret });
    this.notificationChannel = config.notificationChannel;
  }

  async traineeUpdated(trainee: Trainee, changes: UpdateChange[]): Promise<void> {
    const message = [`✏️ *New update* for <${getProfileURL(trainee)}|${trainee.displayName}>`];
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
