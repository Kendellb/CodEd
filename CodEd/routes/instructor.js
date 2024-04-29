/**
 * Express router module for handling routes related to the home page.
 */

var express = require('express');
var router = express.Router();
var User = require('../model/user');

/**
 * Route for rendering the home page.
 * @name GET_home_page
 * @route {GET} /
 * @async
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get('/', async function (req, res, next) {
  const userID = req.session.user.uniqueID;
  const sessionUser = req.session.user;

  if (sessionUser.accountType === 'instructor') {
    try {
      const instructor = await User.findOne({ uniqueID: userID });
      if (!instructor) {
        return res.status(404).send("Instructor not found");
      }

      const userUploadsIndex = instructor.userUploads.findIndex(upload => upload.uniqueID === userID);

      // Render the instructor.ejs template with instructor's data and the userUploadsIndex
      res.render('instructor', {
        username: instructor.username,
        userUploads: instructor.userUploads,
        userUploadsIndex: userUploadsIndex
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
  else {
    res.redirect('/users/login');
  }
});

module.exports = router;
