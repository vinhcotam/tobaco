'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Keyinformant = mongoose.model('Keyinformant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  keyinformant;

/**
 * Keyinformant routes tests
 */
describe('Keyinformant CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Keyinformant
    user.save(function () {
      keyinformant = {
        name: 'Keyinformant name'
      };

      done();
    });
  });

  it('should be able to save a Keyinformant if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Keyinformant
        agent.post('/api/keyinformants')
          .send(keyinformant)
          .expect(200)
          .end(function (keyinformantSaveErr, keyinformantSaveRes) {
            // Handle Keyinformant save error
            if (keyinformantSaveErr) {
              return done(keyinformantSaveErr);
            }

            // Get a list of Keyinformants
            agent.get('/api/keyinformants')
              .end(function (keyinformantsGetErr, keyinformantsGetRes) {
                // Handle Keyinformants save error
                if (keyinformantsGetErr) {
                  return done(keyinformantsGetErr);
                }

                // Get Keyinformants list
                var keyinformants = keyinformantsGetRes.body;

                // Set assertions
                (keyinformants[0].user._id).should.equal(userId);
                (keyinformants[0].name).should.match('Keyinformant name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Keyinformant if not logged in', function (done) {
    agent.post('/api/keyinformants')
      .send(keyinformant)
      .expect(403)
      .end(function (keyinformantSaveErr, keyinformantSaveRes) {
        // Call the assertion callback
        done(keyinformantSaveErr);
      });
  });

  it('should not be able to save an Keyinformant if no name is provided', function (done) {
    // Invalidate name field
    keyinformant.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Keyinformant
        agent.post('/api/keyinformants')
          .send(keyinformant)
          .expect(400)
          .end(function (keyinformantSaveErr, keyinformantSaveRes) {
            // Set message assertion
            (keyinformantSaveRes.body.message).should.match('Please fill Keyinformant name');

            // Handle Keyinformant save error
            done(keyinformantSaveErr);
          });
      });
  });

  it('should be able to update an Keyinformant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Keyinformant
        agent.post('/api/keyinformants')
          .send(keyinformant)
          .expect(200)
          .end(function (keyinformantSaveErr, keyinformantSaveRes) {
            // Handle Keyinformant save error
            if (keyinformantSaveErr) {
              return done(keyinformantSaveErr);
            }

            // Update Keyinformant name
            keyinformant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Keyinformant
            agent.put('/api/keyinformants/' + keyinformantSaveRes.body._id)
              .send(keyinformant)
              .expect(200)
              .end(function (keyinformantUpdateErr, keyinformantUpdateRes) {
                // Handle Keyinformant update error
                if (keyinformantUpdateErr) {
                  return done(keyinformantUpdateErr);
                }

                // Set assertions
                (keyinformantUpdateRes.body._id).should.equal(keyinformantSaveRes.body._id);
                (keyinformantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Keyinformants if not signed in', function (done) {
    // Create new Keyinformant model instance
    var keyinformantObj = new Keyinformant(keyinformant);

    // Save the keyinformant
    keyinformantObj.save(function () {
      // Request Keyinformants
      request(app).get('/api/keyinformants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Keyinformant if not signed in', function (done) {
    // Create new Keyinformant model instance
    var keyinformantObj = new Keyinformant(keyinformant);

    // Save the Keyinformant
    keyinformantObj.save(function () {
      request(app).get('/api/keyinformants/' + keyinformantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', keyinformant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Keyinformant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/keyinformants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Keyinformant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Keyinformant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Keyinformant
    request(app).get('/api/keyinformants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Keyinformant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Keyinformant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Keyinformant
        agent.post('/api/keyinformants')
          .send(keyinformant)
          .expect(200)
          .end(function (keyinformantSaveErr, keyinformantSaveRes) {
            // Handle Keyinformant save error
            if (keyinformantSaveErr) {
              return done(keyinformantSaveErr);
            }

            // Delete an existing Keyinformant
            agent.delete('/api/keyinformants/' + keyinformantSaveRes.body._id)
              .send(keyinformant)
              .expect(200)
              .end(function (keyinformantDeleteErr, keyinformantDeleteRes) {
                // Handle keyinformant error error
                if (keyinformantDeleteErr) {
                  return done(keyinformantDeleteErr);
                }

                // Set assertions
                (keyinformantDeleteRes.body._id).should.equal(keyinformantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Keyinformant if not signed in', function (done) {
    // Set Keyinformant user
    keyinformant.user = user;

    // Create new Keyinformant model instance
    var keyinformantObj = new Keyinformant(keyinformant);

    // Save the Keyinformant
    keyinformantObj.save(function () {
      // Try deleting Keyinformant
      request(app).delete('/api/keyinformants/' + keyinformantObj._id)
        .expect(403)
        .end(function (keyinformantDeleteErr, keyinformantDeleteRes) {
          // Set message assertion
          (keyinformantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Keyinformant error error
          done(keyinformantDeleteErr);
        });

    });
  });

  it('should be able to get a single Keyinformant that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Keyinformant
          agent.post('/api/keyinformants')
            .send(keyinformant)
            .expect(200)
            .end(function (keyinformantSaveErr, keyinformantSaveRes) {
              // Handle Keyinformant save error
              if (keyinformantSaveErr) {
                return done(keyinformantSaveErr);
              }

              // Set assertions on new Keyinformant
              (keyinformantSaveRes.body.name).should.equal(keyinformant.name);
              should.exist(keyinformantSaveRes.body.user);
              should.equal(keyinformantSaveRes.body.user._id, orphanId);

              // force the Keyinformant to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Keyinformant
                    agent.get('/api/keyinformants/' + keyinformantSaveRes.body._id)
                      .expect(200)
                      .end(function (keyinformantInfoErr, keyinformantInfoRes) {
                        // Handle Keyinformant error
                        if (keyinformantInfoErr) {
                          return done(keyinformantInfoErr);
                        }

                        // Set assertions
                        (keyinformantInfoRes.body._id).should.equal(keyinformantSaveRes.body._id);
                        (keyinformantInfoRes.body.name).should.equal(keyinformant.name);
                        should.equal(keyinformantInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Keyinformant.remove().exec(done);
    });
  });
});
