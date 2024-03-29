

function login() {
  window.location.href = '/users/login';
}

function register(){
    window.location.href = '/users/register';
}


let loginButton = document.getElementById("Login");
let regButton = document.getElementById("Register");

/*function login(){
    console.log("login");
}*/
loginButton.addEventListener("click",login);

/*
function register(){
    console.log("register");
}*/
regButton.addEventListener("click",register);


