const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    uniqueID:{
        type: String,
        required: true,
        unique: true
    }
  });

  userSchema.pre('save', function(next){
    if(!this.uniqueID){
        this.uniqueID = this.userName + '-' + uuidv4().replace(/-/g, '').substring(0,8);
    }
    next();
  });

  const User = mongoose.model('User',userSchema);

  module.exports = User;