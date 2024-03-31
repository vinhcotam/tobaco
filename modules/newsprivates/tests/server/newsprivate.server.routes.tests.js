'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Newsprivate = mongoose.model('Newsprivate'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  newsprivate;

/**
 * Newsprivate routes tests
 */
describe('Newsprivate CRUD tests', function () {

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

    // Save a user to the test db and create new Newsprivate
    user.save(function () {
      newsprivate = {
        name: 'Newsprivate name'
      };

      done();
    });
  });

  it('should be able to save a Newsprivate if logged in', function (done) {
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

        // Save a new Newsprivate
        agent.post('/api/newsprivates')
          .send(newsprivate)
          .expect(200)
          .end(function (newsprivateSaveErr, newsprivateSaveRes) {
            // Handle Newsprivate save error
            if (newsprivateSaveErr) {
              return done(newsprivateSaveErr);
            }

            // Get a list of Newsprivates
            agent.get('/api/newsprivates')
              .end(function (newsprivatesGetErr, newsprivatesGetRes) {
                // Handle Newsprivates save error
                if (newsprivatesGetErr) {
                  return done(newsprivatesGetErr);
                }

                // Get Newsprivates list
                var newsprivates = newsprivatesGetRes.body;

                // Set assertions
                (newsprivates[0].user._id).should.equal(userId);
                (newsprivates[0].name).should.match('Newsprivate name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Newsprivate if not logged in', function (done) {
    agent.post('/api/newsprivates')
      .send(newsprivate)
      .expect(403)
      .end(function (newsprivateSaveErr, newsprivateSaveRes) {
        // Call the assertion callback
        done(newsprivateSaveErr);
      });
  });

  it('should not be able to save an Newsprivate if no name is provided', function (done) {
    // Invalidate name field
    newsprivate.name = '';

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

        // Save a new Newsprivate
        agent.post('/api/newsprivates')
          .send(newsprivate)
          .expect(400)
          .end(function (newsprivateSaveErr, newsprivateSaveRes) {
            // Set message assertion
            (newsprivateSaveRes.body.message).should.match('Please fill Newsprivate name');

            // Handle Newsprivate save error
            done(newsprivateSaveErr);
          });
      });
  });

  it('should be able to update an Newsprivate if signed in', function (done) {
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

        // Save a new Newsprivate
        agent.post('/api/newsprivates')
          .send(newsprivate)
          .expect(200)
          .end(function (newsprivateSaveErr, newsprivateSaveRes) {
            // Handle Newsprivate save error
            if (newsprivateSaveErr) {
              return done(newsprivateSaveErr);
            }

            // Update Newsprivate name
            newsprivate.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Newsprivate
            agent.put('/api/newsprivates/' + newsprivateSaveRes.body._id)
              .send(newsprivate)
              .expect(200)
              .end(function (newsprivateUpdateErr, newsprivateUpdateRes) {
                // Handle Newsprivate update error
                if (newsprivateUpdateErr) {
                  return done(newsprivateUpdateErr);
                }

                // Set assertions
                (newsprivateUpdateRes.body._id).should.equal(newsprivateSaveRes.body._id);
                (newsprivateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Newsprivates if not signed in', function (done) {
    // Create new Newsprivate model instance
    var newsprivateObj = new Newsprivate(newsprivate);

    // Save the newsprivate
    newsprivateObj.save(function () {
      // Request Newsprivates
      request(app).get('/api/newsprivates')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Newsprivate if not signed in', function (done) {
    // Create new Newsprivate model instance
    var newsprivateObj = new Newsprivate(newsprivate);

    // Save the Newsprivate
    newsprivateObj.save(function () {
      request(app).get('/api/newsprivates/' + newsprivateObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', newsprivate.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Newsprivate with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/newsprivates/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Newsprivate is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Newsprivate which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Newsprivate
    request(app).get('/api/newsprivates/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Newsprivate with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Newsprivate if signed in', function (done) {
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

        // Save a new Newsprivate
        agent.post('/api/newsprivates')
          .send(newsprivate)
          .expect(200)
          .end(function (newsprivateSaveErr, newsprivateSaveRes) {
            // Handle Newsprivate save error
            if (newsprivateSaveErr) {
              return done(newsprivateSaveErr);
            }

            // Delete an existing Newsprivate
            agent.delete('/api/newsprivates/' + newsprivateSaveRes.body._id)
              .send(newsprivate)
              .expect(200)
              .end(function (newsprivateDeleteErr, newsprivateDeleteRes) {
                // Handle newsprivate error error
                if (newsprivateDeleteErr) {
                  return done(newsprivateDeleteErr);
                }

                // Set assertions
                (newsprivateDeleteRes.body._id).should.equal(newsprivateSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Newsprivate if not signed in', function (done) {
    // Set Newsprivate user
    newsprivate.user = user;

    // Create new Newsprivate model instance
    var newsprivateObj = new Newsprivate(newsprivate);

    // Save the Newsprivate
    newsprivateObj.save(function () {
      // Try deleting Newsprivate
      request(app).delete('/api/newsprivates/' + newsprivateObj._id)
        .expect(403)
        .end(function (newsprivateDeleteErr, newsprivateDeleteRes) {
          // Set message assertion
          (newsprivateDeleteRes.body.message).should.match('User is not authorized');

          // Handle Newsprivate error error
          done(newsprivateDeleteErr);
        });

    });
  });

  it('should be able to get a single Newsprivate that has an orphaned user reference', function (done) {
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

          // Save a new Newsprivate
          agent.post('/api/newsprivates')
            .send(newsprivate)
            .expect(200)
            .end(function (newsprivateSaveErr, newsprivateSaveRes) {
              // Handle Newsprivate save error
              if (newsprivateSaveErr) {
                return done(newsprivateSaveErr);
              }

              // Set assertions on new Newsprivate
              (newsprivateSaveRes.body.name).should.equal(newsprivate.name);
              should.exist(newsprivateSaveRes.body.user);
              should.equal(newsprivateSaveRes.body.user._id, orphanId);

              // force the Newsprivate to have an orphaned user reference
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

                    // Get the Newsprivate
                    agent.get('/api/newsprivates/' + newsprivateSaveRes.body._id)
                      .expect(200)
                      .end(function (newsprivateInfoErr, newsprivateInfoRes) {
                        // Handle Newsprivate error
                        if (newsprivateInfoErr) {
                          return done(newsprivateInfoErr);
                        }

                        // Set assertions
                        (newsprivateInfoRes.body._id).should.equal(newsprivateSaveRes.body._id);
                        (newsprivateInfoRes.body.name).should.equal(newsprivate.name);
                        should.equal(newsprivateInfoRes.body.user, undefined);

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
      Newsprivate.remove().exec(done);
    });
  });
});
