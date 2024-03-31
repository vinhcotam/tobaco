'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Objectprofile = mongoose.model('Objectprofile'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  objectprofile;

/**
 * Objectprofile routes tests
 */
describe('Objectprofile CRUD tests', function () {

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

    // Save a user to the test db and create new Objectprofile
    user.save(function () {
      objectprofile = {
        name: 'Objectprofile name'
      };

      done();
    });
  });

  it('should be able to save a Objectprofile if logged in', function (done) {
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

        // Save a new Objectprofile
        agent.post('/api/objectprofiles')
          .send(objectprofile)
          .expect(200)
          .end(function (objectprofileSaveErr, objectprofileSaveRes) {
            // Handle Objectprofile save error
            if (objectprofileSaveErr) {
              return done(objectprofileSaveErr);
            }

            // Get a list of Objectprofiles
            agent.get('/api/objectprofiles')
              .end(function (objectprofilesGetErr, objectprofilesGetRes) {
                // Handle Objectprofiles save error
                if (objectprofilesGetErr) {
                  return done(objectprofilesGetErr);
                }

                // Get Objectprofiles list
                var objectprofiles = objectprofilesGetRes.body;

                // Set assertions
                (objectprofiles[0].user._id).should.equal(userId);
                (objectprofiles[0].name).should.match('Objectprofile name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Objectprofile if not logged in', function (done) {
    agent.post('/api/objectprofiles')
      .send(objectprofile)
      .expect(403)
      .end(function (objectprofileSaveErr, objectprofileSaveRes) {
        // Call the assertion callback
        done(objectprofileSaveErr);
      });
  });

  it('should not be able to save an Objectprofile if no name is provided', function (done) {
    // Invalidate name field
    objectprofile.name = '';

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

        // Save a new Objectprofile
        agent.post('/api/objectprofiles')
          .send(objectprofile)
          .expect(400)
          .end(function (objectprofileSaveErr, objectprofileSaveRes) {
            // Set message assertion
            (objectprofileSaveRes.body.message).should.match('Please fill Objectprofile name');

            // Handle Objectprofile save error
            done(objectprofileSaveErr);
          });
      });
  });

  it('should be able to update an Objectprofile if signed in', function (done) {
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

        // Save a new Objectprofile
        agent.post('/api/objectprofiles')
          .send(objectprofile)
          .expect(200)
          .end(function (objectprofileSaveErr, objectprofileSaveRes) {
            // Handle Objectprofile save error
            if (objectprofileSaveErr) {
              return done(objectprofileSaveErr);
            }

            // Update Objectprofile name
            objectprofile.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Objectprofile
            agent.put('/api/objectprofiles/' + objectprofileSaveRes.body._id)
              .send(objectprofile)
              .expect(200)
              .end(function (objectprofileUpdateErr, objectprofileUpdateRes) {
                // Handle Objectprofile update error
                if (objectprofileUpdateErr) {
                  return done(objectprofileUpdateErr);
                }

                // Set assertions
                (objectprofileUpdateRes.body._id).should.equal(objectprofileSaveRes.body._id);
                (objectprofileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Objectprofiles if not signed in', function (done) {
    // Create new Objectprofile model instance
    var objectprofileObj = new Objectprofile(objectprofile);

    // Save the objectprofile
    objectprofileObj.save(function () {
      // Request Objectprofiles
      request(app).get('/api/objectprofiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Objectprofile if not signed in', function (done) {
    // Create new Objectprofile model instance
    var objectprofileObj = new Objectprofile(objectprofile);

    // Save the Objectprofile
    objectprofileObj.save(function () {
      request(app).get('/api/objectprofiles/' + objectprofileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', objectprofile.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Objectprofile with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/objectprofiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Objectprofile is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Objectprofile which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Objectprofile
    request(app).get('/api/objectprofiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Objectprofile with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Objectprofile if signed in', function (done) {
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

        // Save a new Objectprofile
        agent.post('/api/objectprofiles')
          .send(objectprofile)
          .expect(200)
          .end(function (objectprofileSaveErr, objectprofileSaveRes) {
            // Handle Objectprofile save error
            if (objectprofileSaveErr) {
              return done(objectprofileSaveErr);
            }

            // Delete an existing Objectprofile
            agent.delete('/api/objectprofiles/' + objectprofileSaveRes.body._id)
              .send(objectprofile)
              .expect(200)
              .end(function (objectprofileDeleteErr, objectprofileDeleteRes) {
                // Handle objectprofile error error
                if (objectprofileDeleteErr) {
                  return done(objectprofileDeleteErr);
                }

                // Set assertions
                (objectprofileDeleteRes.body._id).should.equal(objectprofileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Objectprofile if not signed in', function (done) {
    // Set Objectprofile user
    objectprofile.user = user;

    // Create new Objectprofile model instance
    var objectprofileObj = new Objectprofile(objectprofile);

    // Save the Objectprofile
    objectprofileObj.save(function () {
      // Try deleting Objectprofile
      request(app).delete('/api/objectprofiles/' + objectprofileObj._id)
        .expect(403)
        .end(function (objectprofileDeleteErr, objectprofileDeleteRes) {
          // Set message assertion
          (objectprofileDeleteRes.body.message).should.match('User is not authorized');

          // Handle Objectprofile error error
          done(objectprofileDeleteErr);
        });

    });
  });

  it('should be able to get a single Objectprofile that has an orphaned user reference', function (done) {
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

          // Save a new Objectprofile
          agent.post('/api/objectprofiles')
            .send(objectprofile)
            .expect(200)
            .end(function (objectprofileSaveErr, objectprofileSaveRes) {
              // Handle Objectprofile save error
              if (objectprofileSaveErr) {
                return done(objectprofileSaveErr);
              }

              // Set assertions on new Objectprofile
              (objectprofileSaveRes.body.name).should.equal(objectprofile.name);
              should.exist(objectprofileSaveRes.body.user);
              should.equal(objectprofileSaveRes.body.user._id, orphanId);

              // force the Objectprofile to have an orphaned user reference
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

                    // Get the Objectprofile
                    agent.get('/api/objectprofiles/' + objectprofileSaveRes.body._id)
                      .expect(200)
                      .end(function (objectprofileInfoErr, objectprofileInfoRes) {
                        // Handle Objectprofile error
                        if (objectprofileInfoErr) {
                          return done(objectprofileInfoErr);
                        }

                        // Set assertions
                        (objectprofileInfoRes.body._id).should.equal(objectprofileSaveRes.body._id);
                        (objectprofileInfoRes.body.name).should.equal(objectprofile.name);
                        should.equal(objectprofileInfoRes.body.user, undefined);

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
      Objectprofile.remove().exec(done);
    });
  });
});
