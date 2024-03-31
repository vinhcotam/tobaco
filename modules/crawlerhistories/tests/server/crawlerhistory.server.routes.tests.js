'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawlerhistory = mongoose.model('Crawlerhistory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crawlerhistory;

/**
 * Crawlerhistory routes tests
 */
describe('Crawlerhistory CRUD tests', function () {

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

    // Save a user to the test db and create new Crawlerhistory
    user.save(function () {
      crawlerhistory = {
        name: 'Crawlerhistory name'
      };

      done();
    });
  });

  it('should be able to save a Crawlerhistory if logged in', function (done) {
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

        // Save a new Crawlerhistory
        agent.post('/api/crawlerhistories')
          .send(crawlerhistory)
          .expect(200)
          .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
            // Handle Crawlerhistory save error
            if (crawlerhistorySaveErr) {
              return done(crawlerhistorySaveErr);
            }

            // Get a list of Crawlerhistories
            agent.get('/api/crawlerhistories')
              .end(function (crawlerhistoriesGetErr, crawlerhistoriesGetRes) {
                // Handle Crawlerhistories save error
                if (crawlerhistoriesGetErr) {
                  return done(crawlerhistoriesGetErr);
                }

                // Get Crawlerhistories list
                var crawlerhistories = crawlerhistoriesGetRes.body;

                // Set assertions
                (crawlerhistories[0].user._id).should.equal(userId);
                (crawlerhistories[0].name).should.match('Crawlerhistory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Crawlerhistory if not logged in', function (done) {
    agent.post('/api/crawlerhistories')
      .send(crawlerhistory)
      .expect(403)
      .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
        // Call the assertion callback
        done(crawlerhistorySaveErr);
      });
  });

  it('should not be able to save an Crawlerhistory if no name is provided', function (done) {
    // Invalidate name field
    crawlerhistory.name = '';

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

        // Save a new Crawlerhistory
        agent.post('/api/crawlerhistories')
          .send(crawlerhistory)
          .expect(400)
          .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
            // Set message assertion
            (crawlerhistorySaveRes.body.message).should.match('Please fill Crawlerhistory name');

            // Handle Crawlerhistory save error
            done(crawlerhistorySaveErr);
          });
      });
  });

  it('should be able to update an Crawlerhistory if signed in', function (done) {
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

        // Save a new Crawlerhistory
        agent.post('/api/crawlerhistories')
          .send(crawlerhistory)
          .expect(200)
          .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
            // Handle Crawlerhistory save error
            if (crawlerhistorySaveErr) {
              return done(crawlerhistorySaveErr);
            }

            // Update Crawlerhistory name
            crawlerhistory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Crawlerhistory
            agent.put('/api/crawlerhistories/' + crawlerhistorySaveRes.body._id)
              .send(crawlerhistory)
              .expect(200)
              .end(function (crawlerhistoryUpdateErr, crawlerhistoryUpdateRes) {
                // Handle Crawlerhistory update error
                if (crawlerhistoryUpdateErr) {
                  return done(crawlerhistoryUpdateErr);
                }

                // Set assertions
                (crawlerhistoryUpdateRes.body._id).should.equal(crawlerhistorySaveRes.body._id);
                (crawlerhistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crawlerhistories if not signed in', function (done) {
    // Create new Crawlerhistory model instance
    var crawlerhistoryObj = new Crawlerhistory(crawlerhistory);

    // Save the crawlerhistory
    crawlerhistoryObj.save(function () {
      // Request Crawlerhistories
      request(app).get('/api/crawlerhistories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Crawlerhistory if not signed in', function (done) {
    // Create new Crawlerhistory model instance
    var crawlerhistoryObj = new Crawlerhistory(crawlerhistory);

    // Save the Crawlerhistory
    crawlerhistoryObj.save(function () {
      request(app).get('/api/crawlerhistories/' + crawlerhistoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', crawlerhistory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Crawlerhistory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crawlerhistories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crawlerhistory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Crawlerhistory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Crawlerhistory
    request(app).get('/api/crawlerhistories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Crawlerhistory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Crawlerhistory if signed in', function (done) {
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

        // Save a new Crawlerhistory
        agent.post('/api/crawlerhistories')
          .send(crawlerhistory)
          .expect(200)
          .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
            // Handle Crawlerhistory save error
            if (crawlerhistorySaveErr) {
              return done(crawlerhistorySaveErr);
            }

            // Delete an existing Crawlerhistory
            agent.delete('/api/crawlerhistories/' + crawlerhistorySaveRes.body._id)
              .send(crawlerhistory)
              .expect(200)
              .end(function (crawlerhistoryDeleteErr, crawlerhistoryDeleteRes) {
                // Handle crawlerhistory error error
                if (crawlerhistoryDeleteErr) {
                  return done(crawlerhistoryDeleteErr);
                }

                // Set assertions
                (crawlerhistoryDeleteRes.body._id).should.equal(crawlerhistorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Crawlerhistory if not signed in', function (done) {
    // Set Crawlerhistory user
    crawlerhistory.user = user;

    // Create new Crawlerhistory model instance
    var crawlerhistoryObj = new Crawlerhistory(crawlerhistory);

    // Save the Crawlerhistory
    crawlerhistoryObj.save(function () {
      // Try deleting Crawlerhistory
      request(app).delete('/api/crawlerhistories/' + crawlerhistoryObj._id)
        .expect(403)
        .end(function (crawlerhistoryDeleteErr, crawlerhistoryDeleteRes) {
          // Set message assertion
          (crawlerhistoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Crawlerhistory error error
          done(crawlerhistoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Crawlerhistory that has an orphaned user reference', function (done) {
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

          // Save a new Crawlerhistory
          agent.post('/api/crawlerhistories')
            .send(crawlerhistory)
            .expect(200)
            .end(function (crawlerhistorySaveErr, crawlerhistorySaveRes) {
              // Handle Crawlerhistory save error
              if (crawlerhistorySaveErr) {
                return done(crawlerhistorySaveErr);
              }

              // Set assertions on new Crawlerhistory
              (crawlerhistorySaveRes.body.name).should.equal(crawlerhistory.name);
              should.exist(crawlerhistorySaveRes.body.user);
              should.equal(crawlerhistorySaveRes.body.user._id, orphanId);

              // force the Crawlerhistory to have an orphaned user reference
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

                    // Get the Crawlerhistory
                    agent.get('/api/crawlerhistories/' + crawlerhistorySaveRes.body._id)
                      .expect(200)
                      .end(function (crawlerhistoryInfoErr, crawlerhistoryInfoRes) {
                        // Handle Crawlerhistory error
                        if (crawlerhistoryInfoErr) {
                          return done(crawlerhistoryInfoErr);
                        }

                        // Set assertions
                        (crawlerhistoryInfoRes.body._id).should.equal(crawlerhistorySaveRes.body._id);
                        (crawlerhistoryInfoRes.body.name).should.equal(crawlerhistory.name);
                        should.equal(crawlerhistoryInfoRes.body.user, undefined);

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
      Crawlerhistory.remove().exec(done);
    });
  });
});
