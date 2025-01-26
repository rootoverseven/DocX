const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    // Generate a unique user ID for each client (this can be any identifier)
    const userId = Math.random().toString(36).substring(7);

    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      
      try {
        // Try to parse the incoming message as JSON
        const data = JSON.parse(message);

        // Check if the message is text
        if (data.text) {
          // Broadcast the text message to all clients except the sender
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ text: data.text, from: userId }));
            }
          });
        }

        // Check if the message is cursor coordinates
        if (data.cursor) {
          // Broadcast the cursor position to all clients except the sender
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ cursor: data.cursor, from: userId }));
            }
          });
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = { setupWebSocket };
