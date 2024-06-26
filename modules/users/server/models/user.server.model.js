'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  chalk = require('chalk');
const jwt = require('jsonwebtoken');
owasp.config(config.shared.owasp);


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * A Validation function for username
 * - at least 3 characters
 * - only a-z0-9_-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok, ".." nope
 * - not begin or end with "."
 */

var validateUsername = function (username) {
  var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (
    this.provider !== 'local' ||
    (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
  );
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: 'Please fill in a password',
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: '/modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'manager', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tokens: [{
    token: {
      type: String,
    }
  }]
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
* Generates a random passphrase that passes the owasp test
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occurred while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

UserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  let jwtKey = process.env.JWT_KEY || 'tabao';
  const token = jwt.sign({ _id: user._id }, jwtKey);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

UserSchema.statics.findByCredentials = async (username, password) => {
  var User = mongoose.model('User');
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  // let hashPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'SHA1').toString('base64');
  let hashPassword = crypto.pbkdf2Sync(password, new Buffer(user.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  if (user.password !== hashPassword) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
}


UserSchema.statics.seed = seed;

mongoose.model('User', UserSchema);

/**
* Seeds the User collection with document (User)
* and provided options.
*/
function seed(doc, options) {
  var User = mongoose.model('User');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        User
          .findOne({
            username: doc.username
          })
          .then((existing) => {
            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }
            // Remove User (overwrite)
            existing.deleteOne()
              .then(() => {
                return resolve(false);
              })
              .catch((err) => {
                if (err) {
                  return reject(err);
                }
              });
          })
          .catch((err) => {
            if (err) {
              return reject(err);
            }
          });
          //.exec(function (err, existing) {
          //  if (err) {
          //    return reject(err);
          //  }

          //  if (!existing) {
          //    return resolve(false);
          //  }

          //  if (existing && !options.overwrite) {
          //    return resolve(true);
          //  }

          //  // Remove User (overwrite)

          //  existing.remove(function (err) {
          //    if (err) {
          //      return reject(err);
          //    }

          //    return resolve(false);
          //  });
          //});
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {

        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: User\t\t' + doc.username + ' skipped')
          });
        }

        User.generateRandomPassphrase()
          .then(function (passphrase) {
            var user = new User(doc);

            user.provider = 'local';
            user.displayName = user.firstName + ' ' + user.lastName;
            //user.password = passphrase;
            user.password = 'Qazxsw@123';
            user.save()
              .then((user) => {
                return resolve({
                  message: 'Database Seeding: User\t\t' + user.username + ' added with password set to ' + passphrase
                });
              })
              .catch((err) => {
                if (err) {
                  return reject(err);
                }
              });
            
            //user.save(function (err) {
            //  if (err) {
            //    return reject(err);
            //  }

            //  return resolve({
            //    message: 'Database Seeding: User\t\t' + user.username + ' added with password set to ' + passphrase
            //  });
            //});
          })
          .catch(function (err) {
            return reject(err);
          });
      });
    }
  });
}
