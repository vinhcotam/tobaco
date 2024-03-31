'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Monitoringobject = mongoose.model('Monitoringobject'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  monitoringobject;

/**
 * Monitoringobject routes tests
 */
describe('Monitoringobject CRUD tests', function () {

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

    // Save a user to the test db and create new Monitoringobject
    user.save(function () {
      monitoringobject = {
        name: 'Monitoringobject name'
      };

      done();
    });
  });

  it('should be able to save a Monitoringobject if logged in', function (done) {
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

        // Save a new Monitoringobject
        agent.post('/api/monitoringobjects')
          .send(monitoringobject)
          .expect(200)
          .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
            // Handle Monitoringobject save error
            if (monitoringobjectSaveErr) {
              return done(monitoringobjectSaveErr);
            }

            // Get a list of Monitoringobjects
            agent.get('/api/monitoringobjects')
              .end(function (monitoringobjectsGetErr, monitoringobjectsGetRes) {
                // Handle Monitoringobjects save error
                if (monitoringobjectsGetErr) {
                  return done(monitoringobjectsGetErr);
                }

                // Get Monitoringobjects list
                var monitoringobjects = monitoringobjectsGetRes.body;

                // Set assertions
                (monitoringobjects[0].user._id).should.equal(userId);
                (monitoringobjects[0].name).should.match('Monitoringobject name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Monitoringobject if not logged in', function (done) {
    agent.post('/api/monitoringobjects')
      .send(monitoringobject)
      .expect(403)
      .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
        // Call the assertion callback
        done(monitoringobjectSaveErr);
      });
  });

  it('should not be able to save an Monitoringobject if no name is provided', function (done) {
    // Invalidate name field
    monitoringobject.name = '';

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

        // Save a new Monitoringobject
        agent.post('/api/monitoringobjects')
          .send(monitoringobject)
          .expect(400)
          .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
            // Set message assertion
            (monitoringobjectSaveRes.body.message).should.match('Please fill Monitoringobject name');

            // Handle Monitoringobject save error
            done(monitoringobjectSaveErr);
          });
      });
  });

  it('should be able to update an Monitoringobject if signed in', function (done) {
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

        // Save a new Monitoringobject
        agent.post('/api/monitoringobjects')
          .send(monitoringobject)
          .expect(200)
          .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
            // Handle Monitoringobject save error
            if (monitoringobjectSaveErr) {
              return done(monitoringobjectSaveErr);
            }

            // Update Monitoringobject name
            monitoringobject.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Monitoringobject
            agent.put('/api/monitoringobjects/' + monitoringobjectSaveRes.body._id)
              .send(monitoringobject)
              .expect(200)
              .end(function (monitoringobjectUpdateErr, monitoringobjectUpdateRes) {
                // Handle Monitoringobject update error
                if (monitoringobjectUpdateErr) {
                  return done(monitoringobjectUpdateErr);
                }

                // Set assertions
                (monitoringobjectUpdateRes.body._id).should.equal(monitoringobjectSaveRes.body._id);
                (monitoringobjectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Monitoringobjects if not signed in', function (done) {
    // Create new Monitoringobject model instance
    var monitoringobjectObj = new Monitoringobject(monitoringobject);

    // Save the monitoringobject
    monitoringobjectObj.save(function () {
      // Request Monitoringobjects
      request(app).get('/api/monitoringobjects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Monitoringobject if not signed in', function (done) {
    // Create new Monitoringobject model instance
    var monitoringobjectObj = new Monitoringobject(monitoringobject);

    // Save the Monitoringobject
    monitoringobjectObj.save(function () {
      request(app).get('/api/monitoringobjects/' + monitoringobjectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', monitoringobject.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Monitoringobject with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/monitoringobjects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Monitoringobject is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Monitoringobject which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Monitoringobject
    request(app).get('/api/monitoringobjects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Monitoringobject with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Monitoringobject if signed in', function (done) {
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

        // Save a new Monitoringobject
        agent.post('/api/monitoringobjects')
          .send(monitoringobject)
          .expect(200)
          .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
            // Handle Monitoringobject save error
            if (monitoringobjectSaveErr) {
              return done(monitoringobjectSaveErr);
            }

            // Delete an existing Monitoringobject
            agent.delete('/api/monitoringobjects/' + monitoringobjectSaveRes.body._id)
              .send(monitoringobject)
              .expect(200)
              .end(function (monitoringobjectDeleteErr, monitoringobjectDeleteRes) {
                // Handle monitoringobject error error
                if (monitoringobjectDeleteErr) {
                  return done(monitoringobjectDeleteErr);
                }

                // Set assertions
                (monitoringobjectDeleteRes.body._id).should.equal(monitoringobjectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Monitoringobject if not signed in', function (done) {
    // Set Monitoringobject user
    monitoringobject.user = user;

    // Create new Monitoringobject model instance
    var monitoringobjectObj = new Monitoringobject(monitoringobject);

    // Save the Monitoringobject
    monitoringobjectObj.save(function () {
      // Try deleting Monitoringobject
      request(app).delete('/api/monitoringobjects/' + monitoringobjectObj._id)
        .expect(403)
        .end(function (monitoringobjectDeleteErr, monitoringobjectDeleteRes) {
          // Set message assertion
          (monitoringobjectDeleteRes.body.message).should.match('User is not authorized');

          // Handle Monitoringobject error error
          done(monitoringobjectDeleteErr);
        });

    });
  });

  it('should be able to get a single Monitoringobject that has an orphaned user reference', function (done) {
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

          // Save a new Monitoringobject
          agent.post('/api/monitoringobjects')
            .send(monitoringobject)
            .expect(200)
            .end(function (monitoringobjectSaveErr, monitoringobjectSaveRes) {
              // Handle Monitoringobject save error
              if (monitoringobjectSaveErr) {
                return done(monitoringobjectSaveErr);
              }

              // Set assertions on new Monitoringobject
              (monitoringobjectSaveRes.body.name).should.equal(monitoringobject.name);
              should.exist(monitoringobjectSaveRes.body.user);
              should.equal(monitoringobjectSaveRes.body.user._id, orphanId);

              // force the Monitoringobject to have an orphaned user reference
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

                    // Get the Monitoringobject
                    agent.get('/api/monitoringobjects/' + monitoringobjectSaveRes.body._id)
                      .expect(200)
                      .end(function (monitoringobjectInfoErr, monitoringobjectInfoRes) {
                        // Handle Monitoringobject error
                        if (monitoringobjectInfoErr) {
                          return done(monitoringobjectInfoErr);
                        }

                        // Set assertions
                        (monitoringobjectInfoRes.body._id).should.equal(monitoringobjectSaveRes.body._id);
                        (monitoringobjectInfoRes.body.name).should.equal(monitoringobject.name);
                        should.equal(monitoringobjectInfoRes.body.user, undefined);

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
      Monitoringobject.remove().exec(done);
    });
  });
});
