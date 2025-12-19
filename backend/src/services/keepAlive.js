import https from 'https';
import http from 'http';

/**
 * Keep-alive service to prevent Render server from sleeping
 * Pings the server's health endpoint every 14 minutes (Render free tier sleeps after 15 min inactivity)
 */
export const startKeepAlive = (serverUrl) => {
  if (!serverUrl) {
    console.warn('Keep-alive: Server URL not provided, skipping keep-alive service');
    return;
  }

  const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
  const healthEndpoint = `${serverUrl}/api/health`;

  console.log(`Keep-alive service started. Pinging ${healthEndpoint} every 14 minutes`);

  const pingServer = async () => {
    try {
      const url = new URL(healthEndpoint);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.get(healthEndpoint, { timeout: 5000 }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log(`Keep-alive ping successful: ${response.message} at ${new Date().toISOString()}`);
          } catch (e) {
            console.log(`Keep-alive ping successful at ${new Date().toISOString()}`);
          }
        });
      });

      req.on('error', (error) => {
        console.error(`Keep-alive ping failed: ${error.message}`);
      });

      req.on('timeout', () => {
        req.destroy();
        console.error('Keep-alive ping timeout');
      });
    } catch (error) {
      console.error(`Keep-alive ping error: ${error.message}`);
    }
  };

  // Ping immediately on start
  pingServer();

  // Set up interval to ping every 14 minutes
  const intervalId = setInterval(pingServer, KEEP_ALIVE_INTERVAL);

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Keep-alive service stopping...');
    clearInterval(intervalId);
  });

  process.on('SIGINT', () => {
    console.log('Keep-alive service stopping...');
    clearInterval(intervalId);
  });

  return intervalId;
};

