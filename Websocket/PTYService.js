// PTYService.js

const os = require("os");
const pty = require("node-pty");

class PTY {
  constructor(socket) {
    // Setting default terminals based on user os
    //this.shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    this.ptyProcess = null;
    this.socket = socket;

    // Initialize PTY process.
    //this.startPtyProcess();
  }

  /**
   * Spawn an instance of pty with a selected shell.
   */
  startPtyProcess() {
    //this.ptyProcess = pty.spawn('java', [`-classpath`, `../CodEd/tmpJava/kendell-83dab21e`, `Main`], {
    /*
  this.ptyProcess = pty.spawn('xterm', [], {
    name: "xterm-color",
    cols:80,
    rows:30,
    cwd: process.cwd(), // Which path should terminal start
    env: process.env // Pass environment variables
  });
  
  
  // Add a "data" event listener.
  this.ptyProcess.on("data", data => {
    // Whenever terminal generates any data, send that output to socket.io client to display on UI
    this.sendToClient(data);
  });
  */
  }

  startJavaProcess(userID) {
    // Use userId as needed in your logic
    // Example usage:
    console.log(`Starting Java process for user with ID: ${userID}`);

    
    const tempFilePath = `../CodEd/tmpJava/${userID}/Main.java`;
    // Compile the Java source file using javac
    const javacProcess = pty.spawn('javac', [tempFilePath],{
      name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: process.cwd(),
          env: process.env
    });

    javacProcess.on('data', (data) => {
      const errorMessage = data.toString(); // Convert buffer to string
      console.error(errorMessage);
      // Send error message to frontend
      //res.status(500).send(errorMessage);
      //EMIT THE PATH
      this.sendToClient(data);
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
        this.ptyProcess = pty.spawn('java', ['-classpath', `../CodEd/tmpJava/${userID}`, 'Main'], {
          name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: process.cwd(),
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
    //this.ptyProcess.on("data", data => {
      // Whenever terminal generates any data, send that output to socket.io client to display on UI
      //this.sendToClient(data);
    //})
  }

  /**
   * Use this function to send in the input to Pseudo Terminal process.
   * @param {*} data Input from user like command sent from terminal UI
   */

  write(data) {
    this.ptyProcess.write(data);
  }

  sendToClient(data) {
    // Emit data to socket.io client in an event "output"
    this.socket.emit("output", data);
  }
}

module.exports = PTY;
