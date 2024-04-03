'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sentiment = mongoose.model('Sentiment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sentiment;

/**
 * sentiment routes tests
 */
describe('Sentiment CRUD tests', function () {

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

    // Save a user to the test db and create new Sentiment
    user.save(function () {
        sentiment = {
        name: 'Sentiment name'
      };

      done();
    });
  });

  it('should be able to save a Sentiment if logged in', function (done) {
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

        // Save a new Sentiment
        agent.post('/api/sentiments')
          .send(sentiment)
          .expect(200)
          .end(function (sentimentSaveErr, sentimentSaveRes) {
            // Handle sentiment save error
            if (sentimentSaveErr) {
              return done(sentimentSaveErr);
            }

            // Get a list of sentiment
            agent.get('/api/sentiments')
              .end(function (sentimentsGetErr, sentimentsGetRes) {
                // Handle sentiment save error
                if (sentimentsGetErr) {
                  return done(sentimentsGetErr);
                }

                // Get sentiment list
                var sentiments = sentimentsGetRes.body;

                // Set assertions
                (sentiments[0].user._id).should.equal(userId);
                (sentiments[0].name).should.match('Sentiment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sentiment if not logged in', function (done) {
    agent.post('/api/sentiments')
      .send(sentiment)
      .expect(403)
      .end(function (sentimentSaveErr, sentimentSaveRes) {
        // Call the assertion callback
        done(sentimentSaveErr);
      });
  });

  it('should not be able to save an Sentiment if no name is provided', function (done) {
    // Invalidate name field
    sentiment.name = '';

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

        // Save a new sentiment
        agent.post('/api/sentiments')
          .send(sentiment)
          .expect(400)
          .end(function (sentimentSaveErr, sentimentSaveRes) {
            // Set message assertion
            (sentimentSaveRes.body.message).should.match('Please fill Sentiment name');

            // Handle sentiment save error
            done(sentimentSaveErr);
          });
      });
  });

  it('should be able to update an Sentiment if signed in', function (done) {
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

        // Save a new sentiment
        agent.post('/api/sentiments')
          .send(sentiment)
          .expect(200)
          .end(function (sentimentSaveErr, sentimentSaveRes) {
            // Handle sentiment save error
            if (sentimentSaveErr) {
              return done(sentimentSaveErr);
            }

            // Update sentiment name
            sentiment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing sentiment
            agent.put('/api/sentiments/' + sentimentSaveRes.body._id)
              .send(sentiment)
              .expect(200)
              .end(function (sentimentUpdateErr, sentimentUpdateRes) {
                // Handle sentiment update error
                if (sentimentUpdateErr) {
                  return done(sentimentUpdateErr);
                }

                // Set assertions
                (sentimentUpdateRes.body._id).should.equal(sentimentSaveRes.body._id);
                (sentimentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of sentiment if not signed in', function (done) {
    // Create new sentiment model instance
    var sentimentObj = new Sentiment(sentiment);

    // Save the sentiment
    sentimentObj.save(function () {
      // Request sentiment
      request(app).get('/api/sentiments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sentiment if not signed in', function (done) {
    // Create new sentiment model instance
    var sentimentObj = new Sentiment(sentiment);

    // Save the sentiment
    sentimentObj.save(function () {
      request(app).get('/api/sentiments/' + sentimentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sentiment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single sentiment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sentiments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sentiment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single sentiment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent sentiment
    request(app).get('/api/sentiments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sentiment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sentiment if signed in', function (done) {
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

        // Save a new sentiment
        agent.post('/api/sentiments')
          .send(sentiment)
          .expect(200)
          .end(function (sentimentSaveErr, sentimentSaveRes) {
            // Handle sentiment save error
            if (sentimentSaveErr) {
              return done(sentimentSaveErr);
            }

            // Delete an existing sentiment
            agent.delete('/api/sentiments/' + sentimentSaveRes.body._id)
              .send(sentiment)
              .expect(200)
              .end(function (sentimentDeleteErr, sentimentDeleteRes) {
                // Handle sentiment error error
                if (sentimentDeleteErr) {
                  return done(sentimentDeleteErr);
                }

                // Set assertions
                (sentimentDeleteRes.body._id).should.equal(sentimentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an sentiment if not signed in', function (done) {
    // Set sentiment user
    sentiment.user = user;

    // Create new sentiment model instance
    var sentimentObj = new Sentiment(sentiment);

    // Save the sentiment
    sentimentObj.save(function () {
      // Try deleting sentiment
      request(app).delete('/api/sentiments/' + sentimentObj._id)
        .expect(403)
        .end(function (sentimentDeleteErr, sentimentDeleteRes) {
          // Set message assertion
          (sentimentDeleteRes.body.message).should.match('User is not authorized');

          // Handle sentiment error error
          done(sentimentDeleteErr);
        });

    });
  });

  it('should be able to get a single sentiment that has an orphaned user reference', function (done) {
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

          // Save a new sentiment
          agent.post('/api/sentiments')
            .send(sentiment)
            .expect(200)
            .end(function (sentimentSaveErr, sentimentSaveRes) {
              // Handle sentiment save error
              if (sentimentSaveErr) {
                return done(sentimentSaveErr);
              }

              // Set assertions on new sentiment
              (sentimentSaveRes.body.name).should.equal(sentiment.name);
              should.exist(sentimentSaveRes.body.user);
              should.equal(sentimentSaveRes.body.user._id, orphanId);

              // force the sentiment to have an orphaned user reference
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

                    // Get the sentiment
                    agent.get('/api/sentiments/' + sentimentSaveRes.body._id)
                      .expect(200)
                      .end(function (sentimentInfoErr, sentimentInfoRes) {
                        // Handle sentiment error
                        if (sentimentInfoErr) {
                          return done(sentimentInfoErr);
                        }

                        // Set assertions
                        (sentimentInfoRes.body._id).should.equal(sentimentSaveRes.body._id);
                        (sentimentInfoRes.body.name).should.equal(sentiment.name);
                        should.equal(sentimentInfoRes.body.user, undefined);

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
        Sentiment.remove().exec(done);
    });
  });
});
