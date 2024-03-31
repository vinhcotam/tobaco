'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Objectpackage = mongoose.model('Objectpackage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  objectpackage;

/**
 * Objectpackage routes tests
 */
describe('Objectpackage CRUD tests', function () {

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

    // Save a user to the test db and create new Objectpackage
    user.save(function () {
      objectpackage = {
        name: 'Objectpackage name'
      };

      done();
    });
  });

  it('should be able to save a Objectpackage if logged in', function (done) {
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

        // Save a new Objectpackage
        agent.post('/api/objectpackages')
          .send(objectpackage)
          .expect(200)
          .end(function (objectpackageSaveErr, objectpackageSaveRes) {
            // Handle Objectpackage save error
            if (objectpackageSaveErr) {
              return done(objectpackageSaveErr);
            }

            // Get a list of Objectpackages
            agent.get('/api/objectpackages')
              .end(function (objectpackagesGetErr, objectpackagesGetRes) {
                // Handle Objectpackages save error
                if (objectpackagesGetErr) {
                  return done(objectpackagesGetErr);
                }

                // Get Objectpackages list
                var objectpackages = objectpackagesGetRes.body;

                // Set assertions
                (objectpackages[0].user._id).should.equal(userId);
                (objectpackages[0].name).should.match('Objectpackage name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Objectpackage if not logged in', function (done) {
    agent.post('/api/objectpackages')
      .send(objectpackage)
      .expect(403)
      .end(function (objectpackageSaveErr, objectpackageSaveRes) {
        // Call the assertion callback
        done(objectpackageSaveErr);
      });
  });

  it('should not be able to save an Objectpackage if no name is provided', function (done) {
    // Invalidate name field
    objectpackage.name = '';

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

        // Save a new Objectpackage
        agent.post('/api/objectpackages')
          .send(objectpackage)
          .expect(400)
          .end(function (objectpackageSaveErr, objectpackageSaveRes) {
            // Set message assertion
            (objectpackageSaveRes.body.message).should.match('Please fill Objectpackage name');

            // Handle Objectpackage save error
            done(objectpackageSaveErr);
          });
      });
  });

  it('should be able to update an Objectpackage if signed in', function (done) {
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

        // Save a new Objectpackage
        agent.post('/api/objectpackages')
          .send(objectpackage)
          .expect(200)
          .end(function (objectpackageSaveErr, objectpackageSaveRes) {
            // Handle Objectpackage save error
            if (objectpackageSaveErr) {
              return done(objectpackageSaveErr);
            }

            // Update Objectpackage name
            objectpackage.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Objectpackage
            agent.put('/api/objectpackages/' + objectpackageSaveRes.body._id)
              .send(objectpackage)
              .expect(200)
              .end(function (objectpackageUpdateErr, objectpackageUpdateRes) {
                // Handle Objectpackage update error
                if (objectpackageUpdateErr) {
                  return done(objectpackageUpdateErr);
                }

                // Set assertions
                (objectpackageUpdateRes.body._id).should.equal(objectpackageSaveRes.body._id);
                (objectpackageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Objectpackages if not signed in', function (done) {
    // Create new Objectpackage model instance
    var objectpackageObj = new Objectpackage(objectpackage);

    // Save the objectpackage
    objectpackageObj.save(function () {
      // Request Objectpackages
      request(app).get('/api/objectpackages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Objectpackage if not signed in', function (done) {
    // Create new Objectpackage model instance
    var objectpackageObj = new Objectpackage(objectpackage);

    // Save the Objectpackage
    objectpackageObj.save(function () {
      request(app).get('/api/objectpackages/' + objectpackageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', objectpackage.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Objectpackage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/objectpackages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Objectpackage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Objectpackage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Objectpackage
    request(app).get('/api/objectpackages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Objectpackage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Objectpackage if signed in', function (done) {
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

        // Save a new Objectpackage
        agent.post('/api/objectpackages')
          .send(objectpackage)
          .expect(200)
          .end(function (objectpackageSaveErr, objectpackageSaveRes) {
            // Handle Objectpackage save error
            if (objectpackageSaveErr) {
              return done(objectpackageSaveErr);
            }

            // Delete an existing Objectpackage
            agent.delete('/api/objectpackages/' + objectpackageSaveRes.body._id)
              .send(objectpackage)
              .expect(200)
              .end(function (objectpackageDeleteErr, objectpackageDeleteRes) {
                // Handle objectpackage error error
                if (objectpackageDeleteErr) {
                  return done(objectpackageDeleteErr);
                }

                // Set assertions
                (objectpackageDeleteRes.body._id).should.equal(objectpackageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Objectpackage if not signed in', function (done) {
    // Set Objectpackage user
    objectpackage.user = user;

    // Create new Objectpackage model instance
    var objectpackageObj = new Objectpackage(objectpackage);

    // Save the Objectpackage
    objectpackageObj.save(function () {
      // Try deleting Objectpackage
      request(app).delete('/api/objectpackages/' + objectpackageObj._id)
        .expect(403)
        .end(function (objectpackageDeleteErr, objectpackageDeleteRes) {
          // Set message assertion
          (objectpackageDeleteRes.body.message).should.match('User is not authorized');

          // Handle Objectpackage error error
          done(objectpackageDeleteErr);
        });

    });
  });

  it('should be able to get a single Objectpackage that has an orphaned user reference', function (done) {
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

          // Save a new Objectpackage
          agent.post('/api/objectpackages')
            .send(objectpackage)
            .expect(200)
            .end(function (objectpackageSaveErr, objectpackageSaveRes) {
              // Handle Objectpackage save error
              if (objectpackageSaveErr) {
                return done(objectpackageSaveErr);
              }

              // Set assertions on new Objectpackage
              (objectpackageSaveRes.body.name).should.equal(objectpackage.name);
              should.exist(objectpackageSaveRes.body.user);
              should.equal(objectpackageSaveRes.body.user._id, orphanId);

              // force the Objectpackage to have an orphaned user reference
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

                    // Get the Objectpackage
                    agent.get('/api/objectpackages/' + objectpackageSaveRes.body._id)
                      .expect(200)
                      .end(function (objectpackageInfoErr, objectpackageInfoRes) {
                        // Handle Objectpackage error
                        if (objectpackageInfoErr) {
                          return done(objectpackageInfoErr);
                        }

                        // Set assertions
                        (objectpackageInfoRes.body._id).should.equal(objectpackageSaveRes.body._id);
                        (objectpackageInfoRes.body.name).should.equal(objectpackage.name);
                        should.equal(objectpackageInfoRes.body.user, undefined);

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
      Objectpackage.remove().exec(done);
    });
  });
});
