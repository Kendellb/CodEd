const os = require("os");
const pty = require("node-pty");
const path = require('path');

/**
 * Class representing a Pseudo Terminal (PTY) instance.
 */
class PTY {
  /**
   * Create a PTY instance.
   * @param {SocketIO.Socket} socket - The Socket.IO socket to communicate with the client.
   */
  constructor(socket) {
    /**
     * The PTY process instance.
     * @type {nodePty.IPty|null}
     */
    this.ptyProcess = null;

    /**
     * The Socket.IO socket to communicate with the client.
     * @type {SocketIO.Socket}
     */
    this.socket = socket;
  }

  /**
   * Starts a Java process for the given user ID.
   * @param {string} userID - The ID of the user.
   */
  startJavaProcess(userID) {
    console.log(`Starting Java process for user with ID: ${userID}`);
    
    const tempFilePath = path.resolve(__dirname, `Code/${userID}/Main.java`);

    const javacProcess = pty.spawn('javac', [tempFilePath], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: path.resolve(__dirname, `Code/${userID}/`),
      env: process.env
    });

    javacProcess.on('data', (data) => {
      const errorMessage = data.toString();
      const replacedErrorMessage = errorMessage.replace(new RegExp(tempFilePath, 'g'), 'Main.java');
      console.error(errorMessage);
      this.sendToClient(replacedErrorMessage);
    });

    javacProcess.on('exit', (code) => {
      console.log(`Code: ${code}`);
      if (code === 0) {
        if (this.ptyProcess) {
          this.ptyProcess.removeAllListeners('data');
        }
        console.log(`javac process exited with code ${code}`);
        console.log("CLOSE")
        this.ptyProcess = pty.spawn('java', ['Main'], {
          name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: path.resolve(__dirname, `Code/${userID}/`),
          env: process.env
        });

        this.ptyProcess.on("data", data => {
          this.sendToClient(data);
        });
        this.ptyProcess.on('exit', data => {
          console.log("JAVA STOPPED RUNNING");
        })
      }
      else {
        console.log("An Error has occurred")
      }
    });
  }

  /**
   * Writes input data to the PTY process.
   * @param {*} data - Input from the user, like a command sent from a terminal UI.
   */
  write(data) {
    if (this.ptyProcess) {
      this.ptyProcess.write(data);
    } else {
      console.error("PTY process is null. Unable to write data.");
    }
  }

  /**
   * Sends data to the Socket.IO client.
   * @param {*} data - The data to send to the client.
   */
  sendToClient(data) {
    this.socket.emit("output", data);
  }
}

module.exports = PTY;
