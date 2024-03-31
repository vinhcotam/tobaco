'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Topic = mongoose.model('Topic'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  topic;

/**
 * Topic routes tests
 */
describe('Topic CRUD tests', function () {

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

    // Save a user to the test db and create new Topic
    user.save(function () {
      topic = {
        name: 'Topic name'
      };

      done();
    });
  });

  it('should be able to save a Topic if logged in', function (done) {
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

        // Save a new Topic
        agent.post('/api/topics')
          .send(topic)
          .expect(200)
          .end(function (topicSaveErr, topicSaveRes) {
            // Handle Topic save error
            if (topicSaveErr) {
              return done(topicSaveErr);
            }

            // Get a list of Topics
            agent.get('/api/topics')
              .end(function (topicsGetErr, topicsGetRes) {
                // Handle Topics save error
                if (topicsGetErr) {
                  return done(topicsGetErr);
                }

                // Get Topics list
                var topics = topicsGetRes.body;

                // Set assertions
                (topics[0].user._id).should.equal(userId);
                (topics[0].name).should.match('Topic name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Topic if not logged in', function (done) {
    agent.post('/api/topics')
      .send(topic)
      .expect(403)
      .end(function (topicSaveErr, topicSaveRes) {
        // Call the assertion callback
        done(topicSaveErr);
      });
  });

  it('should not be able to save an Topic if no name is provided', function (done) {
    // Invalidate name field
    topic.name = '';

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

        // Save a new Topic
        agent.post('/api/topics')
          .send(topic)
          .expect(400)
          .end(function (topicSaveErr, topicSaveRes) {
            // Set message assertion
            (topicSaveRes.body.message).should.match('Please fill Topic name');

            // Handle Topic save error
            done(topicSaveErr);
          });
      });
  });

  it('should be able to update an Topic if signed in', function (done) {
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

        // Save a new Topic
        agent.post('/api/topics')
          .send(topic)
          .expect(200)
          .end(function (topicSaveErr, topicSaveRes) {
            // Handle Topic save error
            if (topicSaveErr) {
              return done(topicSaveErr);
            }

            // Update Topic name
            topic.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Topic
            agent.put('/api/topics/' + topicSaveRes.body._id)
              .send(topic)
              .expect(200)
              .end(function (topicUpdateErr, topicUpdateRes) {
                // Handle Topic update error
                if (topicUpdateErr) {
                  return done(topicUpdateErr);
                }

                // Set assertions
                (topicUpdateRes.body._id).should.equal(topicSaveRes.body._id);
                (topicUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Topics if not signed in', function (done) {
    // Create new Topic model instance
    var topicObj = new Topic(topic);

    // Save the topic
    topicObj.save(function () {
      // Request Topics
      request(app).get('/api/topics')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Topic if not signed in', function (done) {
    // Create new Topic model instance
    var topicObj = new Topic(topic);

    // Save the Topic
    topicObj.save(function () {
      request(app).get('/api/topics/' + topicObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', topic.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Topic with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/topics/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Topic is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Topic which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Topic
    request(app).get('/api/topics/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Topic with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Topic if signed in', function (done) {
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

        // Save a new Topic
        agent.post('/api/topics')
          .send(topic)
          .expect(200)
          .end(function (topicSaveErr, topicSaveRes) {
            // Handle Topic save error
            if (topicSaveErr) {
              return done(topicSaveErr);
            }

            // Delete an existing Topic
            agent.delete('/api/topics/' + topicSaveRes.body._id)
              .send(topic)
              .expect(200)
              .end(function (topicDeleteErr, topicDeleteRes) {
                // Handle topic error error
                if (topicDeleteErr) {
                  return done(topicDeleteErr);
                }

                // Set assertions
                (topicDeleteRes.body._id).should.equal(topicSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Topic if not signed in', function (done) {
    // Set Topic user
    topic.user = user;

    // Create new Topic model instance
    var topicObj = new Topic(topic);

    // Save the Topic
    topicObj.save(function () {
      // Try deleting Topic
      request(app).delete('/api/topics/' + topicObj._id)
        .expect(403)
        .end(function (topicDeleteErr, topicDeleteRes) {
          // Set message assertion
          (topicDeleteRes.body.message).should.match('User is not authorized');

          // Handle Topic error error
          done(topicDeleteErr);
        });

    });
  });

  it('should be able to get a single Topic that has an orphaned user reference', function (done) {
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

          // Save a new Topic
          agent.post('/api/topics')
            .send(topic)
            .expect(200)
            .end(function (topicSaveErr, topicSaveRes) {
              // Handle Topic save error
              if (topicSaveErr) {
                return done(topicSaveErr);
              }

              // Set assertions on new Topic
              (topicSaveRes.body.name).should.equal(topic.name);
              should.exist(topicSaveRes.body.user);
              should.equal(topicSaveRes.body.user._id, orphanId);

              // force the Topic to have an orphaned user reference
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

                    // Get the Topic
                    agent.get('/api/topics/' + topicSaveRes.body._id)
                      .expect(200)
                      .end(function (topicInfoErr, topicInfoRes) {
                        // Handle Topic error
                        if (topicInfoErr) {
                          return done(topicInfoErr);
                        }

                        // Set assertions
                        (topicInfoRes.body._id).should.equal(topicSaveRes.body._id);
                        (topicInfoRes.body.name).should.equal(topic.name);
                        should.equal(topicInfoRes.body.user, undefined);

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
      Topic.remove().exec(done);
    });
  });
});
