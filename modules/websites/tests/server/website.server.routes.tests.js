'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Website = mongoose.model('Website'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  website;

/**
 * Website routes tests
 */
describe('Website CRUD tests', function () {

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

    // Save a user to the test db and create new Website
    user.save(function () {
      website = {
        name: 'Website name'
      };

      done();
    });
  });

  it('should be able to save a Website if logged in', function (done) {
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

        // Save a new Website
        agent.post('/api/websites')
          .send(website)
          .expect(200)
          .end(function (websiteSaveErr, websiteSaveRes) {
            // Handle Website save error
            if (websiteSaveErr) {
              return done(websiteSaveErr);
            }

            // Get a list of Websites
            agent.get('/api/websites')
              .end(function (websitesGetErr, websitesGetRes) {
                // Handle Websites save error
                if (websitesGetErr) {
                  return done(websitesGetErr);
                }

                // Get Websites list
                var websites = websitesGetRes.body;

                // Set assertions
                (websites[0].user._id).should.equal(userId);
                (websites[0].name).should.match('Website name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Website if not logged in', function (done) {
    agent.post('/api/websites')
      .send(website)
      .expect(403)
      .end(function (websiteSaveErr, websiteSaveRes) {
        // Call the assertion callback
        done(websiteSaveErr);
      });
  });

  it('should not be able to save an Website if no name is provided', function (done) {
    // Invalidate name field
    website.name = '';

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

        // Save a new Website
        agent.post('/api/websites')
          .send(website)
          .expect(400)
          .end(function (websiteSaveErr, websiteSaveRes) {
            // Set message assertion
            (websiteSaveRes.body.message).should.match('Please fill Website name');

            // Handle Website save error
            done(websiteSaveErr);
          });
      });
  });

  it('should be able to update an Website if signed in', function (done) {
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

        // Save a new Website
        agent.post('/api/websites')
          .send(website)
          .expect(200)
          .end(function (websiteSaveErr, websiteSaveRes) {
            // Handle Website save error
            if (websiteSaveErr) {
              return done(websiteSaveErr);
            }

            // Update Website name
            website.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Website
            agent.put('/api/websites/' + websiteSaveRes.body._id)
              .send(website)
              .expect(200)
              .end(function (websiteUpdateErr, websiteUpdateRes) {
                // Handle Website update error
                if (websiteUpdateErr) {
                  return done(websiteUpdateErr);
                }

                // Set assertions
                (websiteUpdateRes.body._id).should.equal(websiteSaveRes.body._id);
                (websiteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Websites if not signed in', function (done) {
    // Create new Website model instance
    var websiteObj = new Website(website);

    // Save the website
    websiteObj.save(function () {
      // Request Websites
      request(app).get('/api/websites')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Website if not signed in', function (done) {
    // Create new Website model instance
    var websiteObj = new Website(website);

    // Save the Website
    websiteObj.save(function () {
      request(app).get('/api/websites/' + websiteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', website.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Website with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/websites/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Website is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Website which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Website
    request(app).get('/api/websites/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Website with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Website if signed in', function (done) {
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

        // Save a new Website
        agent.post('/api/websites')
          .send(website)
          .expect(200)
          .end(function (websiteSaveErr, websiteSaveRes) {
            // Handle Website save error
            if (websiteSaveErr) {
              return done(websiteSaveErr);
            }

            // Delete an existing Website
            agent.delete('/api/websites/' + websiteSaveRes.body._id)
              .send(website)
              .expect(200)
              .end(function (websiteDeleteErr, websiteDeleteRes) {
                // Handle website error error
                if (websiteDeleteErr) {
                  return done(websiteDeleteErr);
                }

                // Set assertions
                (websiteDeleteRes.body._id).should.equal(websiteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Website if not signed in', function (done) {
    // Set Website user
    website.user = user;

    // Create new Website model instance
    var websiteObj = new Website(website);

    // Save the Website
    websiteObj.save(function () {
      // Try deleting Website
      request(app).delete('/api/websites/' + websiteObj._id)
        .expect(403)
        .end(function (websiteDeleteErr, websiteDeleteRes) {
          // Set message assertion
          (websiteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Website error error
          done(websiteDeleteErr);
        });

    });
  });

  it('should be able to get a single Website that has an orphaned user reference', function (done) {
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

          // Save a new Website
          agent.post('/api/websites')
            .send(website)
            .expect(200)
            .end(function (websiteSaveErr, websiteSaveRes) {
              // Handle Website save error
              if (websiteSaveErr) {
                return done(websiteSaveErr);
              }

              // Set assertions on new Website
              (websiteSaveRes.body.name).should.equal(website.name);
              should.exist(websiteSaveRes.body.user);
              should.equal(websiteSaveRes.body.user._id, orphanId);

              // force the Website to have an orphaned user reference
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

                    // Get the Website
                    agent.get('/api/websites/' + websiteSaveRes.body._id)
                      .expect(200)
                      .end(function (websiteInfoErr, websiteInfoRes) {
                        // Handle Website error
                        if (websiteInfoErr) {
                          return done(websiteInfoErr);
                        }

                        // Set assertions
                        (websiteInfoRes.body._id).should.equal(websiteSaveRes.body._id);
                        (websiteInfoRes.body.name).should.equal(website.name);
                        should.equal(websiteInfoRes.body.user, undefined);

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
      Website.remove().exec(done);
    });
  });
});
