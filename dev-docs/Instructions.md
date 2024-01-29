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

-Cd into the the CodEd fodler

-Execute `npm start` to start the web server

-Execute `npm fund` 

-In a browser, visit http://localhost:3000/ to verify that the server is running

# Stopping the server

At the command line where the server was started, enter Ctrl-C to stop the server

# Running tests

# Generating API Documentation 

Open a command prompt

In any folder, enter a command following the template:

```
jsdoc <path_to_file_1>.js <path_to_file_2>.js ...

jsdoc ...............(replace with files that have documentation)
```

From the folder in which `jsdoc` was executed, open the file out/index.html in a browser to view the generated documentation.
