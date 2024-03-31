'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Languagevariable = mongoose.model('Languagevariable'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  languagevariable;

/**
 * Languagevariable routes tests
 */
describe('Languagevariable CRUD tests', function () {

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

    // Save a user to the test db and create new Languagevariable
    user.save(function () {
      languagevariable = {
        name: 'Languagevariable name'
      };

      done();
    });
  });

  it('should be able to save a Languagevariable if logged in', function (done) {
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

        // Save a new Languagevariable
        agent.post('/api/languagevariables')
          .send(languagevariable)
          .expect(200)
          .end(function (languagevariableSaveErr, languagevariableSaveRes) {
            // Handle Languagevariable save error
            if (languagevariableSaveErr) {
              return done(languagevariableSaveErr);
            }

            // Get a list of Languagevariables
            agent.get('/api/languagevariables')
              .end(function (languagevariablesGetErr, languagevariablesGetRes) {
                // Handle Languagevariables save error
                if (languagevariablesGetErr) {
                  return done(languagevariablesGetErr);
                }

                // Get Languagevariables list
                var languagevariables = languagevariablesGetRes.body;

                // Set assertions
                (languagevariables[0].user._id).should.equal(userId);
                (languagevariables[0].name).should.match('Languagevariable name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Languagevariable if not logged in', function (done) {
    agent.post('/api/languagevariables')
      .send(languagevariable)
      .expect(403)
      .end(function (languagevariableSaveErr, languagevariableSaveRes) {
        // Call the assertion callback
        done(languagevariableSaveErr);
      });
  });

  it('should not be able to save an Languagevariable if no name is provided', function (done) {
    // Invalidate name field
    languagevariable.name = '';

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

        // Save a new Languagevariable
        agent.post('/api/languagevariables')
          .send(languagevariable)
          .expect(400)
          .end(function (languagevariableSaveErr, languagevariableSaveRes) {
            // Set message assertion
            (languagevariableSaveRes.body.message).should.match('Please fill Languagevariable name');

            // Handle Languagevariable save error
            done(languagevariableSaveErr);
          });
      });
  });

  it('should be able to update an Languagevariable if signed in', function (done) {
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

        // Save a new Languagevariable
        agent.post('/api/languagevariables')
          .send(languagevariable)
          .expect(200)
          .end(function (languagevariableSaveErr, languagevariableSaveRes) {
            // Handle Languagevariable save error
            if (languagevariableSaveErr) {
              return done(languagevariableSaveErr);
            }

            // Update Languagevariable name
            languagevariable.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Languagevariable
            agent.put('/api/languagevariables/' + languagevariableSaveRes.body._id)
              .send(languagevariable)
              .expect(200)
              .end(function (languagevariableUpdateErr, languagevariableUpdateRes) {
                // Handle Languagevariable update error
                if (languagevariableUpdateErr) {
                  return done(languagevariableUpdateErr);
                }

                // Set assertions
                (languagevariableUpdateRes.body._id).should.equal(languagevariableSaveRes.body._id);
                (languagevariableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Languagevariables if not signed in', function (done) {
    // Create new Languagevariable model instance
    var languagevariableObj = new Languagevariable(languagevariable);

    // Save the languagevariable
    languagevariableObj.save(function () {
      // Request Languagevariables
      request(app).get('/api/languagevariables')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Languagevariable if not signed in', function (done) {
    // Create new Languagevariable model instance
    var languagevariableObj = new Languagevariable(languagevariable);

    // Save the Languagevariable
    languagevariableObj.save(function () {
      request(app).get('/api/languagevariables/' + languagevariableObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', languagevariable.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Languagevariable with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/languagevariables/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Languagevariable is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Languagevariable which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Languagevariable
    request(app).get('/api/languagevariables/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Languagevariable with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Languagevariable if signed in', function (done) {
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

        // Save a new Languagevariable
        agent.post('/api/languagevariables')
          .send(languagevariable)
          .expect(200)
          .end(function (languagevariableSaveErr, languagevariableSaveRes) {
            // Handle Languagevariable save error
            if (languagevariableSaveErr) {
              return done(languagevariableSaveErr);
            }

            // Delete an existing Languagevariable
            agent.delete('/api/languagevariables/' + languagevariableSaveRes.body._id)
              .send(languagevariable)
              .expect(200)
              .end(function (languagevariableDeleteErr, languagevariableDeleteRes) {
                // Handle languagevariable error error
                if (languagevariableDeleteErr) {
                  return done(languagevariableDeleteErr);
                }

                // Set assertions
                (languagevariableDeleteRes.body._id).should.equal(languagevariableSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Languagevariable if not signed in', function (done) {
    // Set Languagevariable user
    languagevariable.user = user;

    // Create new Languagevariable model instance
    var languagevariableObj = new Languagevariable(languagevariable);

    // Save the Languagevariable
    languagevariableObj.save(function () {
      // Try deleting Languagevariable
      request(app).delete('/api/languagevariables/' + languagevariableObj._id)
        .expect(403)
        .end(function (languagevariableDeleteErr, languagevariableDeleteRes) {
          // Set message assertion
          (languagevariableDeleteRes.body.message).should.match('User is not authorized');

          // Handle Languagevariable error error
          done(languagevariableDeleteErr);
        });

    });
  });

  it('should be able to get a single Languagevariable that has an orphaned user reference', function (done) {
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

          // Save a new Languagevariable
          agent.post('/api/languagevariables')
            .send(languagevariable)
            .expect(200)
            .end(function (languagevariableSaveErr, languagevariableSaveRes) {
              // Handle Languagevariable save error
              if (languagevariableSaveErr) {
                return done(languagevariableSaveErr);
              }

              // Set assertions on new Languagevariable
              (languagevariableSaveRes.body.name).should.equal(languagevariable.name);
              should.exist(languagevariableSaveRes.body.user);
              should.equal(languagevariableSaveRes.body.user._id, orphanId);

              // force the Languagevariable to have an orphaned user reference
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

                    // Get the Languagevariable
                    agent.get('/api/languagevariables/' + languagevariableSaveRes.body._id)
                      .expect(200)
                      .end(function (languagevariableInfoErr, languagevariableInfoRes) {
                        // Handle Languagevariable error
                        if (languagevariableInfoErr) {
                          return done(languagevariableInfoErr);
                        }

                        // Set assertions
                        (languagevariableInfoRes.body._id).should.equal(languagevariableSaveRes.body._id);
                        (languagevariableInfoRes.body.name).should.equal(languagevariable.name);
                        should.equal(languagevariableInfoRes.body.user, undefined);

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
      Languagevariable.remove().exec(done);
    });
  });
});
