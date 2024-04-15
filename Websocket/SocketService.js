const socketIO = require("socket.io");
const PTYService = require("./PTYService");

/**
 * Class representing a SocketService for managing Socket.IO connections.
 */
class SocketService {
  /**
   * Create a SocketService instance.
   */
  constructor() {
    /**
     * The Socket.IO socket instance.
     * @type {SocketIO.Socket}
     */
    this.socket = null;

    /**
     * The PTYService instance for handling Pseudo Terminal operations.
     * @type {PTYService}
     */
    this.pty = null;
  }

  /**
   * Attaches the SocketService to the provided server.
   * @param {http.Server} server - The HTTP server instance to attach the SocketService to.
   * @throws {Error} Throws an error if the server is not provided.
   */
  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = socketIO(server);
    console.log("Created socket server. Waiting for client connection.");

    // "connection" event happens when any client connects to this io instance.
    io.on("connection", socket => {
      console.log("Client connected to socket.", socket.id);

      this.socket = socket;

      // Logging when socket disconnects.
      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
      });

      // Create a new PTYService instance when client connects.
      this.pty = new PTYService(this.socket);

      // Listen for "message" event from client to start Java process.
      this.socket.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.action === 'startJavaProcess') {
          const userId = data.userId;
          this.pty.startJavaProcess(userId);
          console.log(`UserId in SocketService: ${userId}`);
        }
      });

      // Listen for "input" event from client to send input to PTY process.
      this.socket.on("input", input => {
        this.pty.write(input);
      });
    });
  }
}

module.exports = SocketService;
