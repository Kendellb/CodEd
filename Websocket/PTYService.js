// PTYService.js

const os = require("os");
const pty = require("node-pty");
const path = require('path');

class PTY {
  constructor(socket) {
    // Setting default terminals based on user os
    //this.shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    this.ptyProcess = null;
    this.socket = socket;
  }

  

  startJavaProcess(userID) {
    // Use userId as needed in your logic
    // Example usage:
    console.log(`Starting Java process for user with ID: ${userID}`);

    
    const tempFilePath = path.resolve(__dirname, `Code/${userID}/Main.java`);
    // Compile the Java source file using javac
    const javacProcess = pty.spawn('javac', [tempFilePath],{
      name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: path.resolve(__dirname, `Code/${userID}/`),
          env: process.env
    });

    javacProcess.on('data', (data) => {
      const errorMessage = data.toString();
      // Replace occurrences of tempFilePath with 'Main.java'
      const replacedErrorMessage = errorMessage.replace(new RegExp(tempFilePath, 'g'), 'Main.java');
      console.error(errorMessage);
      // Send error message to frontend
      //res.status(500).send(errorMessage);
      //EMIT THE PATH
      this.sendToClient(replacedErrorMessage);
      //console.log(`Error Message: ${data}`);
    });


    javacProcess.on('exit', (code) => {
      console.log(`Code: ${code}`);
      if(code === 0){
        //not nessaary 
       if (this.ptyProcess) {
          this.ptyProcess.removeAllListeners('data'); // Remove existing data event listener
        }
      console.log(`javac process exited with code ${code}`);
        console.log("CLOSE")
        // Compilation successful, start the Java process
        this.ptyProcess = pty.spawn('java', ['Main'], {
          name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: path.resolve(__dirname, `Code/${userID}/`),
          env: process.env
        });

        this.ptyProcess.on("data", data => {
          // Send output to socket.io client
          this.sendToClient(data);
        });
        this.ptyProcess.on('exit', data => {
          console.log("JAVA STOPPED RUNNING");
        })
      }
      else{
        console.log("An Error has occured")
      }
    });
  }

  /**
   * Use this function to send in the input to Pseudo Terminal process.
   * @param {*} data Input from user like command sent from terminal UI
   */

  write(data) {
    if (this.ptyProcess) {
      this.ptyProcess.write(data); // Only write data if ptyProcess is not null
    } else {
      console.error("PTY process is null. Unable to write data.");
  }
}

  sendToClient(data) {
    // Emit data to socket.io client in an event "output"
    this.socket.emit("output", data);
  }
}

module.exports = PTY;
