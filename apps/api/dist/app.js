import express from 'express';
function logRequest(request, response, next) {
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
function notFoundHandler(_request, response) {
    response.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found',
        },
    });
}
function errorHandler(error, _request, response, _next) {
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
export function createApp(_config) {
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
