var express = require('express');
var router = express.Router();
var User = require('./users');
var fs = require('fs');
var { exec, spawn } = require('child_process');
var session = require('express-session');
const readlinePromises = require('node:readline/promises');
const { stdin } = require('process');

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
    const sessionUsername = req.session.username;
    console.log("EDITOR SESSION: ", sessionUser);
    //res.render('codeEditor', { user: sessionUser });
    if (sessionUser) {
        //User is logged in, you can use sessionUser here
        res.render('codeEditor', { user: sessionUser , username: sessionUsername});
    } else {
        res.redirect('/users/login');
    }
});

router.post('/getInput', (req, res) => {
    const userInput = req.body.userInput;
    // Here you can process the input further, or send a response back to the client
    res.send(userInput).status(200);
});

router.post('/runcode', async (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;

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
        if (err) {
            console.error('Error saving Java code:', err);
            return res.status(500).send('Error saving Java code');
        }

        console.log(`Java code saved to ${tempFilePath}`);
        res.status(200).send('Java code saved successfully');
    });
});



module.exports = router;


//TODO
//reading a file
//works with a file stored on my machine need to have a file upload to have it on the server.
//and then tell them it is in the same folder so "./text.txt" to get the text file
//^^ This is insecure only want them to read files in there folder.
//When addind sanitaztion check for that
//INFINITE LOOP
//control c to exit