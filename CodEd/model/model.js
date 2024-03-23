const user = require('./user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');

    // Create a new user document
    const newUser = new User({
        userName: 'john_doe',
        userID: '123456789'
    });

    // Save the user document to the database
    newUser.save()
    .then((savedUser) => {
        console.log('User saved successfully:', savedUser);
    })
    .catch((error) => {
        console.error('Error saving user:', error);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


