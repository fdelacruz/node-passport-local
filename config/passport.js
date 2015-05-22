var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// seed a user
var user = new User({
	username: 'chris',
	email: 'chris@example.com',
	password: 'test'
});

user.save(function(err, user) {
	if (err) {
		console.log(err);
	} else {
		console.log('Seeded user');
	}
});

// sessions serialization
passport.serializeUser(function(user, next) {
	// convert user object to session-storing id
	next(null, user._id);
});

passport.deserializeUser(function(id, next) {
	// convert session-stored id into a user object
	User.findById(id, function(err, user) {
		next(err, user);
	});
});


// STRATEGIES:
var LocalStrategy = new LocalStrategy(
	function(username, password, next) {
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) {
				return next(err)
			}

			if (!user) {
				return next(null, false);
			}

			// give username matches a database document
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					return next(err);
				}

				if (isMatch) {
					return next(null, user);
				} else {
					return next(null, false);
				}

			});
		});
	}
);

passport.use(LocalStrategy);
