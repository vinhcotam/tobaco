'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Webcategory = mongoose.model('Webcategory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  webcategory;

/**
 * Webcategory routes tests
 */
describe('Webcategory CRUD tests', function () {

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

    // Save a user to the test db and create new Webcategory
    user.save(function () {
      webcategory = {
        name: 'Webcategory name'
      };

      done();
    });
  });

  it('should be able to save a Webcategory if logged in', function (done) {
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

        // Save a new Webcategory
        agent.post('/api/webcategories')
          .send(webcategory)
          .expect(200)
          .end(function (webcategorySaveErr, webcategorySaveRes) {
            // Handle Webcategory save error
            if (webcategorySaveErr) {
              return done(webcategorySaveErr);
            }

            // Get a list of Webcategories
            agent.get('/api/webcategories')
              .end(function (webcategoriesGetErr, webcategoriesGetRes) {
                // Handle Webcategories save error
                if (webcategoriesGetErr) {
                  return done(webcategoriesGetErr);
                }

                // Get Webcategories list
                var webcategories = webcategoriesGetRes.body;

                // Set assertions
                (webcategories[0].user._id).should.equal(userId);
                (webcategories[0].name).should.match('Webcategory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Webcategory if not logged in', function (done) {
    agent.post('/api/webcategories')
      .send(webcategory)
      .expect(403)
      .end(function (webcategorySaveErr, webcategorySaveRes) {
        // Call the assertion callback
        done(webcategorySaveErr);
      });
  });

  it('should not be able to save an Webcategory if no name is provided', function (done) {
    // Invalidate name field
    webcategory.name = '';

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

        // Save a new Webcategory
        agent.post('/api/webcategories')
          .send(webcategory)
          .expect(400)
          .end(function (webcategorySaveErr, webcategorySaveRes) {
            // Set message assertion
            (webcategorySaveRes.body.message).should.match('Please fill Webcategory name');

            // Handle Webcategory save error
            done(webcategorySaveErr);
          });
      });
  });

  it('should be able to update an Webcategory if signed in', function (done) {
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

        // Save a new Webcategory
        agent.post('/api/webcategories')
          .send(webcategory)
          .expect(200)
          .end(function (webcategorySaveErr, webcategorySaveRes) {
            // Handle Webcategory save error
            if (webcategorySaveErr) {
              return done(webcategorySaveErr);
            }

            // Update Webcategory name
            webcategory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Webcategory
            agent.put('/api/webcategories/' + webcategorySaveRes.body._id)
              .send(webcategory)
              .expect(200)
              .end(function (webcategoryUpdateErr, webcategoryUpdateRes) {
                // Handle Webcategory update error
                if (webcategoryUpdateErr) {
                  return done(webcategoryUpdateErr);
                }

                // Set assertions
                (webcategoryUpdateRes.body._id).should.equal(webcategorySaveRes.body._id);
                (webcategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Webcategories if not signed in', function (done) {
    // Create new Webcategory model instance
    var webcategoryObj = new Webcategory(webcategory);

    // Save the webcategory
    webcategoryObj.save(function () {
      // Request Webcategories
      request(app).get('/api/webcategories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Webcategory if not signed in', function (done) {
    // Create new Webcategory model instance
    var webcategoryObj = new Webcategory(webcategory);

    // Save the Webcategory
    webcategoryObj.save(function () {
      request(app).get('/api/webcategories/' + webcategoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', webcategory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Webcategory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/webcategories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Webcategory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Webcategory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Webcategory
    request(app).get('/api/webcategories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Webcategory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Webcategory if signed in', function (done) {
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

        // Save a new Webcategory
        agent.post('/api/webcategories')
          .send(webcategory)
          .expect(200)
          .end(function (webcategorySaveErr, webcategorySaveRes) {
            // Handle Webcategory save error
            if (webcategorySaveErr) {
              return done(webcategorySaveErr);
            }

            // Delete an existing Webcategory
            agent.delete('/api/webcategories/' + webcategorySaveRes.body._id)
              .send(webcategory)
              .expect(200)
              .end(function (webcategoryDeleteErr, webcategoryDeleteRes) {
                // Handle webcategory error error
                if (webcategoryDeleteErr) {
                  return done(webcategoryDeleteErr);
                }

                // Set assertions
                (webcategoryDeleteRes.body._id).should.equal(webcategorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Webcategory if not signed in', function (done) {
    // Set Webcategory user
    webcategory.user = user;

    // Create new Webcategory model instance
    var webcategoryObj = new Webcategory(webcategory);

    // Save the Webcategory
    webcategoryObj.save(function () {
      // Try deleting Webcategory
      request(app).delete('/api/webcategories/' + webcategoryObj._id)
        .expect(403)
        .end(function (webcategoryDeleteErr, webcategoryDeleteRes) {
          // Set message assertion
          (webcategoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Webcategory error error
          done(webcategoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Webcategory that has an orphaned user reference', function (done) {
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

          // Save a new Webcategory
          agent.post('/api/webcategories')
            .send(webcategory)
            .expect(200)
            .end(function (webcategorySaveErr, webcategorySaveRes) {
              // Handle Webcategory save error
              if (webcategorySaveErr) {
                return done(webcategorySaveErr);
              }

              // Set assertions on new Webcategory
              (webcategorySaveRes.body.name).should.equal(webcategory.name);
              should.exist(webcategorySaveRes.body.user);
              should.equal(webcategorySaveRes.body.user._id, orphanId);

              // force the Webcategory to have an orphaned user reference
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

                    // Get the Webcategory
                    agent.get('/api/webcategories/' + webcategorySaveRes.body._id)
                      .expect(200)
                      .end(function (webcategoryInfoErr, webcategoryInfoRes) {
                        // Handle Webcategory error
                        if (webcategoryInfoErr) {
                          return done(webcategoryInfoErr);
                        }

                        // Set assertions
                        (webcategoryInfoRes.body._id).should.equal(webcategorySaveRes.body._id);
                        (webcategoryInfoRes.body.name).should.equal(webcategory.name);
                        should.equal(webcategoryInfoRes.body.user, undefined);

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
      Webcategory.remove().exec(done);
    });
  });
});
