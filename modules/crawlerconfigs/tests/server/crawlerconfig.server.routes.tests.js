'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawlerconfig = mongoose.model('Crawlerconfig'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crawlerconfig;

/**
 * Crawlerconfig routes tests
 */
describe('Crawlerconfig CRUD tests', function () {

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

    // Save a user to the test db and create new Crawlerconfig
    user.save(function () {
      crawlerconfig = {
        name: 'Crawlerconfig name'
      };

      done();
    });
  });

  it('should be able to save a Crawlerconfig if logged in', function (done) {
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

        // Save a new Crawlerconfig
        agent.post('/api/crawlerconfigs')
          .send(crawlerconfig)
          .expect(200)
          .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
            // Handle Crawlerconfig save error
            if (crawlerconfigSaveErr) {
              return done(crawlerconfigSaveErr);
            }

            // Get a list of Crawlerconfigs
            agent.get('/api/crawlerconfigs')
              .end(function (crawlerconfigsGetErr, crawlerconfigsGetRes) {
                // Handle Crawlerconfigs save error
                if (crawlerconfigsGetErr) {
                  return done(crawlerconfigsGetErr);
                }

                // Get Crawlerconfigs list
                var crawlerconfigs = crawlerconfigsGetRes.body;

                // Set assertions
                (crawlerconfigs[0].user._id).should.equal(userId);
                (crawlerconfigs[0].name).should.match('Crawlerconfig name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Crawlerconfig if not logged in', function (done) {
    agent.post('/api/crawlerconfigs')
      .send(crawlerconfig)
      .expect(403)
      .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
        // Call the assertion callback
        done(crawlerconfigSaveErr);
      });
  });

  it('should not be able to save an Crawlerconfig if no name is provided', function (done) {
    // Invalidate name field
    crawlerconfig.name = '';

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

        // Save a new Crawlerconfig
        agent.post('/api/crawlerconfigs')
          .send(crawlerconfig)
          .expect(400)
          .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
            // Set message assertion
            (crawlerconfigSaveRes.body.message).should.match('Please fill Crawlerconfig name');

            // Handle Crawlerconfig save error
            done(crawlerconfigSaveErr);
          });
      });
  });

  it('should be able to update an Crawlerconfig if signed in', function (done) {
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

        // Save a new Crawlerconfig
        agent.post('/api/crawlerconfigs')
          .send(crawlerconfig)
          .expect(200)
          .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
            // Handle Crawlerconfig save error
            if (crawlerconfigSaveErr) {
              return done(crawlerconfigSaveErr);
            }

            // Update Crawlerconfig name
            crawlerconfig.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Crawlerconfig
            agent.put('/api/crawlerconfigs/' + crawlerconfigSaveRes.body._id)
              .send(crawlerconfig)
              .expect(200)
              .end(function (crawlerconfigUpdateErr, crawlerconfigUpdateRes) {
                // Handle Crawlerconfig update error
                if (crawlerconfigUpdateErr) {
                  return done(crawlerconfigUpdateErr);
                }

                // Set assertions
                (crawlerconfigUpdateRes.body._id).should.equal(crawlerconfigSaveRes.body._id);
                (crawlerconfigUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crawlerconfigs if not signed in', function (done) {
    // Create new Crawlerconfig model instance
    var crawlerconfigObj = new Crawlerconfig(crawlerconfig);

    // Save the crawlerconfig
    crawlerconfigObj.save(function () {
      // Request Crawlerconfigs
      request(app).get('/api/crawlerconfigs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Crawlerconfig if not signed in', function (done) {
    // Create new Crawlerconfig model instance
    var crawlerconfigObj = new Crawlerconfig(crawlerconfig);

    // Save the Crawlerconfig
    crawlerconfigObj.save(function () {
      request(app).get('/api/crawlerconfigs/' + crawlerconfigObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', crawlerconfig.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Crawlerconfig with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crawlerconfigs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crawlerconfig is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Crawlerconfig which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Crawlerconfig
    request(app).get('/api/crawlerconfigs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Crawlerconfig with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Crawlerconfig if signed in', function (done) {
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

        // Save a new Crawlerconfig
        agent.post('/api/crawlerconfigs')
          .send(crawlerconfig)
          .expect(200)
          .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
            // Handle Crawlerconfig save error
            if (crawlerconfigSaveErr) {
              return done(crawlerconfigSaveErr);
            }

            // Delete an existing Crawlerconfig
            agent.delete('/api/crawlerconfigs/' + crawlerconfigSaveRes.body._id)
              .send(crawlerconfig)
              .expect(200)
              .end(function (crawlerconfigDeleteErr, crawlerconfigDeleteRes) {
                // Handle crawlerconfig error error
                if (crawlerconfigDeleteErr) {
                  return done(crawlerconfigDeleteErr);
                }

                // Set assertions
                (crawlerconfigDeleteRes.body._id).should.equal(crawlerconfigSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Crawlerconfig if not signed in', function (done) {
    // Set Crawlerconfig user
    crawlerconfig.user = user;

    // Create new Crawlerconfig model instance
    var crawlerconfigObj = new Crawlerconfig(crawlerconfig);

    // Save the Crawlerconfig
    crawlerconfigObj.save(function () {
      // Try deleting Crawlerconfig
      request(app).delete('/api/crawlerconfigs/' + crawlerconfigObj._id)
        .expect(403)
        .end(function (crawlerconfigDeleteErr, crawlerconfigDeleteRes) {
          // Set message assertion
          (crawlerconfigDeleteRes.body.message).should.match('User is not authorized');

          // Handle Crawlerconfig error error
          done(crawlerconfigDeleteErr);
        });

    });
  });

  it('should be able to get a single Crawlerconfig that has an orphaned user reference', function (done) {
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

          // Save a new Crawlerconfig
          agent.post('/api/crawlerconfigs')
            .send(crawlerconfig)
            .expect(200)
            .end(function (crawlerconfigSaveErr, crawlerconfigSaveRes) {
              // Handle Crawlerconfig save error
              if (crawlerconfigSaveErr) {
                return done(crawlerconfigSaveErr);
              }

              // Set assertions on new Crawlerconfig
              (crawlerconfigSaveRes.body.name).should.equal(crawlerconfig.name);
              should.exist(crawlerconfigSaveRes.body.user);
              should.equal(crawlerconfigSaveRes.body.user._id, orphanId);

              // force the Crawlerconfig to have an orphaned user reference
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

                    // Get the Crawlerconfig
                    agent.get('/api/crawlerconfigs/' + crawlerconfigSaveRes.body._id)
                      .expect(200)
                      .end(function (crawlerconfigInfoErr, crawlerconfigInfoRes) {
                        // Handle Crawlerconfig error
                        if (crawlerconfigInfoErr) {
                          return done(crawlerconfigInfoErr);
                        }

                        // Set assertions
                        (crawlerconfigInfoRes.body._id).should.equal(crawlerconfigSaveRes.body._id);
                        (crawlerconfigInfoRes.body.name).should.equal(crawlerconfig.name);
                        should.equal(crawlerconfigInfoRes.body.user, undefined);

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
      Crawlerconfig.remove().exec(done);
    });
  });
});
