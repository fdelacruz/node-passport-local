var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.pre('save', function(next) {
	// check if this is a new password	
	if (!this.isModified('password')) {
		return  next();
	}

	// initialize encryption
	var user = this;
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}

		// we have a successful salt value
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}

			// we have a successfully encrypted password!
			user.password = hash;
			next();
		});
	});
});

var User = mongoose.model('User', userSchema);
module.exports = User;
