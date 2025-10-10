const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // MUST be bcryptjs (or bcrypt if installed)

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// PRE-SAVE HOOK: Hash the password before saving a new user
UserSchema.pre('save', async function (next) {
    // Only hash if the password field was modified (new user or password change)
    if (!this.isModified('password')) {
        return next(); // Use return here to be explicit
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// METHOD: Compare the entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // This uses bcryptjs to compare the plain text with the hash from the DB
    return await bcrypt.compare(enteredPassword, this.password); 
};

module.exports = mongoose.model('User', UserSchema);
