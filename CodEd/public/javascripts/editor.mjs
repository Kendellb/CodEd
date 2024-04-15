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

async function sendStartJavaProcessMessageUpload(userID, index) {
  try {
    const url = `/users/upload-data?index=${index}`;
    const uploadDataResponse = await fetch(url);
    if (!uploadDataResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const javaCode = await uploadDataResponse.text();

    const response = await fetch(`/editor/runcodeUpload?userID=${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: javaCode })
    });

    const container = document.getElementById("terminal-container");

    socket.send(JSON.stringify({ action: 'startJavaProcess', userId: userID }));

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

async function textfromDbUpload(index) {
  // Construct the URL with the index as a query parameter
  const url = `/users/upload-data?index=${index}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(uploadData => {
      // If there is uploadData in the database, create an editor with the contents from the database
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

async function getUploadUserID() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userIDfromquery = urlParams.get('userID');

    // Fetch the data including the userID
    const response = await fetch(`/editor/get-uploadID?userID=${userIDfromquery}`);
    if (!response.ok) {
      throw new Error('Failed to fetch userID');
    }
    const userID = await response.text();
    console.log("USERID", userID);
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
  textfromDb();
  start();
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
      //console.log(`Instructor Name: ${instructorName}`);

      fetch('/users/current-user-data')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(async userData => {
          const uploadData = userData;
          // Create a new Date object
          var currentDate = new Date();

          // Get the current hour, minute, second, month, day, and year
          var hour = currentDate.getHours();
          var minute = currentDate.getMinutes();
          var second = currentDate.getSeconds();
          var month = currentDate.getMonth() + 1; // January is 0, so add 1
          var day = currentDate.getDate();
          var year = currentDate.getFullYear();

          // Add leading zeros to ensure two-digit format
          hour = hour < 10 ? '0' + hour : hour;
          minute = minute < 10 ? '0' + minute : minute;
          second = second < 10 ? '0' + second : second;
          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;

          // Format the date and time as a string
          var formattedDateTime = hour + ":" + minute + ":" + second + " " + month + "/" + day + "/" + year;

          //console.log("Current time and date:", formattedDateTime);


          const userID = await getUserID();
          //console.log(userID);
          if (!userID) {
            console.log('UserID not available');
          }


          //upload the user data from the database to an instructor.
          const response = await fetch('/editor/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uploadData, instructorName, formattedDateTime })
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




}

async function getIndexFromServer() {
  try {
    // Make fetch request to /index route
    const urlParams = new URLSearchParams(window.location.search);
    const urlIndex = urlParams.get('index');
    const response = await fetch(`/editor/index?index=${urlIndex}`);
    console.log(response);

    if (!response.ok) {
      throw new Error('Failed to fetch index');
    }

    // Parse response text as JSON
    const index = await response.text();
    console.log(`INDEXGET: ${index}`);
    return index;
  } catch (error) {
    console.error('Error fetching index:', error);
    return null;
  }
}

if (window.location.pathname === '/editor/studentSubmissonEditor') {
  (async () => {
    try {
      const index = await getIndexFromServer();
      console.log(`INDEX: ${index}`);
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




//TO DO 
//Get the userID from the session.