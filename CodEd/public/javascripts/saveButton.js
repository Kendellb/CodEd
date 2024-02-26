//https://discuss.codemirror.net/t/how-to-get-editor-content-from-the-browser/3840

function saveButtonEvent(){
    //console.log(Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n"));
    const userData = Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n");

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

document.getElementById("saveButton").addEventListener("click", saveButtonEvent);



