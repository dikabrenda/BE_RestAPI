import * as Sentry from '@sentry/node';
import '@sentry/tracing';

class sentry extends Error {
  constructor(err) {
    super(`"${Sentry.captureException(err)}" something went wrong`);
    Sentry.init({
      dsn: '',
      environment: process.env.SENTRY_ENVIRONTMENT,
      tracesSampleRate: 1.0,
    });
  }
}

export default sentry;
