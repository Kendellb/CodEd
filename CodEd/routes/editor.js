var express = require('express');
var router = express.Router();
var User = require('./users');
var fs = require('fs');
const { exec } = require('child_process');
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
    const userId = req.session.user.uniqueID;
    console.log('userId',userId);

    const tempFilePath = `./tmpJava/${userId}/Main.java`;
    const tempFileDir = `./tmpJava/${userId}`;
    if (!fs.existsSync(tempFileDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(tempFileDir);
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

        exec(`javac ${tempFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Compilation error: ${error.message}`);
                //return res.status(500).send('Compilation error');
                const errorMessage = stderr.replace(new RegExp(tempFilePath, 'g'), 'Main.java');
                return res.send(errorMessage).status(500);
            }

            console.log(`Compilation success: ${stdout}`);

            exec(`java -classpath ./tmpJava/${userId} Main`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Execution error: ${error.message}`);
                    return res.status(500).send('Execution error');
                }

                console.log(`Output: ${stdout}`);
                res.send(stdout);
            });
        });
    });
});

module.exports = router;