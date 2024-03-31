'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Activitylog = mongoose.model('Activitylog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  activitylog;

/**
 * Activitylog routes tests
 */
describe('Activitylog CRUD tests', function () {

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

    // Save a user to the test db and create new Activitylog
    user.save(function () {
      activitylog = {
        name: 'Activitylog name'
      };

      done();
    });
  });

  it('should be able to save a Activitylog if logged in', function (done) {
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

        // Save a new Activitylog
        agent.post('/api/activitylogs')
          .send(activitylog)
          .expect(200)
          .end(function (activitylogSaveErr, activitylogSaveRes) {
            // Handle Activitylog save error
            if (activitylogSaveErr) {
              return done(activitylogSaveErr);
            }

            // Get a list of Activitylogs
            agent.get('/api/activitylogs')
              .end(function (activitylogsGetErr, activitylogsGetRes) {
                // Handle Activitylogs save error
                if (activitylogsGetErr) {
                  return done(activitylogsGetErr);
                }

                // Get Activitylogs list
                var activitylogs = activitylogsGetRes.body;

                // Set assertions
                (activitylogs[0].user._id).should.equal(userId);
                (activitylogs[0].name).should.match('Activitylog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Activitylog if not logged in', function (done) {
    agent.post('/api/activitylogs')
      .send(activitylog)
      .expect(403)
      .end(function (activitylogSaveErr, activitylogSaveRes) {
        // Call the assertion callback
        done(activitylogSaveErr);
      });
  });

  it('should not be able to save an Activitylog if no name is provided', function (done) {
    // Invalidate name field
    activitylog.name = '';

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

        // Save a new Activitylog
        agent.post('/api/activitylogs')
          .send(activitylog)
          .expect(400)
          .end(function (activitylogSaveErr, activitylogSaveRes) {
            // Set message assertion
            (activitylogSaveRes.body.message).should.match('Please fill Activitylog name');

            // Handle Activitylog save error
            done(activitylogSaveErr);
          });
      });
  });

  it('should be able to update an Activitylog if signed in', function (done) {
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

        // Save a new Activitylog
        agent.post('/api/activitylogs')
          .send(activitylog)
          .expect(200)
          .end(function (activitylogSaveErr, activitylogSaveRes) {
            // Handle Activitylog save error
            if (activitylogSaveErr) {
              return done(activitylogSaveErr);
            }

            // Update Activitylog name
            activitylog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Activitylog
            agent.put('/api/activitylogs/' + activitylogSaveRes.body._id)
              .send(activitylog)
              .expect(200)
              .end(function (activitylogUpdateErr, activitylogUpdateRes) {
                // Handle Activitylog update error
                if (activitylogUpdateErr) {
                  return done(activitylogUpdateErr);
                }

                // Set assertions
                (activitylogUpdateRes.body._id).should.equal(activitylogSaveRes.body._id);
                (activitylogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Activitylogs if not signed in', function (done) {
    // Create new Activitylog model instance
    var activitylogObj = new Activitylog(activitylog);

    // Save the activitylog
    activitylogObj.save(function () {
      // Request Activitylogs
      request(app).get('/api/activitylogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Activitylog if not signed in', function (done) {
    // Create new Activitylog model instance
    var activitylogObj = new Activitylog(activitylog);

    // Save the Activitylog
    activitylogObj.save(function () {
      request(app).get('/api/activitylogs/' + activitylogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', activitylog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Activitylog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/activitylogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Activitylog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Activitylog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Activitylog
    request(app).get('/api/activitylogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Activitylog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Activitylog if signed in', function (done) {
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

        // Save a new Activitylog
        agent.post('/api/activitylogs')
          .send(activitylog)
          .expect(200)
          .end(function (activitylogSaveErr, activitylogSaveRes) {
            // Handle Activitylog save error
            if (activitylogSaveErr) {
              return done(activitylogSaveErr);
            }

            // Delete an existing Activitylog
            agent.delete('/api/activitylogs/' + activitylogSaveRes.body._id)
              .send(activitylog)
              .expect(200)
              .end(function (activitylogDeleteErr, activitylogDeleteRes) {
                // Handle activitylog error error
                if (activitylogDeleteErr) {
                  return done(activitylogDeleteErr);
                }

                // Set assertions
                (activitylogDeleteRes.body._id).should.equal(activitylogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Activitylog if not signed in', function (done) {
    // Set Activitylog user
    activitylog.user = user;

    // Create new Activitylog model instance
    var activitylogObj = new Activitylog(activitylog);

    // Save the Activitylog
    activitylogObj.save(function () {
      // Try deleting Activitylog
      request(app).delete('/api/activitylogs/' + activitylogObj._id)
        .expect(403)
        .end(function (activitylogDeleteErr, activitylogDeleteRes) {
          // Set message assertion
          (activitylogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Activitylog error error
          done(activitylogDeleteErr);
        });

    });
  });

  it('should be able to get a single Activitylog that has an orphaned user reference', function (done) {
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

          // Save a new Activitylog
          agent.post('/api/activitylogs')
            .send(activitylog)
            .expect(200)
            .end(function (activitylogSaveErr, activitylogSaveRes) {
              // Handle Activitylog save error
              if (activitylogSaveErr) {
                return done(activitylogSaveErr);
              }

              // Set assertions on new Activitylog
              (activitylogSaveRes.body.name).should.equal(activitylog.name);
              should.exist(activitylogSaveRes.body.user);
              should.equal(activitylogSaveRes.body.user._id, orphanId);

              // force the Activitylog to have an orphaned user reference
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

                    // Get the Activitylog
                    agent.get('/api/activitylogs/' + activitylogSaveRes.body._id)
                      .expect(200)
                      .end(function (activitylogInfoErr, activitylogInfoRes) {
                        // Handle Activitylog error
                        if (activitylogInfoErr) {
                          return done(activitylogInfoErr);
                        }

                        // Set assertions
                        (activitylogInfoRes.body._id).should.equal(activitylogSaveRes.body._id);
                        (activitylogInfoRes.body.name).should.equal(activitylog.name);
                        should.equal(activitylogInfoRes.body.user, undefined);

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
      Activitylog.remove().exec(done);
    });
  });
});
