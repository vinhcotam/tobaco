'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawlerdriver = mongoose.model('Crawlerdriver'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crawlerdriver;

/**
 * Crawlerdriver routes tests
 */
describe('Crawlerdriver CRUD tests', function () {

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

    // Save a user to the test db and create new Crawlerdriver
    user.save(function () {
      crawlerdriver = {
        name: 'Crawlerdriver name'
      };

      done();
    });
  });

  it('should be able to save a Crawlerdriver if logged in', function (done) {
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

        // Save a new Crawlerdriver
        agent.post('/api/crawlerdrivers')
          .send(crawlerdriver)
          .expect(200)
          .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
            // Handle Crawlerdriver save error
            if (crawlerdriverSaveErr) {
              return done(crawlerdriverSaveErr);
            }

            // Get a list of Crawlerdrivers
            agent.get('/api/crawlerdrivers')
              .end(function (crawlerdriversGetErr, crawlerdriversGetRes) {
                // Handle Crawlerdrivers save error
                if (crawlerdriversGetErr) {
                  return done(crawlerdriversGetErr);
                }

                // Get Crawlerdrivers list
                var crawlerdrivers = crawlerdriversGetRes.body;

                // Set assertions
                (crawlerdrivers[0].user._id).should.equal(userId);
                (crawlerdrivers[0].name).should.match('Crawlerdriver name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Crawlerdriver if not logged in', function (done) {
    agent.post('/api/crawlerdrivers')
      .send(crawlerdriver)
      .expect(403)
      .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
        // Call the assertion callback
        done(crawlerdriverSaveErr);
      });
  });

  it('should not be able to save an Crawlerdriver if no name is provided', function (done) {
    // Invalidate name field
    crawlerdriver.name = '';

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

        // Save a new Crawlerdriver
        agent.post('/api/crawlerdrivers')
          .send(crawlerdriver)
          .expect(400)
          .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
            // Set message assertion
            (crawlerdriverSaveRes.body.message).should.match('Please fill Crawlerdriver name');

            // Handle Crawlerdriver save error
            done(crawlerdriverSaveErr);
          });
      });
  });

  it('should be able to update an Crawlerdriver if signed in', function (done) {
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

        // Save a new Crawlerdriver
        agent.post('/api/crawlerdrivers')
          .send(crawlerdriver)
          .expect(200)
          .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
            // Handle Crawlerdriver save error
            if (crawlerdriverSaveErr) {
              return done(crawlerdriverSaveErr);
            }

            // Update Crawlerdriver name
            crawlerdriver.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Crawlerdriver
            agent.put('/api/crawlerdrivers/' + crawlerdriverSaveRes.body._id)
              .send(crawlerdriver)
              .expect(200)
              .end(function (crawlerdriverUpdateErr, crawlerdriverUpdateRes) {
                // Handle Crawlerdriver update error
                if (crawlerdriverUpdateErr) {
                  return done(crawlerdriverUpdateErr);
                }

                // Set assertions
                (crawlerdriverUpdateRes.body._id).should.equal(crawlerdriverSaveRes.body._id);
                (crawlerdriverUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crawlerdrivers if not signed in', function (done) {
    // Create new Crawlerdriver model instance
    var crawlerdriverObj = new Crawlerdriver(crawlerdriver);

    // Save the crawlerdriver
    crawlerdriverObj.save(function () {
      // Request Crawlerdrivers
      request(app).get('/api/crawlerdrivers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Crawlerdriver if not signed in', function (done) {
    // Create new Crawlerdriver model instance
    var crawlerdriverObj = new Crawlerdriver(crawlerdriver);

    // Save the Crawlerdriver
    crawlerdriverObj.save(function () {
      request(app).get('/api/crawlerdrivers/' + crawlerdriverObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', crawlerdriver.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Crawlerdriver with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crawlerdrivers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crawlerdriver is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Crawlerdriver which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Crawlerdriver
    request(app).get('/api/crawlerdrivers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Crawlerdriver with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Crawlerdriver if signed in', function (done) {
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

        // Save a new Crawlerdriver
        agent.post('/api/crawlerdrivers')
          .send(crawlerdriver)
          .expect(200)
          .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
            // Handle Crawlerdriver save error
            if (crawlerdriverSaveErr) {
              return done(crawlerdriverSaveErr);
            }

            // Delete an existing Crawlerdriver
            agent.delete('/api/crawlerdrivers/' + crawlerdriverSaveRes.body._id)
              .send(crawlerdriver)
              .expect(200)
              .end(function (crawlerdriverDeleteErr, crawlerdriverDeleteRes) {
                // Handle crawlerdriver error error
                if (crawlerdriverDeleteErr) {
                  return done(crawlerdriverDeleteErr);
                }

                // Set assertions
                (crawlerdriverDeleteRes.body._id).should.equal(crawlerdriverSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Crawlerdriver if not signed in', function (done) {
    // Set Crawlerdriver user
    crawlerdriver.user = user;

    // Create new Crawlerdriver model instance
    var crawlerdriverObj = new Crawlerdriver(crawlerdriver);

    // Save the Crawlerdriver
    crawlerdriverObj.save(function () {
      // Try deleting Crawlerdriver
      request(app).delete('/api/crawlerdrivers/' + crawlerdriverObj._id)
        .expect(403)
        .end(function (crawlerdriverDeleteErr, crawlerdriverDeleteRes) {
          // Set message assertion
          (crawlerdriverDeleteRes.body.message).should.match('User is not authorized');

          // Handle Crawlerdriver error error
          done(crawlerdriverDeleteErr);
        });

    });
  });

  it('should be able to get a single Crawlerdriver that has an orphaned user reference', function (done) {
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

          // Save a new Crawlerdriver
          agent.post('/api/crawlerdrivers')
            .send(crawlerdriver)
            .expect(200)
            .end(function (crawlerdriverSaveErr, crawlerdriverSaveRes) {
              // Handle Crawlerdriver save error
              if (crawlerdriverSaveErr) {
                return done(crawlerdriverSaveErr);
              }

              // Set assertions on new Crawlerdriver
              (crawlerdriverSaveRes.body.name).should.equal(crawlerdriver.name);
              should.exist(crawlerdriverSaveRes.body.user);
              should.equal(crawlerdriverSaveRes.body.user._id, orphanId);

              // force the Crawlerdriver to have an orphaned user reference
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

                    // Get the Crawlerdriver
                    agent.get('/api/crawlerdrivers/' + crawlerdriverSaveRes.body._id)
                      .expect(200)
                      .end(function (crawlerdriverInfoErr, crawlerdriverInfoRes) {
                        // Handle Crawlerdriver error
                        if (crawlerdriverInfoErr) {
                          return done(crawlerdriverInfoErr);
                        }

                        // Set assertions
                        (crawlerdriverInfoRes.body._id).should.equal(crawlerdriverSaveRes.body._id);
                        (crawlerdriverInfoRes.body.name).should.equal(crawlerdriver.name);
                        should.equal(crawlerdriverInfoRes.body.user, undefined);

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
      Crawlerdriver.remove().exec(done);
    });
  });
});
