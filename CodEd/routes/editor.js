/**
 * Express router module for handling routes related to code editing and submission.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var session = require('express-session');
var User = require('../model/user');

/**
 * Express session middleware.
 * @name sessionMiddleware
 * @memberof module:routes/codeEditor
 */
router.use(session({
    secret: 'secret', //unsecure change later.
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

/**
 * Route for rendering the home page.
 * @name GET_home_page
 * @route {GET} /
 * @async
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get('/', async function (req, res, next) {
    // Retrieve the session user
    const sessionUser = req.session.user;
    const sessionUsername = req.session.username;
    const UserID = req.session.uniqueID;
    const sessionAccountType = req.session.accountType;

    const instructors = await User.find({ accountType: 'instructor' }, 'username');

    if (sessionUser) {
        //User is logged in
        res.render('codeEditor', { user: sessionUser, username: sessionUsername, accountType: sessionAccountType, instructors: instructors });
    } else {
        res.redirect('/users/login');
    }
});

/**
 * Route for saving Java code to a file.
 * @name POST_runcode
 * @route {POST} /runcode
 * @async
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/runcode', async (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;

    const tempFilePath = `../Websocket/Code/${userID}/Main.java`;
    const tempFileDir = `../Websocket/Code/${userID}`;

    if (!fs.existsSync(tempFileDir)) {
        fs.mkdirSync(tempFileDir, { recursive: true });
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

/**
 * Route for saving uploaded Java code to a file.
 * @name POST_runcodeUpload
 * @route {POST} /runcodeUpload
 * @async
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/runcodeUpload', async (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;
    const submissionUserID = req.query.userID;

    const tempFilePath = `../Websocket/Code/${submissionUserID}/Main.java`;
    const tempFileDir = `../Websocket/Code/${submissionUserID}`;

    if (!fs.existsSync(tempFileDir)) {
        fs.mkdirSync(tempFileDir, { recursive: true });
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

/**
 * Route for getting the user ID from the session.
 * @name GET_get-userID
 * @route {GET} /get-userID
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/get-userID', (req, res) => {
    res.send(req.session.userID).status(200);
});

/**
 * Route for getting the combined user ID.
 * @name GET_get-uploadID
 * @route {GET} /get-uploadID
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/get-uploadID', (req, res) => {
    const sessionUserID = req.session.userID;
    const queryUserID = req.query.userID;
    const combinedUserID = sessionUserID + ' ' + queryUserID;

    res.status(200).send(combinedUserID);
});

/**
 * Route for getting the index.
 * @name GET_index
 * @route {GET} /index
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/index', (req, res) => {
    const index = req.query.index;
    res.status(200).send(index);
});

/**
 * Route for handling the upload operation.
 * @name POST_upload
 * @route {POST} /upload
 * @async
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/upload', async (req, res) => {
    try {
        // Get data from the request body
        const instructorName = req.body.instructorName;
        const uploadData = req.body.uploadData;
        const userID = req.session.user.uniqueID;
        const timestamp = req.body.formattedDateTime;

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

        let userExists = false;
        instructor.userUploads.forEach((item, i) => {
            if (item.uniqueID === usersUploadData.uniqueID) {
                // If uniqueID already exists, replace the data at that index
                instructor.userUploads[i] = usersUploadData;
                userExists = true;
                return;
            }
        });
        if(!userExists){
            // If uniqueID doesn't exist push to the array
            instructor.userUploads.push(usersUploadData);
        }
        
        await instructor.save();

        return res.status(200).json({ message: 'Upload successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * Route for rendering the student submission editor page.
 * @name GET_studentSubmissionEditor
 * @route {GET} /studentSubmissonEditor
 * @async
 * @function
 * @memberof module:routes/codeEditor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get('/studentSubmissonEditor', async function (req, res, next) {
    const sessionUser = req.session.user;
    const sessionUsername = req.session.username;
    const sessionAccountType = req.session.accountType;
    const userID = req.query.userID;

    if (sessionAccountType === 'instructor') {
        res.render('studentSubmissonEditor', { user: sessionUser, username: sessionUsername, userID: userID });
    } else {
        res.send("Have to be an instructor");
    }
});

module.exports = router;
