import * as Sentry from '@sentry/node';
import { Application } from 'express';

enum SentryEnvironment {
  Development = 'development',
  Testing = 'testing',
  Production = 'production',
}

const getSentryEnvironment = (): SentryEnvironment => {
  const parsedEnv = process.env.SENTRY_ENVIRONMENT?.toLowerCase() ?? '';
  // check if parsedEnv is a valid SentryEnvironment
  if (Object.values(SentryEnvironment).includes(parsedEnv as SentryEnvironment)) {
    return parsedEnv as SentryEnvironment;
  } else {
    return SentryEnvironment.Development;
  }
};

export const initializeSentry = () => {
  const DSN = 'https://05a4e8032c979ef9b85a1771795bb098@o4507747676848128.ingest.de.sentry.io/4507747681370192';
  const ENVIRONMENT = getSentryEnvironment();

  Sentry.init({
    dsn: DSN,
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions

    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,

    // Environment
    environment: ENVIRONMENT,
  });
};

export const setupSentry = (expressApp: Application) => {
  Sentry.setupExpressErrorHandler(expressApp);
  console.log(`✅ Sentry initialized. Environment: ${getSentryEnvironment()}`);
};
