const http = require('http');
const app = require('./src/app');
const { setupWebSocket } = require('./src/websocket');

// Create the HTTP server
const server = http.createServer(app);

// Attach WebSocket server to HTTP server
setupWebSocket(server);

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
