'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  comment = mongoose.model('comment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  comment;

/**
 * comment routes tests
 */
describe('comment CRUD tests', function () {

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

    // Save a user to the test db and create new comment
    user.save(function () {
        comment = {
        name: 'comment name'
      };

      done();
    });
  });

  it('should be able to save a comment if logged in', function (done) {
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

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Get a list of comment
            agent.get('/api/comments')
              .end(function (commentsGetErr, commentsGetRes) {
                // Handle comment save error
                if (commentsGetErr) {
                  return done(commentsGetErr);
                }

                // Get comment list
                var comments = commentsGetRes.body;

                // Set assertions
                (comments[0].user._id).should.equal(userId);
                (comments[0].name).should.match('comment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an comment if not logged in', function (done) {
    agent.post('/api/comments')
      .send(comment)
      .expect(403)
      .end(function (commentSaveErr, commentSaveRes) {
        // Call the assertion callback
        done(commentSaveErr);
      });
  });

  it('should not be able to save an comment if no name is provided', function (done) {
    // Invalidate name field
    comment.name = '';

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

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(400)
          .end(function (commentSaveErr, commentSaveRes) {
            // Set message assertion
            (commentSaveRes.body.message).should.match('Please fill comment name');

            // Handle comment save error
            done(commentSaveErr);
          });
      });
  });

  it('should be able to update an comment if signed in', function (done) {
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

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Update comment name
            comment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing comment
            agent.put('/api/comments/' + commentSaveRes.body._id)
              .send(comment)
              .expect(200)
              .end(function (commentUpdateErr, commentUpdateRes) {
                // Handle comment update error
                if (commentUpdateErr) {
                  return done(commentUpdateErr);
                }

                // Set assertions
                (commentUpdateRes.body._id).should.equal(commentSaveRes.body._id);
                (commentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of comment if not signed in', function (done) {
    // Create new comment model instance
    var commentObj = new comment(comment);

    // Save the comment
    commentObj.save(function () {
      // Request comment
      request(app).get('/api/comments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single comment if not signed in', function (done) {
    // Create new comment model instance
    var commentObj = new comment(comment);

    // Save the comment
    commentObj.save(function () {
      request(app).get('/api/comments/' + commentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', comment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single comment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/comments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'comment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single comment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent comment
    request(app).get('/api/comments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No comment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an comment if signed in', function (done) {
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

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Delete an existing comment
            agent.delete('/api/comments/' + commentSaveRes.body._id)
              .send(comment)
              .expect(200)
              .end(function (commentDeleteErr, commentDeleteRes) {
                // Handle comment error error
                if (commentDeleteErr) {
                  return done(commentDeleteErr);
                }

                // Set assertions
                (commentDeleteRes.body._id).should.equal(commentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an comment if not signed in', function (done) {
    // Set comment user
    comment.user = user;

    // Create new comment model instance
    var commentObj = new comment(comment);

    // Save the comment
    commentObj.save(function () {
      // Try deleting comment
      request(app).delete('/api/comments/' + commentObj._id)
        .expect(403)
        .end(function (commentDeleteErr, commentDeleteRes) {
          // Set message assertion
          (commentDeleteRes.body.message).should.match('User is not authorized');

          // Handle comment error error
          done(commentDeleteErr);
        });

    });
  });

  it('should be able to get a single comment that has an orphaned user reference', function (done) {
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

          // Save a new comment
          agent.post('/api/comments')
            .send(comment)
            .expect(200)
            .end(function (commentSaveErr, commentSaveRes) {
              // Handle comment save error
              if (commentSaveErr) {
                return done(commentSaveErr);
              }

              // Set assertions on new comment
              (commentSaveRes.body.name).should.equal(comment.name);
              should.exist(commentSaveRes.body.user);
              should.equal(commentSaveRes.body.user._id, orphanId);

              // force the comment to have an orphaned user reference
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

                    // Get the comment
                    agent.get('/api/comments/' + commentSaveRes.body._id)
                      .expect(200)
                      .end(function (commentInfoErr, commentInfoRes) {
                        // Handle comment error
                        if (commentInfoErr) {
                          return done(commentInfoErr);
                        }

                        // Set assertions
                        (commentInfoRes.body._id).should.equal(commentSaveRes.body._id);
                        (commentInfoRes.body.name).should.equal(comment.name);
                        should.equal(commentInfoRes.body.user, undefined);

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
        comment.remove().exec(done);
    });
  });
});
