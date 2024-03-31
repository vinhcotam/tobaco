'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawlerschedule = mongoose.model('Crawlerschedule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crawlerschedule;

/**
 * Crawlerschedule routes tests
 */
describe('Crawlerschedule CRUD tests', function () {

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

    // Save a user to the test db and create new Crawlerschedule
    user.save(function () {
      crawlerschedule = {
        name: 'Crawlerschedule name'
      };

      done();
    });
  });

  it('should be able to save a Crawlerschedule if logged in', function (done) {
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

        // Save a new Crawlerschedule
        agent.post('/api/crawlerschedules')
          .send(crawlerschedule)
          .expect(200)
          .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
            // Handle Crawlerschedule save error
            if (crawlerscheduleSaveErr) {
              return done(crawlerscheduleSaveErr);
            }

            // Get a list of Crawlerschedules
            agent.get('/api/crawlerschedules')
              .end(function (crawlerschedulesGetErr, crawlerschedulesGetRes) {
                // Handle Crawlerschedules save error
                if (crawlerschedulesGetErr) {
                  return done(crawlerschedulesGetErr);
                }

                // Get Crawlerschedules list
                var crawlerschedules = crawlerschedulesGetRes.body;

                // Set assertions
                (crawlerschedules[0].user._id).should.equal(userId);
                (crawlerschedules[0].name).should.match('Crawlerschedule name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Crawlerschedule if not logged in', function (done) {
    agent.post('/api/crawlerschedules')
      .send(crawlerschedule)
      .expect(403)
      .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
        // Call the assertion callback
        done(crawlerscheduleSaveErr);
      });
  });

  it('should not be able to save an Crawlerschedule if no name is provided', function (done) {
    // Invalidate name field
    crawlerschedule.name = '';

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

        // Save a new Crawlerschedule
        agent.post('/api/crawlerschedules')
          .send(crawlerschedule)
          .expect(400)
          .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
            // Set message assertion
            (crawlerscheduleSaveRes.body.message).should.match('Please fill Crawlerschedule name');

            // Handle Crawlerschedule save error
            done(crawlerscheduleSaveErr);
          });
      });
  });

  it('should be able to update an Crawlerschedule if signed in', function (done) {
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

        // Save a new Crawlerschedule
        agent.post('/api/crawlerschedules')
          .send(crawlerschedule)
          .expect(200)
          .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
            // Handle Crawlerschedule save error
            if (crawlerscheduleSaveErr) {
              return done(crawlerscheduleSaveErr);
            }

            // Update Crawlerschedule name
            crawlerschedule.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Crawlerschedule
            agent.put('/api/crawlerschedules/' + crawlerscheduleSaveRes.body._id)
              .send(crawlerschedule)
              .expect(200)
              .end(function (crawlerscheduleUpdateErr, crawlerscheduleUpdateRes) {
                // Handle Crawlerschedule update error
                if (crawlerscheduleUpdateErr) {
                  return done(crawlerscheduleUpdateErr);
                }

                // Set assertions
                (crawlerscheduleUpdateRes.body._id).should.equal(crawlerscheduleSaveRes.body._id);
                (crawlerscheduleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crawlerschedules if not signed in', function (done) {
    // Create new Crawlerschedule model instance
    var crawlerscheduleObj = new Crawlerschedule(crawlerschedule);

    // Save the crawlerschedule
    crawlerscheduleObj.save(function () {
      // Request Crawlerschedules
      request(app).get('/api/crawlerschedules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Crawlerschedule if not signed in', function (done) {
    // Create new Crawlerschedule model instance
    var crawlerscheduleObj = new Crawlerschedule(crawlerschedule);

    // Save the Crawlerschedule
    crawlerscheduleObj.save(function () {
      request(app).get('/api/crawlerschedules/' + crawlerscheduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', crawlerschedule.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Crawlerschedule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crawlerschedules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crawlerschedule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Crawlerschedule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Crawlerschedule
    request(app).get('/api/crawlerschedules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Crawlerschedule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Crawlerschedule if signed in', function (done) {
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

        // Save a new Crawlerschedule
        agent.post('/api/crawlerschedules')
          .send(crawlerschedule)
          .expect(200)
          .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
            // Handle Crawlerschedule save error
            if (crawlerscheduleSaveErr) {
              return done(crawlerscheduleSaveErr);
            }

            // Delete an existing Crawlerschedule
            agent.delete('/api/crawlerschedules/' + crawlerscheduleSaveRes.body._id)
              .send(crawlerschedule)
              .expect(200)
              .end(function (crawlerscheduleDeleteErr, crawlerscheduleDeleteRes) {
                // Handle crawlerschedule error error
                if (crawlerscheduleDeleteErr) {
                  return done(crawlerscheduleDeleteErr);
                }

                // Set assertions
                (crawlerscheduleDeleteRes.body._id).should.equal(crawlerscheduleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Crawlerschedule if not signed in', function (done) {
    // Set Crawlerschedule user
    crawlerschedule.user = user;

    // Create new Crawlerschedule model instance
    var crawlerscheduleObj = new Crawlerschedule(crawlerschedule);

    // Save the Crawlerschedule
    crawlerscheduleObj.save(function () {
      // Try deleting Crawlerschedule
      request(app).delete('/api/crawlerschedules/' + crawlerscheduleObj._id)
        .expect(403)
        .end(function (crawlerscheduleDeleteErr, crawlerscheduleDeleteRes) {
          // Set message assertion
          (crawlerscheduleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Crawlerschedule error error
          done(crawlerscheduleDeleteErr);
        });

    });
  });

  it('should be able to get a single Crawlerschedule that has an orphaned user reference', function (done) {
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

          // Save a new Crawlerschedule
          agent.post('/api/crawlerschedules')
            .send(crawlerschedule)
            .expect(200)
            .end(function (crawlerscheduleSaveErr, crawlerscheduleSaveRes) {
              // Handle Crawlerschedule save error
              if (crawlerscheduleSaveErr) {
                return done(crawlerscheduleSaveErr);
              }

              // Set assertions on new Crawlerschedule
              (crawlerscheduleSaveRes.body.name).should.equal(crawlerschedule.name);
              should.exist(crawlerscheduleSaveRes.body.user);
              should.equal(crawlerscheduleSaveRes.body.user._id, orphanId);

              // force the Crawlerschedule to have an orphaned user reference
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

                    // Get the Crawlerschedule
                    agent.get('/api/crawlerschedules/' + crawlerscheduleSaveRes.body._id)
                      .expect(200)
                      .end(function (crawlerscheduleInfoErr, crawlerscheduleInfoRes) {
                        // Handle Crawlerschedule error
                        if (crawlerscheduleInfoErr) {
                          return done(crawlerscheduleInfoErr);
                        }

                        // Set assertions
                        (crawlerscheduleInfoRes.body._id).should.equal(crawlerscheduleSaveRes.body._id);
                        (crawlerscheduleInfoRes.body.name).should.equal(crawlerschedule.name);
                        should.equal(crawlerscheduleInfoRes.body.user, undefined);

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
      Crawlerschedule.remove().exec(done);
    });
  });
});
