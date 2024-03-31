'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Monitoringtype = mongoose.model('Monitoringtype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  monitoringtype;

/**
 * Monitoringtype routes tests
 */
describe('Monitoringtype CRUD tests', function () {

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

    // Save a user to the test db and create new Monitoringtype
    user.save(function () {
      monitoringtype = {
        name: 'Monitoringtype name'
      };

      done();
    });
  });

  it('should be able to save a Monitoringtype if logged in', function (done) {
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

        // Save a new Monitoringtype
        agent.post('/api/monitoringtypes')
          .send(monitoringtype)
          .expect(200)
          .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
            // Handle Monitoringtype save error
            if (monitoringtypeSaveErr) {
              return done(monitoringtypeSaveErr);
            }

            // Get a list of Monitoringtypes
            agent.get('/api/monitoringtypes')
              .end(function (monitoringtypesGetErr, monitoringtypesGetRes) {
                // Handle Monitoringtypes save error
                if (monitoringtypesGetErr) {
                  return done(monitoringtypesGetErr);
                }

                // Get Monitoringtypes list
                var monitoringtypes = monitoringtypesGetRes.body;

                // Set assertions
                (monitoringtypes[0].user._id).should.equal(userId);
                (monitoringtypes[0].name).should.match('Monitoringtype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Monitoringtype if not logged in', function (done) {
    agent.post('/api/monitoringtypes')
      .send(monitoringtype)
      .expect(403)
      .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
        // Call the assertion callback
        done(monitoringtypeSaveErr);
      });
  });

  it('should not be able to save an Monitoringtype if no name is provided', function (done) {
    // Invalidate name field
    monitoringtype.name = '';

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

        // Save a new Monitoringtype
        agent.post('/api/monitoringtypes')
          .send(monitoringtype)
          .expect(400)
          .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
            // Set message assertion
            (monitoringtypeSaveRes.body.message).should.match('Please fill Monitoringtype name');

            // Handle Monitoringtype save error
            done(monitoringtypeSaveErr);
          });
      });
  });

  it('should be able to update an Monitoringtype if signed in', function (done) {
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

        // Save a new Monitoringtype
        agent.post('/api/monitoringtypes')
          .send(monitoringtype)
          .expect(200)
          .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
            // Handle Monitoringtype save error
            if (monitoringtypeSaveErr) {
              return done(monitoringtypeSaveErr);
            }

            // Update Monitoringtype name
            monitoringtype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Monitoringtype
            agent.put('/api/monitoringtypes/' + monitoringtypeSaveRes.body._id)
              .send(monitoringtype)
              .expect(200)
              .end(function (monitoringtypeUpdateErr, monitoringtypeUpdateRes) {
                // Handle Monitoringtype update error
                if (monitoringtypeUpdateErr) {
                  return done(monitoringtypeUpdateErr);
                }

                // Set assertions
                (monitoringtypeUpdateRes.body._id).should.equal(monitoringtypeSaveRes.body._id);
                (monitoringtypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Monitoringtypes if not signed in', function (done) {
    // Create new Monitoringtype model instance
    var monitoringtypeObj = new Monitoringtype(monitoringtype);

    // Save the monitoringtype
    monitoringtypeObj.save(function () {
      // Request Monitoringtypes
      request(app).get('/api/monitoringtypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Monitoringtype if not signed in', function (done) {
    // Create new Monitoringtype model instance
    var monitoringtypeObj = new Monitoringtype(monitoringtype);

    // Save the Monitoringtype
    monitoringtypeObj.save(function () {
      request(app).get('/api/monitoringtypes/' + monitoringtypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', monitoringtype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Monitoringtype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/monitoringtypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Monitoringtype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Monitoringtype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Monitoringtype
    request(app).get('/api/monitoringtypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Monitoringtype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Monitoringtype if signed in', function (done) {
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

        // Save a new Monitoringtype
        agent.post('/api/monitoringtypes')
          .send(monitoringtype)
          .expect(200)
          .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
            // Handle Monitoringtype save error
            if (monitoringtypeSaveErr) {
              return done(monitoringtypeSaveErr);
            }

            // Delete an existing Monitoringtype
            agent.delete('/api/monitoringtypes/' + monitoringtypeSaveRes.body._id)
              .send(monitoringtype)
              .expect(200)
              .end(function (monitoringtypeDeleteErr, monitoringtypeDeleteRes) {
                // Handle monitoringtype error error
                if (monitoringtypeDeleteErr) {
                  return done(monitoringtypeDeleteErr);
                }

                // Set assertions
                (monitoringtypeDeleteRes.body._id).should.equal(monitoringtypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Monitoringtype if not signed in', function (done) {
    // Set Monitoringtype user
    monitoringtype.user = user;

    // Create new Monitoringtype model instance
    var monitoringtypeObj = new Monitoringtype(monitoringtype);

    // Save the Monitoringtype
    monitoringtypeObj.save(function () {
      // Try deleting Monitoringtype
      request(app).delete('/api/monitoringtypes/' + monitoringtypeObj._id)
        .expect(403)
        .end(function (monitoringtypeDeleteErr, monitoringtypeDeleteRes) {
          // Set message assertion
          (monitoringtypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Monitoringtype error error
          done(monitoringtypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Monitoringtype that has an orphaned user reference', function (done) {
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

          // Save a new Monitoringtype
          agent.post('/api/monitoringtypes')
            .send(monitoringtype)
            .expect(200)
            .end(function (monitoringtypeSaveErr, monitoringtypeSaveRes) {
              // Handle Monitoringtype save error
              if (monitoringtypeSaveErr) {
                return done(monitoringtypeSaveErr);
              }

              // Set assertions on new Monitoringtype
              (monitoringtypeSaveRes.body.name).should.equal(monitoringtype.name);
              should.exist(monitoringtypeSaveRes.body.user);
              should.equal(monitoringtypeSaveRes.body.user._id, orphanId);

              // force the Monitoringtype to have an orphaned user reference
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

                    // Get the Monitoringtype
                    agent.get('/api/monitoringtypes/' + monitoringtypeSaveRes.body._id)
                      .expect(200)
                      .end(function (monitoringtypeInfoErr, monitoringtypeInfoRes) {
                        // Handle Monitoringtype error
                        if (monitoringtypeInfoErr) {
                          return done(monitoringtypeInfoErr);
                        }

                        // Set assertions
                        (monitoringtypeInfoRes.body._id).should.equal(monitoringtypeSaveRes.body._id);
                        (monitoringtypeInfoRes.body.name).should.equal(monitoringtype.name);
                        should.equal(monitoringtypeInfoRes.body.user, undefined);

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
      Monitoringtype.remove().exec(done);
    });
  });
});
