import io from 'socket.io-client';
import Editor from "../../model/editorModule";
import { TerminalUI } from "../../model/terminalUI";


/* TESTSING
//console.log(window.location.pathname)
//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if(window.location.pathname === '/users/login'){
//document.getElementById('UserLoginButton').addEventListener('click', textfromDb);
}
*/

//GLOBALS
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
  //console.log(`Socket connected to server: ${socket.io.uri}`);
  //console.log(`Terminal attached to container: ${container.id}`);
}

/**
 * Starts the application by connecting to the WebSocket server and initializing the terminal.
 */
function start() {
  const container = document.getElementById("terminal-container");
  connectToSocket(serverAddress).then(socket => {
    startTerminal(container, socket);
    terminalInitialized = true; // Set terminal as initialized
  });
}

/**
 * Sends a message to start a Java process.
 * @param {string} userId - The ID of the user for whom the Java process is started.
 */
async function sendStartJavaProcessMessage(userId) {
  try {
    const userDataResponse = await fetch('/users/current-user-data');
    if (!userDataResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const javaCode = await userDataResponse.text();

    const response = await fetch('/editor/runcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: javaCode })
    });

    const container = document.getElementById("terminal-container");

    socket.send(JSON.stringify({ action: 'startJavaProcess', userId: userId }));

    if (!response.ok) {
      throw new Error('Failed to execute Java code');
    }
  } catch (error) {
    console.error('Error executing Java code:', error);
  }
}


/**
 * Function to handle click event of the save button.
 * Saves user data to the server.
 * @function saveButtonEvent
 */
function saveButtonEvent() {
  //console.log(Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n"));
  const userData = Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n");
  //console.log(userData);

  // Send an HTTP POST request to the server with the user data
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
 * Function to fetch user data from the database and then create an editor with or without this data
 * @function textfromDb
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
      //console.log('Current user data:', userData);
      //If there is userdata in the database create a editor with the contents from the db
      if (userData) {
        //editor.updateState(userData)
        const editor = new Editor(
          document.querySelector('#editor'),
          userData
        );
      }
      //If there is no data create an editor with java main class and void method.
      else {
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


// Usage



//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if (window.location.pathname === '/editor') {
  document.getElementById('saveButton').addEventListener('click', saveButtonEvent)
  //Initial call to check if there is code in the database 
  //see function for more details
  //if student do this 
  textfromDb()
  //if instructor do something else
  
  //document.getElementById('runButton').addEventListener('click', runjava);
  //setInterval(textfromDb,5000); TESTING

  // Button click event listener
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
  document.getElementById('submit').addEventListener('click', async () => {
    try {
        const instructorNameInput = document.getElementById('instructorNameInput');
        const instructorName = instructorNameInput.value.trim(); // Get the value of the input field
        console.log(`Instructor Name: ${instructorName}`);

        fetch('/users/current-user-data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(async userData => {
      //console.log('Current user data:', userData);
      //If there is userdata in the database create a editor with the contents from the db
      const uploadData = userData;
        const response = await fetch('/editor/upload', {
            method: 'POST',
            headers: {
      'Content-Type': 'application/json'
    },
            body: JSON.stringify({uploadData,instructorName})
        });

        const data = await response.json();
        alert(data.message); // Display success or error message
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});


  start();

}

//TO DO 
//Get the userID from the session.