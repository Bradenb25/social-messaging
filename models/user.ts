var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    email: String,
    user_name: String,
    hashed_password: String,
    first_name: String,
}); 

export class User {
    userName: string;
    password: string;
}