import Editor from "./editorModule";

//Temp editor if nothing is in the db.    
    const editor = new Editor(
    document.querySelector('#editor'),
    `public class Main(){\n public static void main(String args[]){\n\n}\n}`
  );

//console.log(window.location.pathname)//TESTING
if(window.location.pathname === '/users/login'){
//document.getElementById('UserLoginButton').addEventListener('click', textfromDb);
}


function saveButtonEvent(){
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

async function textfromDb(){
  fetch('/users/current-user-data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(userData => {
    console.log('Current user data:', userData);
    if(userData){
    editor.updateState(userData)
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  }

if(window.location.pathname === '/editor'){
 document.getElementById('saveButton').addEventListener('click', saveButtonEvent)
 textfromDb()
 //setInterval(textfromDb,5000); TESTING
}
/*
 // Function to trigger Rollup bundling
        function bundleScripts() {  

            async function bundle() {
                const config = '../javascripts/rollup.config.mjs';
                // create a bundle
                const bundle = await rollup.rollup(config);

                // write the bundle to disk
                await bundle.write(config.output);

                console.log('Bundling complete!');
            }

            bundle().catch(err => {
                console.error(err);
            });
        }
        // Attach event listener to the button
        document.getElementById('updateState').addEventListener('click', bundleScripts)
*/
