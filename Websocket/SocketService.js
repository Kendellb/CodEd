// SocketService.js

// Manage Socket.IO server
const socketIO = require("socket.io");
const PTYService = require("./PTYService");



class SocketService {
  constructor() {
    this.socket = null;
    this.pty = null;
  }

  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = socketIO(server);
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", socket => {
      console.log("Client connect to socket.", socket.id);

      this.socket = socket;

      // Just logging when socket disconnects.
      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
      });

      // Create a new pty service when client connects.
      this.pty = new PTYService(this.socket);
      
       this.socket.on('message', (message) => {
       const data = JSON.parse(message);
        if (data.action === 'startJavaProcess') {
           const userId = data.userId;
          this.pty.startJavaProcess(userId);
          console.log(`UserId in SS: ${userId}`);

      }
      this.socket.on("input",input => {
        this.pty.write(input);
      })
  });

      // Attach any event listeners which runs if any event is triggered from socket.io client
      // For now, we are only adding "input" event, where client sends the strings you type on terminal UI.
      /*
      this.socket.on("input", input => {
        //Runs this event function socket receives "input" events from socket.io client
        this.pty.write(input);
      });
      */
    });
  }
}

module.exports = SocketService;
