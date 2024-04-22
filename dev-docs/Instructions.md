# Instructions

Prerequisites:
NodeJs https://nodejs.org/en I am using version 20.11

First Clone the repository

```
git clone https://github.com/Duquesne-Spring-2024-COSC-481/Kendell-Barry.git
```


Open a Node.js command prompt (available in Windows start menu, or search for node) and run the following commands
to globally install JavaScript test and documentation software:

```
npm install -g jest
npm install -g jsdoc
```

# Running the server

-Open a Node.js command prompt

-Cd into the the CodEd folder

-Execute `npm install` to install all required packages

-Execute `npm start` to start the web server

-Execute `npm fund` 

-Next open a new terminal (in Vscode hit terminal in the top left next to help)

-Then cd into the root of the project

-Next cd into the `Websocket` folder

-Execute `npm install` to install all required packages

-Execute `npm start` to start the web server

-Execute `npm fund` 

-In a browser, visit [http://localhost:3000/](http://localhost:3000/) to verify that the server is running

# Stopping the server

At the command line where the server was started, enter Ctrl-C to stop the server

# Running tests
- First cd into the tests folder and execute `npm install` and `npm fund`
- Next cd into the CodEd folder by first going back to the root.
- Start server using `NODE_ENV=test npm start`
-Next open a new terminal (in Vscode hit terminal in the top left next to help).

-Then cd into the root of the project

-Next cd into the `Websocket` folder

-Execute `npm install` to install all required packages

-Execute `npm start` to start the web server

- Then open a new terminal (in Vscode hit terminal in the top left next to help)
- Next cd into the root of the project
- Finally Execute:
  ```
  jest --coverage test
  ```

# Generating API Documentation 

- Open a command prompt

- Cd into the the CodEd folder

- run
  ```
  node jsdoc.js
  ```

- Navigate to the coverage folder `/coverage/lcov-report`
- Open the index.html file in your browser
