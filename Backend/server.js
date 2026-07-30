require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");

const connectDB = require("./src/config/db");
const { initializeDefaultMesh } = require("./src/mesh/services/testRegistry");

connectDB().then(() => {
    // Initialize the default virtual devices and connections in simulator registry
    initializeDefaultMesh();
});

const PORT = process.env.PORT || 5000;

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);
    
    socket.on("disconnect", () => {
        console.log(`Socket client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Trigger restart



