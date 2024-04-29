/**
 * Express router module for handling user-related routes.
 */

var express = require('express');
var router = express.Router();
var User = require('../model/user');
var session = require('express-session');

// Session middleware
router.use(session({
  secret: 'secret', //unsecure change later.
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 3600000}
}));

/**
 * Route for registering a new user.
 * @name POST_register
 * @route {POST} /register
 * @async
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/register', async function(req,res){
  try {
    const { username, accountType } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).send("Username already exists");
    }
    else{
      const newUser = new User({ username,accountType });
      await newUser.save();
      res.status(201).redirect('/users/login');
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Route for rendering the registration page.
 * @name GET_register
 * @route {GET} /register
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/register', function(req, res, next) {
  res.render('register').status(200);
});

/**
 * Route for rendering the login page.
 * @name GET_login
 * @route {GET} /login
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/login', function(req, res, next) {
  res.render('login').status(200);
});

/**
 * Route for logging in a user and setting session data.
 * @name POST_login
 * @route {POST} /login
 * @async
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        req.session.user = foundUser;
        req.session.username = foundUser.username;
        req.session.userID = foundUser.uniqueID;
        req.session.accountType = foundUser.accountType;
        if(foundUser.accountType === 'student'){
          res.status(201).redirect('/editor');
        }
        if(foundUser.accountType === 'instructor' ){
          res.status(201).redirect('/instructor');
        }
    } else {
        res.status(400).send("Invalid username");
    }
  } catch (error) {
      res.status(500).send('Internal server error');
  }
});

/**
 * Route for updating and saving user code data.
 * @name POST_updateUserData
 * @route {POST} /updateUserData
 * @async
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/updateUserData', async (req,res) =>{
  const userData = req.body.userData;
  const userId = req.session.user.uniqueID;

  try {
    const user = await User.findOne({ uniqueID: userId });

    if (!user) {
        return res.status(404).send('User not found');
    }

    user.userCodeData = userData;

    await user.save();

    res.status(200).send('User data updated and saved successfully');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

/**
 * Route for getting the current user's code data.
 * @name GET_currentUserData
 * @route {GET} /current-user-data
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/current-user-data', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userID = req.session.user;

  User.findById(userID)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userCodeData = user.userCodeData;
      res.status(200).send(userCodeData);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

/**
 * Route for getting instructor's uploaded data.
 * @name GET_uploadData
 * @route {GET} /upload-data
 * @async
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/upload-data', async (req,res) =>{
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userID = req.session.user;

  try {
    const instructor = await User.findById(userID);
    
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    if(instructor.accountType === 'student'){
      return res.status(500).json({error: "Only Instructors can use this method"});
    }

    const index = parseInt(req.query.index);

    if (isNaN(index) || index < 0 || index >= instructor.userUploads.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }

    const userData = instructor.userUploads[index].userdata;

    res.status(200).send(userData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

