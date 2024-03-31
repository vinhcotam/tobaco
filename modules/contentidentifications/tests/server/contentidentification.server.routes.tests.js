'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contentidentification = mongoose.model('Contentidentification'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contentidentification;

/**
 * Contentidentification routes tests
 */
describe('Contentidentification CRUD tests', function () {

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

    // Save a user to the test db and create new Contentidentification
    user.save(function () {
      contentidentification = {
        name: 'Contentidentification name'
      };

      done();
    });
  });

  it('should be able to save a Contentidentification if logged in', function (done) {
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

        // Save a new Contentidentification
        agent.post('/api/contentidentifications')
          .send(contentidentification)
          .expect(200)
          .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
            // Handle Contentidentification save error
            if (contentidentificationSaveErr) {
              return done(contentidentificationSaveErr);
            }

            // Get a list of Contentidentifications
            agent.get('/api/contentidentifications')
              .end(function (contentidentificationsGetErr, contentidentificationsGetRes) {
                // Handle Contentidentifications save error
                if (contentidentificationsGetErr) {
                  return done(contentidentificationsGetErr);
                }

                // Get Contentidentifications list
                var contentidentifications = contentidentificationsGetRes.body;

                // Set assertions
                (contentidentifications[0].user._id).should.equal(userId);
                (contentidentifications[0].name).should.match('Contentidentification name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contentidentification if not logged in', function (done) {
    agent.post('/api/contentidentifications')
      .send(contentidentification)
      .expect(403)
      .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
        // Call the assertion callback
        done(contentidentificationSaveErr);
      });
  });

  it('should not be able to save an Contentidentification if no name is provided', function (done) {
    // Invalidate name field
    contentidentification.name = '';

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

        // Save a new Contentidentification
        agent.post('/api/contentidentifications')
          .send(contentidentification)
          .expect(400)
          .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
            // Set message assertion
            (contentidentificationSaveRes.body.message).should.match('Please fill Contentidentification name');

            // Handle Contentidentification save error
            done(contentidentificationSaveErr);
          });
      });
  });

  it('should be able to update an Contentidentification if signed in', function (done) {
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

        // Save a new Contentidentification
        agent.post('/api/contentidentifications')
          .send(contentidentification)
          .expect(200)
          .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
            // Handle Contentidentification save error
            if (contentidentificationSaveErr) {
              return done(contentidentificationSaveErr);
            }

            // Update Contentidentification name
            contentidentification.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contentidentification
            agent.put('/api/contentidentifications/' + contentidentificationSaveRes.body._id)
              .send(contentidentification)
              .expect(200)
              .end(function (contentidentificationUpdateErr, contentidentificationUpdateRes) {
                // Handle Contentidentification update error
                if (contentidentificationUpdateErr) {
                  return done(contentidentificationUpdateErr);
                }

                // Set assertions
                (contentidentificationUpdateRes.body._id).should.equal(contentidentificationSaveRes.body._id);
                (contentidentificationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contentidentifications if not signed in', function (done) {
    // Create new Contentidentification model instance
    var contentidentificationObj = new Contentidentification(contentidentification);

    // Save the contentidentification
    contentidentificationObj.save(function () {
      // Request Contentidentifications
      request(app).get('/api/contentidentifications')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contentidentification if not signed in', function (done) {
    // Create new Contentidentification model instance
    var contentidentificationObj = new Contentidentification(contentidentification);

    // Save the Contentidentification
    contentidentificationObj.save(function () {
      request(app).get('/api/contentidentifications/' + contentidentificationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contentidentification.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contentidentification with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contentidentifications/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contentidentification is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contentidentification which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contentidentification
    request(app).get('/api/contentidentifications/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contentidentification with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contentidentification if signed in', function (done) {
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

        // Save a new Contentidentification
        agent.post('/api/contentidentifications')
          .send(contentidentification)
          .expect(200)
          .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
            // Handle Contentidentification save error
            if (contentidentificationSaveErr) {
              return done(contentidentificationSaveErr);
            }

            // Delete an existing Contentidentification
            agent.delete('/api/contentidentifications/' + contentidentificationSaveRes.body._id)
              .send(contentidentification)
              .expect(200)
              .end(function (contentidentificationDeleteErr, contentidentificationDeleteRes) {
                // Handle contentidentification error error
                if (contentidentificationDeleteErr) {
                  return done(contentidentificationDeleteErr);
                }

                // Set assertions
                (contentidentificationDeleteRes.body._id).should.equal(contentidentificationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contentidentification if not signed in', function (done) {
    // Set Contentidentification user
    contentidentification.user = user;

    // Create new Contentidentification model instance
    var contentidentificationObj = new Contentidentification(contentidentification);

    // Save the Contentidentification
    contentidentificationObj.save(function () {
      // Try deleting Contentidentification
      request(app).delete('/api/contentidentifications/' + contentidentificationObj._id)
        .expect(403)
        .end(function (contentidentificationDeleteErr, contentidentificationDeleteRes) {
          // Set message assertion
          (contentidentificationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contentidentification error error
          done(contentidentificationDeleteErr);
        });

    });
  });

  it('should be able to get a single Contentidentification that has an orphaned user reference', function (done) {
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

          // Save a new Contentidentification
          agent.post('/api/contentidentifications')
            .send(contentidentification)
            .expect(200)
            .end(function (contentidentificationSaveErr, contentidentificationSaveRes) {
              // Handle Contentidentification save error
              if (contentidentificationSaveErr) {
                return done(contentidentificationSaveErr);
              }

              // Set assertions on new Contentidentification
              (contentidentificationSaveRes.body.name).should.equal(contentidentification.name);
              should.exist(contentidentificationSaveRes.body.user);
              should.equal(contentidentificationSaveRes.body.user._id, orphanId);

              // force the Contentidentification to have an orphaned user reference
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

                    // Get the Contentidentification
                    agent.get('/api/contentidentifications/' + contentidentificationSaveRes.body._id)
                      .expect(200)
                      .end(function (contentidentificationInfoErr, contentidentificationInfoRes) {
                        // Handle Contentidentification error
                        if (contentidentificationInfoErr) {
                          return done(contentidentificationInfoErr);
                        }

                        // Set assertions
                        (contentidentificationInfoRes.body._id).should.equal(contentidentificationSaveRes.body._id);
                        (contentidentificationInfoRes.body.name).should.equal(contentidentification.name);
                        should.equal(contentidentificationInfoRes.body.user, undefined);

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
      Contentidentification.remove().exec(done);
    });
  });
});
