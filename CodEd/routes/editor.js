var express = require('express');
var router = express.Router();
var fs = require('fs');
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
    const sessionUsername = req.session.username;
    const sessionUserID = req.session.uniqueID;
    //console.log("EDITOR SESSION: ", sessionUser);
    //res.render('codeEditor', { user: sessionUser });
    if (sessionUser) {
        //User is logged in, you can use sessionUser here
        res.render('codeEditor', { user: sessionUser , username: sessionUsername});
    } else {
        res.redirect('/users/login');
    }
});



router.post('/runcode', async (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;

    const tempFilePath = `../Websocket/Code/${userID}/Main.java`;
    const tempFileDir = `../Websocket/Code/${userID}`;
    
    if (!fs.existsSync(tempFileDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(tempFileDir, { recursive: true });
        //console.log(`Directory '${tempFileDir}' created successfully.`);
    } else {
        //console.log(`Directory '${tempFileDir}' already exists.`);
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

router.get('/get-userID', (req,res) =>{
    res.send(req.session.userID).status(200);
});



module.exports = router;
