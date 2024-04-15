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
    userUploads: [{
        userdata: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
        },
        uniqueID: {
            type: String,
            required: true,
        }
    }]
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
        this.userUploads = this.userUploads || []; // Ensure userUploads is initialized as an array
    }
    next();
});

// Set the select option on the schema directly
userSchema.set('toObject', { select: { userUploads: false } });
userSchema.set('toJSON', { select: { userUploads: false } });

const User = mongoose.model('User', userSchema);

module.exports = User;