'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Statistic = mongoose.model('Statistic'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  statistic;

/**
 * Statistic routes tests
 */
describe('Statistic CRUD tests', function () {

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

    // Save a user to the test db and create new Statistic
    user.save(function () {
      statistic = {
        name: 'Statistic name'
      };

      done();
    });
  });

  it('should be able to save a Statistic if logged in', function (done) {
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

        // Save a new Statistic
        agent.post('/api/statistics')
          .send(statistic)
          .expect(200)
          .end(function (statisticSaveErr, statisticSaveRes) {
            // Handle Statistic save error
            if (statisticSaveErr) {
              return done(statisticSaveErr);
            }

            // Get a list of Statistics
            agent.get('/api/statistics')
              .end(function (statisticsGetErr, statisticsGetRes) {
                // Handle Statistics save error
                if (statisticsGetErr) {
                  return done(statisticsGetErr);
                }

                // Get Statistics list
                var statistics = statisticsGetRes.body;

                // Set assertions
                (statistics[0].user._id).should.equal(userId);
                (statistics[0].name).should.match('Statistic name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Statistic if not logged in', function (done) {
    agent.post('/api/statistics')
      .send(statistic)
      .expect(403)
      .end(function (statisticSaveErr, statisticSaveRes) {
        // Call the assertion callback
        done(statisticSaveErr);
      });
  });

  it('should not be able to save an Statistic if no name is provided', function (done) {
    // Invalidate name field
    statistic.name = '';

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

        // Save a new Statistic
        agent.post('/api/statistics')
          .send(statistic)
          .expect(400)
          .end(function (statisticSaveErr, statisticSaveRes) {
            // Set message assertion
            (statisticSaveRes.body.message).should.match('Please fill Statistic name');

            // Handle Statistic save error
            done(statisticSaveErr);
          });
      });
  });

  it('should be able to update an Statistic if signed in', function (done) {
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

        // Save a new Statistic
        agent.post('/api/statistics')
          .send(statistic)
          .expect(200)
          .end(function (statisticSaveErr, statisticSaveRes) {
            // Handle Statistic save error
            if (statisticSaveErr) {
              return done(statisticSaveErr);
            }

            // Update Statistic name
            statistic.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Statistic
            agent.put('/api/statistics/' + statisticSaveRes.body._id)
              .send(statistic)
              .expect(200)
              .end(function (statisticUpdateErr, statisticUpdateRes) {
                // Handle Statistic update error
                if (statisticUpdateErr) {
                  return done(statisticUpdateErr);
                }

                // Set assertions
                (statisticUpdateRes.body._id).should.equal(statisticSaveRes.body._id);
                (statisticUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Statistics if not signed in', function (done) {
    // Create new Statistic model instance
    var statisticObj = new Statistic(statistic);

    // Save the statistic
    statisticObj.save(function () {
      // Request Statistics
      request(app).get('/api/statistics')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Statistic if not signed in', function (done) {
    // Create new Statistic model instance
    var statisticObj = new Statistic(statistic);

    // Save the Statistic
    statisticObj.save(function () {
      request(app).get('/api/statistics/' + statisticObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', statistic.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Statistic with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/statistics/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Statistic is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Statistic which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Statistic
    request(app).get('/api/statistics/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Statistic with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Statistic if signed in', function (done) {
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

        // Save a new Statistic
        agent.post('/api/statistics')
          .send(statistic)
          .expect(200)
          .end(function (statisticSaveErr, statisticSaveRes) {
            // Handle Statistic save error
            if (statisticSaveErr) {
              return done(statisticSaveErr);
            }

            // Delete an existing Statistic
            agent.delete('/api/statistics/' + statisticSaveRes.body._id)
              .send(statistic)
              .expect(200)
              .end(function (statisticDeleteErr, statisticDeleteRes) {
                // Handle statistic error error
                if (statisticDeleteErr) {
                  return done(statisticDeleteErr);
                }

                // Set assertions
                (statisticDeleteRes.body._id).should.equal(statisticSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Statistic if not signed in', function (done) {
    // Set Statistic user
    statistic.user = user;

    // Create new Statistic model instance
    var statisticObj = new Statistic(statistic);

    // Save the Statistic
    statisticObj.save(function () {
      // Try deleting Statistic
      request(app).delete('/api/statistics/' + statisticObj._id)
        .expect(403)
        .end(function (statisticDeleteErr, statisticDeleteRes) {
          // Set message assertion
          (statisticDeleteRes.body.message).should.match('User is not authorized');

          // Handle Statistic error error
          done(statisticDeleteErr);
        });

    });
  });

  it('should be able to get a single Statistic that has an orphaned user reference', function (done) {
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

          // Save a new Statistic
          agent.post('/api/statistics')
            .send(statistic)
            .expect(200)
            .end(function (statisticSaveErr, statisticSaveRes) {
              // Handle Statistic save error
              if (statisticSaveErr) {
                return done(statisticSaveErr);
              }

              // Set assertions on new Statistic
              (statisticSaveRes.body.name).should.equal(statistic.name);
              should.exist(statisticSaveRes.body.user);
              should.equal(statisticSaveRes.body.user._id, orphanId);

              // force the Statistic to have an orphaned user reference
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

                    // Get the Statistic
                    agent.get('/api/statistics/' + statisticSaveRes.body._id)
                      .expect(200)
                      .end(function (statisticInfoErr, statisticInfoRes) {
                        // Handle Statistic error
                        if (statisticInfoErr) {
                          return done(statisticInfoErr);
                        }

                        // Set assertions
                        (statisticInfoRes.body._id).should.equal(statisticSaveRes.body._id);
                        (statisticInfoRes.body.name).should.equal(statistic.name);
                        should.equal(statisticInfoRes.body.user, undefined);

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
      Statistic.remove().exec(done);
    });
  });
});
