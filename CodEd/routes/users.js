var express = require('express');
var router = express.Router();
var User = require('../model/user');
var session = require('express-session');

router.use(session({
    secret: 'mySecret', // Replace 'mySecret' with your actual secret
    resave: false,
    saveUninitialized: false
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(req,res){
  try {
    const { username } = req.body;


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username });

    await newUser.save();

    //res.status(201).json({ message: 'User registered successfully', user: newUser });
    res.redirect('/');
  } 

  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
      const foundUser = await User.findOne({ username });
      if (foundUser) {
          req.session.user = foundUser;
          res.redirect('/');
      } else {
          res.send('Invalid username');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});


router.post('/updateUserData', async (req,res) =>{
  const userData = req.body.userData;
  const userId = req.session.user.uniqueID;

  try {
    //find the user in the DB by there uniqueID
    const user = await User.findOne({ uniqueID: userId });

    //If no user is found send an error.
    if (!user) {
        return res.status(404).send('User not found');
    }

    //Save the Code taken in from the submitButton.js POST method and saves it to the user in the DB.
    user.userCodeData = userData;

    await user.save();

    res.status(200).send('User data updated and saved successfully');
} catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Internal server error');
}

});


module.exports = router;
