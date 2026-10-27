import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, () => {
  console.info({
    event: 'server.started',
    nodeEnv: config.nodeEnv,
    port: config.port,
  });
});
