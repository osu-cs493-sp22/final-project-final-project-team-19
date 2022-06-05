const { Schema, mongoose } = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        set: (password) => {
            return bcrypt.hashSync(password, 10);
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'], // verify role is valid
        default: 'student'
    }
})
exports.userSchema = userSchema

const User = mongoose.model('User', userSchema)
exports.User = User