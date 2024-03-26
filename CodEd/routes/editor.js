var express = require('express');
var router = express.Router();
var User = require('./users');
var fs = require('fs');
var { exec, spawn } = require('child_process');
var session = require('express-session');

router.use(session({
    secret: 'secret', //unsecure change later.
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

/* GET home page. */
router.get('/', async function (req, res, next) {
    //res.render('codeEditor', { title: 'Express' });
    // Retrieve the session user
    const sessionUser = req.session.user;
    console.log("EDITOR SESSION: ", sessionUser);
    //res.render('codeEditor', { user: sessionUser });
    if (sessionUser) {
        //User is logged in, you can use sessionUser here
        res.render('codeEditor', { user: sessionUser });
    } else {
        res.redirect('/users/login');
    }
});

router.post('/runcode', (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;
    console.log('userId', userID);

    const tempFilePath = `./tmpJava/${userID}/Main.java`;
    const tempFileDir = `./tmpJava/${userID}`;
    if (!fs.existsSync(tempFileDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(tempFileDir, { recursive: true });
        console.log(`Directory '${tempFileDir}' created successfully.`);
    } else {
        console.log(`Directory '${tempFileDir}' already exists.`);
    }

    fs.writeFile(tempFilePath, javaCode, (err) => {
        //NEED TO SANITIZE DATA LATER FOR SECURITY
        if (err) {
            console.error('Error saving Java code:', err);
            return res.status(500).send('Error saving Java code');
        }

        console.log(`Java code saved to ${tempFilePath}`);

    });




// Compile Java file
const compileProcess = spawn('javac', [tempFilePath]);

compileProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  compileProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  compileProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Java file compiled successfully');
  
      // Run Java class file
      const javaProcess = spawn(`java`, [`-classpath`,`./tmpJava/${userID}`, `Main`]);
      const inputString = 'Input from Node.js';
      javaProcess.stdin.write(inputString + '\n');
      javaProcess.stdin.end();

      javaProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
  
      javaProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
  
      javaProcess.on('close', (code) => {
        console.log('Java process exited with code', code);
      });
    } else {
      console.error('Error compiling Java file');
    }
  });



});


module.exports = router;


//TODO
// FIX IF THERE IS AN ERROR
//get input scanner class
//reading a file
//INFINITE LOOP
//test common java errors