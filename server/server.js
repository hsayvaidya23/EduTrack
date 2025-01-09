// server.js
const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get port from environment variables or use default
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on ${process.env.BACKEND_SERVER}`);
});