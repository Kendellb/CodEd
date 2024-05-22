import { Terminal } from "xterm";

/**
 * Represents a terminal user interface.
 */
export class TerminalUI {
  /**
   * Creates a TerminalUI instance.
   * @param {SocketIO.Socket} socket - The socket.io client socket.
   */
  constructor(socket) {
    /** @type {Terminal} */
    this.terminal = new Terminal({
        theme: {
             background: '#232634',
             color: '#c6d0f5',
        }
    });
    /** @type {SocketIO.Socket} */
    this.socket = socket;
  }

  /**
   * Attach event listeners for terminal UI and socket.io client.
   */
  startListening() {
    this.terminal.onData(data => this.sendInput(data));
    this.socket.on("output", data => {
      // When there is data from PTY on server, print that on Terminal.
      this.write(data);
    });
  }

  /**
   * Print something to terminal UI.
   * @param {string} text - The text to print.
   */
  write(text) {
    this.terminal.write(text);
  }

  /**
   * Utility function to print new line on terminal.
   */
  prompt() {
    this.terminal.write(`\r\n$ `);
  }

  /**
   * Send whatever you type in Terminal UI to PTY process in server.
   * @param {string} input - Input to send to server.
   */
  sendInput(input) {
    this.socket.emit("input", input);
  }

  /**
   * Attach the terminal UI to a container element.
   * @param {HTMLElement} container - The HTMLElement where xterm can attach the terminal UI instance.
   */
  attachTo(container) {
    this.terminal.open(container);
    this.prompt();
  }

  /**
   * Clear the terminal UI.
   */
  clear() {
    this.terminal.clear();
  }
}
