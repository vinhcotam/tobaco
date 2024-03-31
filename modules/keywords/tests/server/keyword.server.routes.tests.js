'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Keyword = mongoose.model('Keyword'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  keyword;

/**
 * Keyword routes tests
 */
describe('Keyword CRUD tests', function () {

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

    // Save a user to the test db and create new Keyword
    user.save(function () {
      keyword = {
        name: 'Keyword name'
      };

      done();
    });
  });

  it('should be able to save a Keyword if logged in', function (done) {
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

        // Save a new Keyword
        agent.post('/api/keywords')
          .send(keyword)
          .expect(200)
          .end(function (keywordSaveErr, keywordSaveRes) {
            // Handle Keyword save error
            if (keywordSaveErr) {
              return done(keywordSaveErr);
            }

            // Get a list of Keywords
            agent.get('/api/keywords')
              .end(function (keywordsGetErr, keywordsGetRes) {
                // Handle Keywords save error
                if (keywordsGetErr) {
                  return done(keywordsGetErr);
                }

                // Get Keywords list
                var keywords = keywordsGetRes.body;

                // Set assertions
                (keywords[0].user._id).should.equal(userId);
                (keywords[0].name).should.match('Keyword name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Keyword if not logged in', function (done) {
    agent.post('/api/keywords')
      .send(keyword)
      .expect(403)
      .end(function (keywordSaveErr, keywordSaveRes) {
        // Call the assertion callback
        done(keywordSaveErr);
      });
  });

  it('should not be able to save an Keyword if no name is provided', function (done) {
    // Invalidate name field
    keyword.name = '';

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

        // Save a new Keyword
        agent.post('/api/keywords')
          .send(keyword)
          .expect(400)
          .end(function (keywordSaveErr, keywordSaveRes) {
            // Set message assertion
            (keywordSaveRes.body.message).should.match('Please fill Keyword name');

            // Handle Keyword save error
            done(keywordSaveErr);
          });
      });
  });

  it('should be able to update an Keyword if signed in', function (done) {
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

        // Save a new Keyword
        agent.post('/api/keywords')
          .send(keyword)
          .expect(200)
          .end(function (keywordSaveErr, keywordSaveRes) {
            // Handle Keyword save error
            if (keywordSaveErr) {
              return done(keywordSaveErr);
            }

            // Update Keyword name
            keyword.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Keyword
            agent.put('/api/keywords/' + keywordSaveRes.body._id)
              .send(keyword)
              .expect(200)
              .end(function (keywordUpdateErr, keywordUpdateRes) {
                // Handle Keyword update error
                if (keywordUpdateErr) {
                  return done(keywordUpdateErr);
                }

                // Set assertions
                (keywordUpdateRes.body._id).should.equal(keywordSaveRes.body._id);
                (keywordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Keywords if not signed in', function (done) {
    // Create new Keyword model instance
    var keywordObj = new Keyword(keyword);

    // Save the keyword
    keywordObj.save(function () {
      // Request Keywords
      request(app).get('/api/keywords')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Keyword if not signed in', function (done) {
    // Create new Keyword model instance
    var keywordObj = new Keyword(keyword);

    // Save the Keyword
    keywordObj.save(function () {
      request(app).get('/api/keywords/' + keywordObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', keyword.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Keyword with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/keywords/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Keyword is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Keyword which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Keyword
    request(app).get('/api/keywords/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Keyword with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Keyword if signed in', function (done) {
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

        // Save a new Keyword
        agent.post('/api/keywords')
          .send(keyword)
          .expect(200)
          .end(function (keywordSaveErr, keywordSaveRes) {
            // Handle Keyword save error
            if (keywordSaveErr) {
              return done(keywordSaveErr);
            }

            // Delete an existing Keyword
            agent.delete('/api/keywords/' + keywordSaveRes.body._id)
              .send(keyword)
              .expect(200)
              .end(function (keywordDeleteErr, keywordDeleteRes) {
                // Handle keyword error error
                if (keywordDeleteErr) {
                  return done(keywordDeleteErr);
                }

                // Set assertions
                (keywordDeleteRes.body._id).should.equal(keywordSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Keyword if not signed in', function (done) {
    // Set Keyword user
    keyword.user = user;

    // Create new Keyword model instance
    var keywordObj = new Keyword(keyword);

    // Save the Keyword
    keywordObj.save(function () {
      // Try deleting Keyword
      request(app).delete('/api/keywords/' + keywordObj._id)
        .expect(403)
        .end(function (keywordDeleteErr, keywordDeleteRes) {
          // Set message assertion
          (keywordDeleteRes.body.message).should.match('User is not authorized');

          // Handle Keyword error error
          done(keywordDeleteErr);
        });

    });
  });

  it('should be able to get a single Keyword that has an orphaned user reference', function (done) {
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

          // Save a new Keyword
          agent.post('/api/keywords')
            .send(keyword)
            .expect(200)
            .end(function (keywordSaveErr, keywordSaveRes) {
              // Handle Keyword save error
              if (keywordSaveErr) {
                return done(keywordSaveErr);
              }

              // Set assertions on new Keyword
              (keywordSaveRes.body.name).should.equal(keyword.name);
              should.exist(keywordSaveRes.body.user);
              should.equal(keywordSaveRes.body.user._id, orphanId);

              // force the Keyword to have an orphaned user reference
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

                    // Get the Keyword
                    agent.get('/api/keywords/' + keywordSaveRes.body._id)
                      .expect(200)
                      .end(function (keywordInfoErr, keywordInfoRes) {
                        // Handle Keyword error
                        if (keywordInfoErr) {
                          return done(keywordInfoErr);
                        }

                        // Set assertions
                        (keywordInfoRes.body._id).should.equal(keywordSaveRes.body._id);
                        (keywordInfoRes.body.name).should.equal(keyword.name);
                        should.equal(keywordInfoRes.body.user, undefined);

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
      Keyword.remove().exec(done);
    });
  });
});
