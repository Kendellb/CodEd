const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Represents a User in the database.
 * @class
 * @param {UserSchema} userSchema - The schema for user data.
 * @property {string} username - The username of the user. Required.
 * @property {string} uniqueID - The unique identifier for the user. Automatically generated if not provided.
 * @property {string} userCodeData - Additional data associated with the user.
 */

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    uniqueID: {
        type: String,
        //required: true,
        unique: true
    },
    userCodeData: {
        type: String,
    },
    accountType: {
        type: String,
        enum: ['student', 'instructor'],
        required: true
    },
     userUploads: {
        type: [String], // Assuming this is an array of upload IDs or paths
        default: [],
        select: false // Hide this field by default
    }
});

/**
 * Middleware to generate a uniqueID before saving if it doesn't exist.
 * @function
 * @param {Function} next - The next function in the middleware chain.
 * @returns {void}
 */
userSchema.pre('save', function (next) {
    if (!this.uniqueID) {
        this.uniqueID = this.username + '-' + uuidv4().replace(/-/g, '').substring(0, 8);
    }
    next();
});

userSchema.pre('save', function(next) {
    if (this.accountType === 'instructor') {
        if (!this.userUploads) {
            this.userUploads = [];
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;