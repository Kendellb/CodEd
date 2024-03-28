import Editor from "../../model/editorModule";


/* TESTSING
//console.log(window.location.pathname)
//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if(window.location.pathname === '/users/login'){
//document.getElementById('UserLoginButton').addEventListener('click', textfromDb);
}
*/

/**
 * Function to handle click event of the save button.
 * Saves user data to the server.
 * @function saveButtonEvent
 */
function saveButtonEvent() {
  //console.log(Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n"));
  const userData = Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n");
  console.log(userData);

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
      console.log('Current user data:', userData);
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
          `public class Main(){\n public static void main(String args[]){\n\n}\n}`
        );
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

async function runjava() {
  try {
      const userDataResponse = await fetch('/users/current-user-data');
      if (!userDataResponse.ok) {
          throw new Error('Network response was not ok');
      }
      const javaCode = await userDataResponse.text();

    
        var input = document.getElementById("userInput");
        var userInput = input.value;
        


      const response = await fetch('/editor/runcode', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: javaCode ,userInput: userInput})
      });

      if (!response.ok) {
          throw new Error('Failed to execute Java code');
      }

      const output = await response.text(); 
      console.log('Output:', output);
      document.getElementById('output').innerText = output; 
      
  } catch (error) {
      console.error('Error executing Java code:', error);
  }
}
    

//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if (window.location.pathname === '/editor') {
  document.getElementById('saveButton').addEventListener('click', saveButtonEvent)
  //Initial call to check if there is code in the database 
  //see function for more details
  textfromDb()
  document.getElementById('runButton').addEventListener('click', runjava);
  //setInterval(textfromDb,5000); TESTING
}
