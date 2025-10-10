import * as functions from 'firebase-functions';

// HTTP function for health check
export const health = functions.https.onRequest((request, response) => {
  response.json({
    status: 'OK',
    message: 'StruXture Backend is running',
    timestamp: new Date().toISOString(),
    service: 'Firebase Functions'
  });
});

// HTTP function for main API
export const api = functions.https.onRequest((request, response) => {
  response.json({
    message: 'Welcome to StruXture API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Callable function example
export const helloWorld = functions.https.onCall((data, context) => {
  return {
    message: `Hello from StruXture! You said: ${data.message || 'nothing'}`,
    timestamp: new Date().toISOString()
  };
}); 