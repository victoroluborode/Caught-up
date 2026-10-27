const validNodeEnvironments = new Set([
    'development',
    'production',
    'test',
]);
export function loadConfig(environment = process.env) {
    const nodeEnv = environment.NODE_ENV ?? 'development';
    if (!validNodeEnvironments.has(nodeEnv)) {
        throw new Error('NODE_ENV must be development, production, or test');
    }
    const rawPort = environment.PORT ?? '3000';
    const port = Number(rawPort);
    if (!Number.isInteger(port) || port < 0 || port > 65_535) {
        throw new Error('PORT must be an integer between 0 and 65535');
    }
    return {
        nodeEnv: nodeEnv,
        port,
    };
}
