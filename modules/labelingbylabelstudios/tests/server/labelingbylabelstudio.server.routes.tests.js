'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Labelingbylabelstudio = mongoose.model('Labelingbylabelstudio'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  labelingbylabelstudio;

/**
 * Labelingbylabelstudio routes tests
 */
describe('Labelingbylabelstudio CRUD tests', function () {

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

    // Save a user to the test db and create new Labelingbylabelstudio
    user.save(function () {
      labelingbylabelstudio = {
        name: 'Labelingbylabelstudio name'
      };

      done();
    });
  });

  it('should be able to save a Labelingbylabelstudio if logged in', function (done) {
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

        // Save a new Labelingbylabelstudio
        agent.post('/api/labelingbylabelstudios')
          .send(labelingbylabelstudio)
          .expect(200)
          .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
            // Handle Labelingbylabelstudio save error
            if (labelingbylabelstudioSaveErr) {
              return done(labelingbylabelstudioSaveErr);
            }

            // Get a list of Labelingbylabelstudios
            agent.get('/api/labelingbylabelstudios')
              .end(function (labelingbylabelstudiosGetErr, labelingbylabelstudiosGetRes) {
                // Handle Labelingbylabelstudios save error
                if (labelingbylabelstudiosGetErr) {
                  return done(labelingbylabelstudiosGetErr);
                }

                // Get Labelingbylabelstudios list
                var labelingbylabelstudios = labelingbylabelstudiosGetRes.body;

                // Set assertions
                (labelingbylabelstudios[0].user._id).should.equal(userId);
                (labelingbylabelstudios[0].name).should.match('Labelingbylabelstudio name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Labelingbylabelstudio if not logged in', function (done) {
    agent.post('/api/labelingbylabelstudios')
      .send(labelingbylabelstudio)
      .expect(403)
      .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
        // Call the assertion callback
        done(labelingbylabelstudioSaveErr);
      });
  });

  it('should not be able to save an Labelingbylabelstudio if no name is provided', function (done) {
    // Invalidate name field
    labelingbylabelstudio.name = '';

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

        // Save a new Labelingbylabelstudio
        agent.post('/api/labelingbylabelstudios')
          .send(labelingbylabelstudio)
          .expect(400)
          .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
            // Set message assertion
            (labelingbylabelstudioSaveRes.body.message).should.match('Please fill Labelingbylabelstudio name');

            // Handle Labelingbylabelstudio save error
            done(labelingbylabelstudioSaveErr);
          });
      });
  });

  it('should be able to update an Labelingbylabelstudio if signed in', function (done) {
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

        // Save a new Labelingbylabelstudio
        agent.post('/api/labelingbylabelstudios')
          .send(labelingbylabelstudio)
          .expect(200)
          .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
            // Handle Labelingbylabelstudio save error
            if (labelingbylabelstudioSaveErr) {
              return done(labelingbylabelstudioSaveErr);
            }

            // Update Labelingbylabelstudio name
            labelingbylabelstudio.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Labelingbylabelstudio
            agent.put('/api/labelingbylabelstudios/' + labelingbylabelstudioSaveRes.body._id)
              .send(labelingbylabelstudio)
              .expect(200)
              .end(function (labelingbylabelstudioUpdateErr, labelingbylabelstudioUpdateRes) {
                // Handle Labelingbylabelstudio update error
                if (labelingbylabelstudioUpdateErr) {
                  return done(labelingbylabelstudioUpdateErr);
                }

                // Set assertions
                (labelingbylabelstudioUpdateRes.body._id).should.equal(labelingbylabelstudioSaveRes.body._id);
                (labelingbylabelstudioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Labelingbylabelstudios if not signed in', function (done) {
    // Create new Labelingbylabelstudio model instance
    var labelingbylabelstudioObj = new Labelingbylabelstudio(labelingbylabelstudio);

    // Save the labelingbylabelstudio
    labelingbylabelstudioObj.save(function () {
      // Request Labelingbylabelstudios
      request(app).get('/api/labelingbylabelstudios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Labelingbylabelstudio if not signed in', function (done) {
    // Create new Labelingbylabelstudio model instance
    var labelingbylabelstudioObj = new Labelingbylabelstudio(labelingbylabelstudio);

    // Save the Labelingbylabelstudio
    labelingbylabelstudioObj.save(function () {
      request(app).get('/api/labelingbylabelstudios/' + labelingbylabelstudioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', labelingbylabelstudio.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Labelingbylabelstudio with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/labelingbylabelstudios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Labelingbylabelstudio is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Labelingbylabelstudio which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Labelingbylabelstudio
    request(app).get('/api/labelingbylabelstudios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Labelingbylabelstudio with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Labelingbylabelstudio if signed in', function (done) {
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

        // Save a new Labelingbylabelstudio
        agent.post('/api/labelingbylabelstudios')
          .send(labelingbylabelstudio)
          .expect(200)
          .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
            // Handle Labelingbylabelstudio save error
            if (labelingbylabelstudioSaveErr) {
              return done(labelingbylabelstudioSaveErr);
            }

            // Delete an existing Labelingbylabelstudio
            agent.delete('/api/labelingbylabelstudios/' + labelingbylabelstudioSaveRes.body._id)
              .send(labelingbylabelstudio)
              .expect(200)
              .end(function (labelingbylabelstudioDeleteErr, labelingbylabelstudioDeleteRes) {
                // Handle labelingbylabelstudio error error
                if (labelingbylabelstudioDeleteErr) {
                  return done(labelingbylabelstudioDeleteErr);
                }

                // Set assertions
                (labelingbylabelstudioDeleteRes.body._id).should.equal(labelingbylabelstudioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Labelingbylabelstudio if not signed in', function (done) {
    // Set Labelingbylabelstudio user
    labelingbylabelstudio.user = user;

    // Create new Labelingbylabelstudio model instance
    var labelingbylabelstudioObj = new Labelingbylabelstudio(labelingbylabelstudio);

    // Save the Labelingbylabelstudio
    labelingbylabelstudioObj.save(function () {
      // Try deleting Labelingbylabelstudio
      request(app).delete('/api/labelingbylabelstudios/' + labelingbylabelstudioObj._id)
        .expect(403)
        .end(function (labelingbylabelstudioDeleteErr, labelingbylabelstudioDeleteRes) {
          // Set message assertion
          (labelingbylabelstudioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Labelingbylabelstudio error error
          done(labelingbylabelstudioDeleteErr);
        });

    });
  });

  it('should be able to get a single Labelingbylabelstudio that has an orphaned user reference', function (done) {
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

          // Save a new Labelingbylabelstudio
          agent.post('/api/labelingbylabelstudios')
            .send(labelingbylabelstudio)
            .expect(200)
            .end(function (labelingbylabelstudioSaveErr, labelingbylabelstudioSaveRes) {
              // Handle Labelingbylabelstudio save error
              if (labelingbylabelstudioSaveErr) {
                return done(labelingbylabelstudioSaveErr);
              }

              // Set assertions on new Labelingbylabelstudio
              (labelingbylabelstudioSaveRes.body.name).should.equal(labelingbylabelstudio.name);
              should.exist(labelingbylabelstudioSaveRes.body.user);
              should.equal(labelingbylabelstudioSaveRes.body.user._id, orphanId);

              // force the Labelingbylabelstudio to have an orphaned user reference
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

                    // Get the Labelingbylabelstudio
                    agent.get('/api/labelingbylabelstudios/' + labelingbylabelstudioSaveRes.body._id)
                      .expect(200)
                      .end(function (labelingbylabelstudioInfoErr, labelingbylabelstudioInfoRes) {
                        // Handle Labelingbylabelstudio error
                        if (labelingbylabelstudioInfoErr) {
                          return done(labelingbylabelstudioInfoErr);
                        }

                        // Set assertions
                        (labelingbylabelstudioInfoRes.body._id).should.equal(labelingbylabelstudioSaveRes.body._id);
                        (labelingbylabelstudioInfoRes.body.name).should.equal(labelingbylabelstudio.name);
                        should.equal(labelingbylabelstudioInfoRes.body.user, undefined);

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
      Labelingbylabelstudio.remove().exec(done);
    });
  });
});
