import Editor from "./editorModule";

/* TESTSING
//console.log(window.location.pathname)
//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if(window.location.pathname === '/users/login'){
//document.getElementById('UserLoginButton').addEventListener('click', textfromDb);
}
*/

//save code to the database 
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

//if code exists in the db this function will update the editor to 
// be filled with that saved code instead.
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
      if (userData) {
        //editor.updateState(userData)
        const editor = new Editor(
          document.querySelector('#editor'),
          userData
        );
      }
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

//statment to dynamically add event handler based on the window location
// to avoid conflicts with other event handlers for other views
if (window.location.pathname === '/editor') {
  document.getElementById('saveButton').addEventListener('click', saveButtonEvent)
  //Initial call to check if there is code in the database 
  //see function for more details
  textfromDb()
  //setInterval(textfromDb,5000); TESTING
}
