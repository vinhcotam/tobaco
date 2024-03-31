'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Socialobjectactivity = mongoose.model('Socialobjectactivity'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  socialobjectactivity;

/**
 * Socialobjectactivity routes tests
 */
describe('Socialobjectactivity CRUD tests', function () {

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

    // Save a user to the test db and create new Socialobjectactivity
    user.save(function () {
      socialobjectactivity = {
        name: 'Socialobjectactivity name'
      };

      done();
    });
  });

  it('should be able to save a Socialobjectactivity if logged in', function (done) {
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

        // Save a new Socialobjectactivity
        agent.post('/api/socialobjectactivities')
          .send(socialobjectactivity)
          .expect(200)
          .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
            // Handle Socialobjectactivity save error
            if (socialobjectactivitySaveErr) {
              return done(socialobjectactivitySaveErr);
            }

            // Get a list of Socialobjectactivities
            agent.get('/api/socialobjectactivities')
              .end(function (socialobjectactivitiesGetErr, socialobjectactivitiesGetRes) {
                // Handle Socialobjectactivities save error
                if (socialobjectactivitiesGetErr) {
                  return done(socialobjectactivitiesGetErr);
                }

                // Get Socialobjectactivities list
                var socialobjectactivities = socialobjectactivitiesGetRes.body;

                // Set assertions
                (socialobjectactivities[0].user._id).should.equal(userId);
                (socialobjectactivities[0].name).should.match('Socialobjectactivity name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Socialobjectactivity if not logged in', function (done) {
    agent.post('/api/socialobjectactivities')
      .send(socialobjectactivity)
      .expect(403)
      .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
        // Call the assertion callback
        done(socialobjectactivitySaveErr);
      });
  });

  it('should not be able to save an Socialobjectactivity if no name is provided', function (done) {
    // Invalidate name field
    socialobjectactivity.name = '';

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

        // Save a new Socialobjectactivity
        agent.post('/api/socialobjectactivities')
          .send(socialobjectactivity)
          .expect(400)
          .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
            // Set message assertion
            (socialobjectactivitySaveRes.body.message).should.match('Please fill Socialobjectactivity name');

            // Handle Socialobjectactivity save error
            done(socialobjectactivitySaveErr);
          });
      });
  });

  it('should be able to update an Socialobjectactivity if signed in', function (done) {
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

        // Save a new Socialobjectactivity
        agent.post('/api/socialobjectactivities')
          .send(socialobjectactivity)
          .expect(200)
          .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
            // Handle Socialobjectactivity save error
            if (socialobjectactivitySaveErr) {
              return done(socialobjectactivitySaveErr);
            }

            // Update Socialobjectactivity name
            socialobjectactivity.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Socialobjectactivity
            agent.put('/api/socialobjectactivities/' + socialobjectactivitySaveRes.body._id)
              .send(socialobjectactivity)
              .expect(200)
              .end(function (socialobjectactivityUpdateErr, socialobjectactivityUpdateRes) {
                // Handle Socialobjectactivity update error
                if (socialobjectactivityUpdateErr) {
                  return done(socialobjectactivityUpdateErr);
                }

                // Set assertions
                (socialobjectactivityUpdateRes.body._id).should.equal(socialobjectactivitySaveRes.body._id);
                (socialobjectactivityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Socialobjectactivities if not signed in', function (done) {
    // Create new Socialobjectactivity model instance
    var socialobjectactivityObj = new Socialobjectactivity(socialobjectactivity);

    // Save the socialobjectactivity
    socialobjectactivityObj.save(function () {
      // Request Socialobjectactivities
      request(app).get('/api/socialobjectactivities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Socialobjectactivity if not signed in', function (done) {
    // Create new Socialobjectactivity model instance
    var socialobjectactivityObj = new Socialobjectactivity(socialobjectactivity);

    // Save the Socialobjectactivity
    socialobjectactivityObj.save(function () {
      request(app).get('/api/socialobjectactivities/' + socialobjectactivityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', socialobjectactivity.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Socialobjectactivity with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/socialobjectactivities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Socialobjectactivity is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Socialobjectactivity which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Socialobjectactivity
    request(app).get('/api/socialobjectactivities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Socialobjectactivity with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Socialobjectactivity if signed in', function (done) {
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

        // Save a new Socialobjectactivity
        agent.post('/api/socialobjectactivities')
          .send(socialobjectactivity)
          .expect(200)
          .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
            // Handle Socialobjectactivity save error
            if (socialobjectactivitySaveErr) {
              return done(socialobjectactivitySaveErr);
            }

            // Delete an existing Socialobjectactivity
            agent.delete('/api/socialobjectactivities/' + socialobjectactivitySaveRes.body._id)
              .send(socialobjectactivity)
              .expect(200)
              .end(function (socialobjectactivityDeleteErr, socialobjectactivityDeleteRes) {
                // Handle socialobjectactivity error error
                if (socialobjectactivityDeleteErr) {
                  return done(socialobjectactivityDeleteErr);
                }

                // Set assertions
                (socialobjectactivityDeleteRes.body._id).should.equal(socialobjectactivitySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Socialobjectactivity if not signed in', function (done) {
    // Set Socialobjectactivity user
    socialobjectactivity.user = user;

    // Create new Socialobjectactivity model instance
    var socialobjectactivityObj = new Socialobjectactivity(socialobjectactivity);

    // Save the Socialobjectactivity
    socialobjectactivityObj.save(function () {
      // Try deleting Socialobjectactivity
      request(app).delete('/api/socialobjectactivities/' + socialobjectactivityObj._id)
        .expect(403)
        .end(function (socialobjectactivityDeleteErr, socialobjectactivityDeleteRes) {
          // Set message assertion
          (socialobjectactivityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Socialobjectactivity error error
          done(socialobjectactivityDeleteErr);
        });

    });
  });

  it('should be able to get a single Socialobjectactivity that has an orphaned user reference', function (done) {
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

          // Save a new Socialobjectactivity
          agent.post('/api/socialobjectactivities')
            .send(socialobjectactivity)
            .expect(200)
            .end(function (socialobjectactivitySaveErr, socialobjectactivitySaveRes) {
              // Handle Socialobjectactivity save error
              if (socialobjectactivitySaveErr) {
                return done(socialobjectactivitySaveErr);
              }

              // Set assertions on new Socialobjectactivity
              (socialobjectactivitySaveRes.body.name).should.equal(socialobjectactivity.name);
              should.exist(socialobjectactivitySaveRes.body.user);
              should.equal(socialobjectactivitySaveRes.body.user._id, orphanId);

              // force the Socialobjectactivity to have an orphaned user reference
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

                    // Get the Socialobjectactivity
                    agent.get('/api/socialobjectactivities/' + socialobjectactivitySaveRes.body._id)
                      .expect(200)
                      .end(function (socialobjectactivityInfoErr, socialobjectactivityInfoRes) {
                        // Handle Socialobjectactivity error
                        if (socialobjectactivityInfoErr) {
                          return done(socialobjectactivityInfoErr);
                        }

                        // Set assertions
                        (socialobjectactivityInfoRes.body._id).should.equal(socialobjectactivitySaveRes.body._id);
                        (socialobjectactivityInfoRes.body.name).should.equal(socialobjectactivity.name);
                        should.equal(socialobjectactivityInfoRes.body.user, undefined);

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
      Socialobjectactivity.remove().exec(done);
    });
  });
});
