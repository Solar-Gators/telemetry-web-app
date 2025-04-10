const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store the Socket.IO instance globally
  global.io = io;

  // Set up Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Client connected to WebSocket');
    
    // Send the latest data to the newly connected client
    const latestData = global.latestData;
    if (latestData) {
      console.log('Sending latest data to new client');
      socket.emit('telemetry-update', latestData);
    }
    
    socket.on('disconnect', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 