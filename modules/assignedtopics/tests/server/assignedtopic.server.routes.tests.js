'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Assignedtopic = mongoose.model('Assignedtopic'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  assignedtopic;

/**
 * Assignedtopic routes tests
 */
describe('Assignedtopic CRUD tests', function () {

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

    // Save a user to the test db and create new Assignedtopic
    user.save(function () {
      assignedtopic = {
        name: 'Assignedtopic name'
      };

      done();
    });
  });

  it('should be able to save a Assignedtopic if logged in', function (done) {
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

        // Save a new Assignedtopic
        agent.post('/api/assignedtopics')
          .send(assignedtopic)
          .expect(200)
          .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
            // Handle Assignedtopic save error
            if (assignedtopicSaveErr) {
              return done(assignedtopicSaveErr);
            }

            // Get a list of Assignedtopics
            agent.get('/api/assignedtopics')
              .end(function (assignedtopicsGetErr, assignedtopicsGetRes) {
                // Handle Assignedtopics save error
                if (assignedtopicsGetErr) {
                  return done(assignedtopicsGetErr);
                }

                // Get Assignedtopics list
                var assignedtopics = assignedtopicsGetRes.body;

                // Set assertions
                (assignedtopics[0].user._id).should.equal(userId);
                (assignedtopics[0].name).should.match('Assignedtopic name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Assignedtopic if not logged in', function (done) {
    agent.post('/api/assignedtopics')
      .send(assignedtopic)
      .expect(403)
      .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
        // Call the assertion callback
        done(assignedtopicSaveErr);
      });
  });

  it('should not be able to save an Assignedtopic if no name is provided', function (done) {
    // Invalidate name field
    assignedtopic.name = '';

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

        // Save a new Assignedtopic
        agent.post('/api/assignedtopics')
          .send(assignedtopic)
          .expect(400)
          .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
            // Set message assertion
            (assignedtopicSaveRes.body.message).should.match('Please fill Assignedtopic name');

            // Handle Assignedtopic save error
            done(assignedtopicSaveErr);
          });
      });
  });

  it('should be able to update an Assignedtopic if signed in', function (done) {
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

        // Save a new Assignedtopic
        agent.post('/api/assignedtopics')
          .send(assignedtopic)
          .expect(200)
          .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
            // Handle Assignedtopic save error
            if (assignedtopicSaveErr) {
              return done(assignedtopicSaveErr);
            }

            // Update Assignedtopic name
            assignedtopic.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Assignedtopic
            agent.put('/api/assignedtopics/' + assignedtopicSaveRes.body._id)
              .send(assignedtopic)
              .expect(200)
              .end(function (assignedtopicUpdateErr, assignedtopicUpdateRes) {
                // Handle Assignedtopic update error
                if (assignedtopicUpdateErr) {
                  return done(assignedtopicUpdateErr);
                }

                // Set assertions
                (assignedtopicUpdateRes.body._id).should.equal(assignedtopicSaveRes.body._id);
                (assignedtopicUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Assignedtopics if not signed in', function (done) {
    // Create new Assignedtopic model instance
    var assignedtopicObj = new Assignedtopic(assignedtopic);

    // Save the assignedtopic
    assignedtopicObj.save(function () {
      // Request Assignedtopics
      request(app).get('/api/assignedtopics')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Assignedtopic if not signed in', function (done) {
    // Create new Assignedtopic model instance
    var assignedtopicObj = new Assignedtopic(assignedtopic);

    // Save the Assignedtopic
    assignedtopicObj.save(function () {
      request(app).get('/api/assignedtopics/' + assignedtopicObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', assignedtopic.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Assignedtopic with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/assignedtopics/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Assignedtopic is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Assignedtopic which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Assignedtopic
    request(app).get('/api/assignedtopics/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Assignedtopic with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Assignedtopic if signed in', function (done) {
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

        // Save a new Assignedtopic
        agent.post('/api/assignedtopics')
          .send(assignedtopic)
          .expect(200)
          .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
            // Handle Assignedtopic save error
            if (assignedtopicSaveErr) {
              return done(assignedtopicSaveErr);
            }

            // Delete an existing Assignedtopic
            agent.delete('/api/assignedtopics/' + assignedtopicSaveRes.body._id)
              .send(assignedtopic)
              .expect(200)
              .end(function (assignedtopicDeleteErr, assignedtopicDeleteRes) {
                // Handle assignedtopic error error
                if (assignedtopicDeleteErr) {
                  return done(assignedtopicDeleteErr);
                }

                // Set assertions
                (assignedtopicDeleteRes.body._id).should.equal(assignedtopicSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Assignedtopic if not signed in', function (done) {
    // Set Assignedtopic user
    assignedtopic.user = user;

    // Create new Assignedtopic model instance
    var assignedtopicObj = new Assignedtopic(assignedtopic);

    // Save the Assignedtopic
    assignedtopicObj.save(function () {
      // Try deleting Assignedtopic
      request(app).delete('/api/assignedtopics/' + assignedtopicObj._id)
        .expect(403)
        .end(function (assignedtopicDeleteErr, assignedtopicDeleteRes) {
          // Set message assertion
          (assignedtopicDeleteRes.body.message).should.match('User is not authorized');

          // Handle Assignedtopic error error
          done(assignedtopicDeleteErr);
        });

    });
  });

  it('should be able to get a single Assignedtopic that has an orphaned user reference', function (done) {
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

          // Save a new Assignedtopic
          agent.post('/api/assignedtopics')
            .send(assignedtopic)
            .expect(200)
            .end(function (assignedtopicSaveErr, assignedtopicSaveRes) {
              // Handle Assignedtopic save error
              if (assignedtopicSaveErr) {
                return done(assignedtopicSaveErr);
              }

              // Set assertions on new Assignedtopic
              (assignedtopicSaveRes.body.name).should.equal(assignedtopic.name);
              should.exist(assignedtopicSaveRes.body.user);
              should.equal(assignedtopicSaveRes.body.user._id, orphanId);

              // force the Assignedtopic to have an orphaned user reference
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

                    // Get the Assignedtopic
                    agent.get('/api/assignedtopics/' + assignedtopicSaveRes.body._id)
                      .expect(200)
                      .end(function (assignedtopicInfoErr, assignedtopicInfoRes) {
                        // Handle Assignedtopic error
                        if (assignedtopicInfoErr) {
                          return done(assignedtopicInfoErr);
                        }

                        // Set assertions
                        (assignedtopicInfoRes.body._id).should.equal(assignedtopicSaveRes.body._id);
                        (assignedtopicInfoRes.body.name).should.equal(assignedtopic.name);
                        should.equal(assignedtopicInfoRes.body.user, undefined);

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
      Assignedtopic.remove().exec(done);
    });
  });
});
