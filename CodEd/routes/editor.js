var express = require('express');
var router = express.Router();
var fs = require('fs');
var session = require('express-session');
var User = require('../model/user');

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
    const UserID = req.session.uniqueID;
    const sessionAccountType = req.session.accountType;
    //console.log("EDITOR SESSION: ", sessionUser);
    //res.render('codeEditor', { user: sessionUser });

    const instructors = await User.find({ accountType: 'instructor' }, 'username'); // Filter users by accountType
    if (sessionUser) {
        //User is logged in, you can use sessionUser here
        res.render('codeEditor', { user: sessionUser, username: sessionUsername, accountType: sessionAccountType, instructors: instructors });
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

router.post('/runcodeUpload', async (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;
    //console.log("USERID:",userID);
    const submissionUserID = req.query.userID;
    console.log("USERID:",submissionUserID);

    const tempFilePath = `../Websocket/Code/${submissionUserID}/Main.java`;
    const tempFileDir = `../Websocket/Code/${submissionUserID}`;

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

router.get('/get-userID', (req, res) => {
    res.send(req.session.userID).status(200);
});

router.get('/get-uploadID', (req, res) => {
    const sessionUserID = req.session.userID;
    const queryUserID = req.query.userID;
    console.log("query:",queryUserID);
    const combinedUserID = sessionUserID + ' ' + queryUserID;

    res.status(200).send(combinedUserID);
});

router.get('/index', (req,res) => {
    const index = req.query.index;
    res.status(200).send(index);
});

// Route to handle the upload operation
router.post('/upload', async (req, res) => {
    try {
        // Get data from the request body
        const instructorName = req.body.instructorName;
        const uploadData = req.body.uploadData;
        const userID = req.session.user.uniqueID;
        const timestamp = req.body.formattedDateTime;

        //console.log(instructorName);
        //console.log(uploadData);

        // Find the instructor by username
        const instructor = await User.findOne({ username: instructorName });

        if (!instructor) {
            return res.status(405).json({ message: 'Instructor not found.' });
        }

        // Check if the current user is a student
        if (instructor.accountType === 'student') {
            return res.status(403).json({ message: 'Can Only Upload to Instructors.' });
        }

        // Add upload data to the instructor's userUploads array
        const usersUploadData = {
            userdata: uploadData,
            timestamp: timestamp,
            uniqueID: userID,
        };

        instructor.userUploads.push(usersUploadData);

        console.log(`\nLast upload Time Stamp: ${usersUploadData.timestamp}\n`); // Access timestamp from uploadData object

        await instructor.save();

        return res.status(200).json({ message: 'Upload successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/studentSubmissonEditor', async function (req, res, next) {
    //res.render('codeEditor', { title: 'Express' });
    // Retrieve the session user
    const sessionUser = req.session.user;
    //console.log(sessionUser);
    const sessionUsername = req.session.username;
    const sessionAccountType = req.session.accountType;
    const userID = req.query.userID;
    //console.log(userID);

    if (sessionAccountType === 'instructor') {
        //User is logged in, you can use sessionUser here
        res.render('studentSubmissonEditor', { user: sessionUser, username: sessionUsername, userID: userID });
    } else {
        res.send("Have to be an instructor");
    }
});




module.exports = router;
