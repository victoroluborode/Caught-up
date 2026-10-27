import express, { type NextFunction, type Request, type Response } from 'express';

import type { RuntimeConfig } from './config.js';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

function logRequest(request: Request, response: Response, next: NextFunction) {
  const startedAt = performance.now();

  response.on('finish', () => {
    console.info({
      event: 'request.completed',
      method: request.method,
      path: request.path,
      statusCode: response.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
    });
  });

  next();
}

function notFoundHandler(_request: Request, response: Response<ErrorResponse>) {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
}

function errorHandler(
  error: unknown,
  _request: Request,
  response: Response<ErrorResponse>,
  _next: NextFunction,
) {
  console.error({ event: 'request.failed', error });

  if (response.headersSent) {
    return;
  }

  response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}

export function createApp(_config: RuntimeConfig) {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(logRequest);

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
