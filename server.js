const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 8080;

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_microseconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 500, 1000, 5000]
  });
  
  register.registerMetric(httpRequestDurationMicroseconds);
  
  app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
    });
    next();
  });
  
  app.get('/', (req, res) => {
    res.send('Hello, Prometheus!');
  });
  
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://0.0.0.0:${port}`);
  });