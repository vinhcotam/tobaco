'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Newsdaily = mongoose.model('Newsdaily'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  newsdaily;

/**
 * Newsdaily routes tests
 */
describe('Newsdaily CRUD tests', function () {

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

    // Save a user to the test db and create new Newsdaily
    user.save(function () {
      newsdaily = {
        name: 'Newsdaily name'
      };

      done();
    });
  });

  it('should be able to save a Newsdaily if logged in', function (done) {
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

        // Save a new Newsdaily
        agent.post('/api/newsdailies')
          .send(newsdaily)
          .expect(200)
          .end(function (newsdailySaveErr, newsdailySaveRes) {
            // Handle Newsdaily save error
            if (newsdailySaveErr) {
              return done(newsdailySaveErr);
            }

            // Get a list of Newsdailies
            agent.get('/api/newsdailies')
              .end(function (newsdailiesGetErr, newsdailiesGetRes) {
                // Handle Newsdailies save error
                if (newsdailiesGetErr) {
                  return done(newsdailiesGetErr);
                }

                // Get Newsdailies list
                var newsdailies = newsdailiesGetRes.body;

                // Set assertions
                (newsdailies[0].user._id).should.equal(userId);
                (newsdailies[0].name).should.match('Newsdaily name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Newsdaily if not logged in', function (done) {
    agent.post('/api/newsdailies')
      .send(newsdaily)
      .expect(403)
      .end(function (newsdailySaveErr, newsdailySaveRes) {
        // Call the assertion callback
        done(newsdailySaveErr);
      });
  });

  it('should not be able to save an Newsdaily if no name is provided', function (done) {
    // Invalidate name field
    newsdaily.name = '';

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

        // Save a new Newsdaily
        agent.post('/api/newsdailies')
          .send(newsdaily)
          .expect(400)
          .end(function (newsdailySaveErr, newsdailySaveRes) {
            // Set message assertion
            (newsdailySaveRes.body.message).should.match('Please fill Newsdaily name');

            // Handle Newsdaily save error
            done(newsdailySaveErr);
          });
      });
  });

  it('should be able to update an Newsdaily if signed in', function (done) {
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

        // Save a new Newsdaily
        agent.post('/api/newsdailies')
          .send(newsdaily)
          .expect(200)
          .end(function (newsdailySaveErr, newsdailySaveRes) {
            // Handle Newsdaily save error
            if (newsdailySaveErr) {
              return done(newsdailySaveErr);
            }

            // Update Newsdaily name
            newsdaily.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Newsdaily
            agent.put('/api/newsdailies/' + newsdailySaveRes.body._id)
              .send(newsdaily)
              .expect(200)
              .end(function (newsdailyUpdateErr, newsdailyUpdateRes) {
                // Handle Newsdaily update error
                if (newsdailyUpdateErr) {
                  return done(newsdailyUpdateErr);
                }

                // Set assertions
                (newsdailyUpdateRes.body._id).should.equal(newsdailySaveRes.body._id);
                (newsdailyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Newsdailies if not signed in', function (done) {
    // Create new Newsdaily model instance
    var newsdailyObj = new Newsdaily(newsdaily);

    // Save the newsdaily
    newsdailyObj.save(function () {
      // Request Newsdailies
      request(app).get('/api/newsdailies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Newsdaily if not signed in', function (done) {
    // Create new Newsdaily model instance
    var newsdailyObj = new Newsdaily(newsdaily);

    // Save the Newsdaily
    newsdailyObj.save(function () {
      request(app).get('/api/newsdailies/' + newsdailyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', newsdaily.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Newsdaily with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/newsdailies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Newsdaily is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Newsdaily which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Newsdaily
    request(app).get('/api/newsdailies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Newsdaily with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Newsdaily if signed in', function (done) {
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

        // Save a new Newsdaily
        agent.post('/api/newsdailies')
          .send(newsdaily)
          .expect(200)
          .end(function (newsdailySaveErr, newsdailySaveRes) {
            // Handle Newsdaily save error
            if (newsdailySaveErr) {
              return done(newsdailySaveErr);
            }

            // Delete an existing Newsdaily
            agent.delete('/api/newsdailies/' + newsdailySaveRes.body._id)
              .send(newsdaily)
              .expect(200)
              .end(function (newsdailyDeleteErr, newsdailyDeleteRes) {
                // Handle newsdaily error error
                if (newsdailyDeleteErr) {
                  return done(newsdailyDeleteErr);
                }

                // Set assertions
                (newsdailyDeleteRes.body._id).should.equal(newsdailySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Newsdaily if not signed in', function (done) {
    // Set Newsdaily user
    newsdaily.user = user;

    // Create new Newsdaily model instance
    var newsdailyObj = new Newsdaily(newsdaily);

    // Save the Newsdaily
    newsdailyObj.save(function () {
      // Try deleting Newsdaily
      request(app).delete('/api/newsdailies/' + newsdailyObj._id)
        .expect(403)
        .end(function (newsdailyDeleteErr, newsdailyDeleteRes) {
          // Set message assertion
          (newsdailyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Newsdaily error error
          done(newsdailyDeleteErr);
        });

    });
  });

  it('should be able to get a single Newsdaily that has an orphaned user reference', function (done) {
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

          // Save a new Newsdaily
          agent.post('/api/newsdailies')
            .send(newsdaily)
            .expect(200)
            .end(function (newsdailySaveErr, newsdailySaveRes) {
              // Handle Newsdaily save error
              if (newsdailySaveErr) {
                return done(newsdailySaveErr);
              }

              // Set assertions on new Newsdaily
              (newsdailySaveRes.body.name).should.equal(newsdaily.name);
              should.exist(newsdailySaveRes.body.user);
              should.equal(newsdailySaveRes.body.user._id, orphanId);

              // force the Newsdaily to have an orphaned user reference
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

                    // Get the Newsdaily
                    agent.get('/api/newsdailies/' + newsdailySaveRes.body._id)
                      .expect(200)
                      .end(function (newsdailyInfoErr, newsdailyInfoRes) {
                        // Handle Newsdaily error
                        if (newsdailyInfoErr) {
                          return done(newsdailyInfoErr);
                        }

                        // Set assertions
                        (newsdailyInfoRes.body._id).should.equal(newsdailySaveRes.body._id);
                        (newsdailyInfoRes.body.name).should.equal(newsdaily.name);
                        should.equal(newsdailyInfoRes.body.user, undefined);

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
      Newsdaily.remove().exec(done);
    });
  });
});
