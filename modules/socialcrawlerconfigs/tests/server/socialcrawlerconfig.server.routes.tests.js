'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Socialcrawlerconfig = mongoose.model('Socialcrawlerconfig'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  socialcrawlerconfig;

/**
 * Socialcrawlerconfig routes tests
 */
describe('Socialcrawlerconfig CRUD tests', function () {

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

    // Save a user to the test db and create new Socialcrawlerconfig
    user.save(function () {
      socialcrawlerconfig = {
        name: 'Socialcrawlerconfig name'
      };

      done();
    });
  });

  it('should be able to save a Socialcrawlerconfig if logged in', function (done) {
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

        // Save a new Socialcrawlerconfig
        agent.post('/api/socialcrawlerconfigs')
          .send(socialcrawlerconfig)
          .expect(200)
          .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
            // Handle Socialcrawlerconfig save error
            if (socialcrawlerconfigSaveErr) {
              return done(socialcrawlerconfigSaveErr);
            }

            // Get a list of Socialcrawlerconfigs
            agent.get('/api/socialcrawlerconfigs')
              .end(function (socialcrawlerconfigsGetErr, socialcrawlerconfigsGetRes) {
                // Handle Socialcrawlerconfigs save error
                if (socialcrawlerconfigsGetErr) {
                  return done(socialcrawlerconfigsGetErr);
                }

                // Get Socialcrawlerconfigs list
                var socialcrawlerconfigs = socialcrawlerconfigsGetRes.body;

                // Set assertions
                (socialcrawlerconfigs[0].user._id).should.equal(userId);
                (socialcrawlerconfigs[0].name).should.match('Socialcrawlerconfig name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Socialcrawlerconfig if not logged in', function (done) {
    agent.post('/api/socialcrawlerconfigs')
      .send(socialcrawlerconfig)
      .expect(403)
      .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
        // Call the assertion callback
        done(socialcrawlerconfigSaveErr);
      });
  });

  it('should not be able to save an Socialcrawlerconfig if no name is provided', function (done) {
    // Invalidate name field
    socialcrawlerconfig.name = '';

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

        // Save a new Socialcrawlerconfig
        agent.post('/api/socialcrawlerconfigs')
          .send(socialcrawlerconfig)
          .expect(400)
          .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
            // Set message assertion
            (socialcrawlerconfigSaveRes.body.message).should.match('Please fill Socialcrawlerconfig name');

            // Handle Socialcrawlerconfig save error
            done(socialcrawlerconfigSaveErr);
          });
      });
  });

  it('should be able to update an Socialcrawlerconfig if signed in', function (done) {
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

        // Save a new Socialcrawlerconfig
        agent.post('/api/socialcrawlerconfigs')
          .send(socialcrawlerconfig)
          .expect(200)
          .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
            // Handle Socialcrawlerconfig save error
            if (socialcrawlerconfigSaveErr) {
              return done(socialcrawlerconfigSaveErr);
            }

            // Update Socialcrawlerconfig name
            socialcrawlerconfig.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Socialcrawlerconfig
            agent.put('/api/socialcrawlerconfigs/' + socialcrawlerconfigSaveRes.body._id)
              .send(socialcrawlerconfig)
              .expect(200)
              .end(function (socialcrawlerconfigUpdateErr, socialcrawlerconfigUpdateRes) {
                // Handle Socialcrawlerconfig update error
                if (socialcrawlerconfigUpdateErr) {
                  return done(socialcrawlerconfigUpdateErr);
                }

                // Set assertions
                (socialcrawlerconfigUpdateRes.body._id).should.equal(socialcrawlerconfigSaveRes.body._id);
                (socialcrawlerconfigUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Socialcrawlerconfigs if not signed in', function (done) {
    // Create new Socialcrawlerconfig model instance
    var socialcrawlerconfigObj = new Socialcrawlerconfig(socialcrawlerconfig);

    // Save the socialcrawlerconfig
    socialcrawlerconfigObj.save(function () {
      // Request Socialcrawlerconfigs
      request(app).get('/api/socialcrawlerconfigs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Socialcrawlerconfig if not signed in', function (done) {
    // Create new Socialcrawlerconfig model instance
    var socialcrawlerconfigObj = new Socialcrawlerconfig(socialcrawlerconfig);

    // Save the Socialcrawlerconfig
    socialcrawlerconfigObj.save(function () {
      request(app).get('/api/socialcrawlerconfigs/' + socialcrawlerconfigObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', socialcrawlerconfig.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Socialcrawlerconfig with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/socialcrawlerconfigs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Socialcrawlerconfig is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Socialcrawlerconfig which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Socialcrawlerconfig
    request(app).get('/api/socialcrawlerconfigs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Socialcrawlerconfig with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Socialcrawlerconfig if signed in', function (done) {
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

        // Save a new Socialcrawlerconfig
        agent.post('/api/socialcrawlerconfigs')
          .send(socialcrawlerconfig)
          .expect(200)
          .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
            // Handle Socialcrawlerconfig save error
            if (socialcrawlerconfigSaveErr) {
              return done(socialcrawlerconfigSaveErr);
            }

            // Delete an existing Socialcrawlerconfig
            agent.delete('/api/socialcrawlerconfigs/' + socialcrawlerconfigSaveRes.body._id)
              .send(socialcrawlerconfig)
              .expect(200)
              .end(function (socialcrawlerconfigDeleteErr, socialcrawlerconfigDeleteRes) {
                // Handle socialcrawlerconfig error error
                if (socialcrawlerconfigDeleteErr) {
                  return done(socialcrawlerconfigDeleteErr);
                }

                // Set assertions
                (socialcrawlerconfigDeleteRes.body._id).should.equal(socialcrawlerconfigSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Socialcrawlerconfig if not signed in', function (done) {
    // Set Socialcrawlerconfig user
    socialcrawlerconfig.user = user;

    // Create new Socialcrawlerconfig model instance
    var socialcrawlerconfigObj = new Socialcrawlerconfig(socialcrawlerconfig);

    // Save the Socialcrawlerconfig
    socialcrawlerconfigObj.save(function () {
      // Try deleting Socialcrawlerconfig
      request(app).delete('/api/socialcrawlerconfigs/' + socialcrawlerconfigObj._id)
        .expect(403)
        .end(function (socialcrawlerconfigDeleteErr, socialcrawlerconfigDeleteRes) {
          // Set message assertion
          (socialcrawlerconfigDeleteRes.body.message).should.match('User is not authorized');

          // Handle Socialcrawlerconfig error error
          done(socialcrawlerconfigDeleteErr);
        });

    });
  });

  it('should be able to get a single Socialcrawlerconfig that has an orphaned user reference', function (done) {
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

          // Save a new Socialcrawlerconfig
          agent.post('/api/socialcrawlerconfigs')
            .send(socialcrawlerconfig)
            .expect(200)
            .end(function (socialcrawlerconfigSaveErr, socialcrawlerconfigSaveRes) {
              // Handle Socialcrawlerconfig save error
              if (socialcrawlerconfigSaveErr) {
                return done(socialcrawlerconfigSaveErr);
              }

              // Set assertions on new Socialcrawlerconfig
              (socialcrawlerconfigSaveRes.body.name).should.equal(socialcrawlerconfig.name);
              should.exist(socialcrawlerconfigSaveRes.body.user);
              should.equal(socialcrawlerconfigSaveRes.body.user._id, orphanId);

              // force the Socialcrawlerconfig to have an orphaned user reference
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

                    // Get the Socialcrawlerconfig
                    agent.get('/api/socialcrawlerconfigs/' + socialcrawlerconfigSaveRes.body._id)
                      .expect(200)
                      .end(function (socialcrawlerconfigInfoErr, socialcrawlerconfigInfoRes) {
                        // Handle Socialcrawlerconfig error
                        if (socialcrawlerconfigInfoErr) {
                          return done(socialcrawlerconfigInfoErr);
                        }

                        // Set assertions
                        (socialcrawlerconfigInfoRes.body._id).should.equal(socialcrawlerconfigSaveRes.body._id);
                        (socialcrawlerconfigInfoRes.body.name).should.equal(socialcrawlerconfig.name);
                        should.equal(socialcrawlerconfigInfoRes.body.user, undefined);

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
      Socialcrawlerconfig.remove().exec(done);
    });
  });
});
