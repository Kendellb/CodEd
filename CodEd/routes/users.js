var express = require('express');
var router = express.Router();
var User = require('../model/user');
var session = require('express-session');

router.use(session({
  secret: 'secret', //unsecure change later.
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 3600000}
}));

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
});
*/

//POST for register a user 
router.post('/register', async function(req,res){
  try {
    const { username } = req.body;


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      //res.send("Username already exists").status(400);
      res.status(400).send("Username already exists");
    }
    else{

    const newUser = new User({ username });

    await newUser.save();

    //res.status(201).json({ message: 'User registered successfully', user: newUser });
    //redirct back to login to avoid bugs with session.
    res.status(201).redirect('/users/login');
    }
  } 

  catch (error) {
    //console.error("Internal server error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

//POST used to login set the session to the username and then redirect to the code window
router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
      const foundUser = await User.findOne({ username });
      if (foundUser) {
          req.session.user = foundUser;
          res.status(201).redirect('/editor');
      } else {
          res.status(400).send("Invalid username");
      }
  } catch (error) {
      //console.error("Internal server error:", error);
      res.status(500).send('Internal server error');
  }
});

// POST used to save the code written to the user session
router.post('/updateUserData', async (req,res) =>{
  const userData = req.body.userData;
  const userId = req.session.user.uniqueID;

  try {
    //find the user in the DB by there uniqueID
    const user = await User.findOne({ uniqueID: userId });

    if (!user) {
        return res.status(404).send('User not found');
    }

    //Save the Code taken in from the submitButtonEvent
    // POST method and saves it to the user in the DB.
    user.userCodeData = userData;

    await user.save();

    res.status(200).send('User data updated and saved successfully');
} catch (error) {
    //console.error('Error updating user data:', error);
    res.status(500).send('Internal server error');
}

});

//get the code from the db using the users session 
router.get('/current-user-data', (req, res) => {
  // Check if user is authenticated
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Get the current user's ID from the session
  const userId = req.session.user;

  // Fetch user data using the User model
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userCodeData = user.userCodeData;
      res.status(200).send(userCodeData);
    })
    .catch(error => {
      //console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


module.exports = router;
