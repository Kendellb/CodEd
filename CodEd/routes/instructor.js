var express = require('express');
var router = express.Router();
var User = require('../model/user');


/* GET home page. */
router.get('/', async function(req, res, next) {
   const userID = req.session.user.uniqueID;
   //console.log('userID',userID);
  try{ 
    const instructor = await User.findOne({ uniqueID: userID });
    if (!instructor) {
      return res.status(404).send("Instructor not found");
  }

  // Render the instructor.ejs template with instructor's data
  res.render('instructor', { username: instructor.username, userUploads: instructor.userUploads });
} catch (err) {
  console.error(err);
  res.status(500).send("Server Error");
}
});

module.exports = router;