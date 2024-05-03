/**
 * Module for client-side functionality related to the code editor and terminal.
 */

import io from 'socket.io-client';
import Editor from "../../model/editorModule";
import { TerminalUI } from "../../model/terminalUI";

// Global variables
const serverAddress = 'http://localhost:8080';
let terminalInitialized = false;
let socket = null;

/**
 * Connects to a WebSocket server.
 * @param {string} serverAddress - The address of the WebSocket server.
 * @returns {Promise<Socket>} - A Promise that resolves to the socket connection.
 */
function connectToSocket(serverAddress) {
  return new Promise(res => {
    socket = io(serverAddress);
    res(socket);
  });
}

/**
 * Starts a terminal interface.
 * @param {HTMLElement} container - The DOM element to which the terminal will be attached.
 * @param {Socket} socket - The WebSocket socket connection.
 */
function startTerminal(container, socket) {
  const terminal = new TerminalUI(socket);
  terminal.attachTo(container);
  terminal.startListening();
}

/**
 * Starts the application by connecting to the WebSocket server and initializing the terminal.
 */
function start() {
  const container = document.getElementById("terminal-container");
  connectToSocket(serverAddress).then(socket => {
    startTerminal(container, socket);
    terminalInitialized = true;
  });
}

/**
 * Sends a message to start a Java process.
 * @param {string} userId - The ID of the user for whom the Java process is started.
 */
async function sendStartJavaProcessMessage(userId) {
  try {
    // Fetch user's Java code from the server
    const userDataResponse = await fetch('/users/current-user-data');
    if (!userDataResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const javaCode = await userDataResponse.text();

    // Send the Java code to the server to execute
    const response = await fetch('/editor/runcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: javaCode })
    });

    // Send a message to the WebSocket server to start the Java process
    socket.send(JSON.stringify({ action: 'startJavaProcess', userId: userId }));

    if (!response.ok) {
      throw new Error('Failed to execute Java code');
    }
  } catch (error) {
    console.error('Error executing Java code:', error);
  }
}

/**
 * Sends a message to start a Java process for uploaded code.
 * @param {string} userID - The ID of the user for whom the Java process is started.
 * @param {number} index - The index of the uploaded code.
 */
async function sendStartJavaProcessMessageUpload(userID, index) {
  try {
    // Fetch uploaded Java code from the server
    const url = `/users/upload-data?index=${index}`;
    const uploadDataResponse = await fetch(url);
    if (!uploadDataResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const javaCode = await uploadDataResponse.text();

    // Send the uploaded Java code to the server to execute
    const response = await fetch(`/editor/runcodeUpload?userID=${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: javaCode })
    });

    // Send a message to the WebSocket server to start the Java process
    socket.send(JSON.stringify({ action: 'startJavaProcess', userId: userID }));

    if (!response.ok) {
      throw new Error('Failed to execute Java code');
    }
  } catch (error) {
    console.error('Error executing Java code:', error);
  }
}

/**
 * Handles click event of the save button.
 * Saves user data to the server.
 */
function saveButtonEvent() {
  const userData = Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n");
  fetch('/users/updateUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userData })
  })
    .then(response => {
      if (response.ok) {
        console.log('User data updated successfully');
      } else {
        console.error('Failed to update user data');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/**
 * Fetches user data from the database and creates an editor with or without this data.
 */
async function textfromDb() {
  fetch('/users/current-user-data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(userData => {
      if (userData) {
        const editor = new Editor(
          document.querySelector('#editor'),
          userData
        );
      } else {
        const editor = new Editor(
          document.querySelector('#editor'),
          `public class Main{\n public static void main(String args[]){\n\n}\n}`
        );
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

/**
 * Fetches user data from the database based on the provided index and updates the editor.
 * @param {number} index - The index of the uploaded code.
 */
async function textfromDbUpload(index) {
  const url = `/users/upload-data?index=${index}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(uploadData => {
      if (uploadData) {
        const editor = new Editor(
          document.querySelector('#editor'),
          uploadData
        );
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

/**
 * Fetches the user ID from the server.
 * @returns {Promise<string|null>} - A Promise that resolves to the user ID or null if an error occurs.
 */
async function getUserID() {
  try {
    const response = await fetch('/editor/get-userID');
    if (!response.ok) {
      throw new Error('Failed to fetch userID');
    }
    const userID = await response.text();
    return userID;
  } catch (error) {
    console.error('Error fetching userID:', error);
    return null;
  }
}

/**
 * Fetches the upload user ID from the server.
 * @returns {Promise<string|null>} - A Promise that resolves to the upload user ID or null if an error occurs.
 */
async function getUploadUserID() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userIDfromquery = urlParams.get('userID');
    const response = await fetch(`/editor/get-uploadID?userID=${userIDfromquery}`);
    if (!response.ok) {
      throw new Error('Failed to fetch userID');
    }
    const userID = await response.text();
    return userID;
  } catch (error) {
    console.error('Error fetching userID:', error);
    return null;
  }
}

/**
 * Fetches the index from the server based on the URL query parameter.
 * @returns {Promise<number|null>} - A Promise that resolves to the index or null if an error occurs.
 */
async function getIndexFromServer() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlIndex = urlParams.get('index');
    const response = await fetch(`/editor/index?index=${urlIndex}`);

    if (!response.ok) {
      throw new Error('Failed to fetch index');
    }

    const index = await response.text();
    return index;
  } catch (error) {
    console.error('Error fetching index:', error);
    return null;
  }
}

// Event listener for editor page
if (window.location.pathname === '/editor') {
  document.getElementById('saveButton').addEventListener('click', saveButtonEvent)
  textfromDb();
  start();

  // Button click event listener for running Java code
  document.getElementById('runButton').addEventListener('click', async () => {
    try {
      const userID = await getUserID();
      if (userID) {
        sendStartJavaProcessMessage(userID);
      } else {
        console.log('UserID not available');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Button click event listener for submitting code to an instructor
  document.getElementById('submit').addEventListener('click', async () => {
    try {
      const instructorNameSelect = document.getElementById('instructorNameSelect');
      const instructorName = instructorNameSelect.value.trim();

      fetch('/users/current-user-data')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(async userData => {
          const uploadData = userData;
          var currentDate = new Date();
          var hour = currentDate.getHours();
          var minute = currentDate.getMinutes();
          var second = currentDate.getSeconds();
          var month = currentDate.getMonth() + 1;
          var day = currentDate.getDate();
          var year = currentDate.getFullYear();
          hour = hour < 10 ? '0' + hour : hour;
          minute = minute < 10 ? '0' + minute : minute;
          second = second < 10 ? '0' + second : second;
          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;
          var formattedDateTime = hour + ":" + minute + ":" + second + " " + month + "/" + day + "/" + year;

          const userID = await getUserID();
          if (!userID) {
            console.log('UserID not available');
          }

          const response = await fetch('/editor/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uploadData, instructorName, formattedDateTime })
          });

          const data = await response.json();
          alert(data.message);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    }
  });
}

// Event listener for student submission editor page
if (window.location.pathname === '/editor/studentSubmissonEditor') {
  (async () => {
    try {
      const index = await getIndexFromServer();
      textfromDbUpload(index);
      start();

      document.getElementById('runButton').addEventListener('click', async () => {
        try {
          const userID = await getUploadUserID();
          if (userID) {
            sendStartJavaProcessMessageUpload(userID, index);
          } else {
            console.log('UserID not available');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    } catch (error) {
      console.error('Error fetching index and updating editor:', error);
    }
  })();
}
