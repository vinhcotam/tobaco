'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Newsgroup = mongoose.model('Newsgroup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  newsgroup;

/**
 * Newsgroup routes tests
 */
describe('Newsgroup CRUD tests', function () {

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

    // Save a user to the test db and create new Newsgroup
    user.save(function () {
      newsgroup = {
        name: 'Newsgroup name'
      };

      done();
    });
  });

  it('should be able to save a Newsgroup if logged in', function (done) {
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

        // Save a new Newsgroup
        agent.post('/api/newsgroups')
          .send(newsgroup)
          .expect(200)
          .end(function (newsgroupSaveErr, newsgroupSaveRes) {
            // Handle Newsgroup save error
            if (newsgroupSaveErr) {
              return done(newsgroupSaveErr);
            }

            // Get a list of Newsgroups
            agent.get('/api/newsgroups')
              .end(function (newsgroupsGetErr, newsgroupsGetRes) {
                // Handle Newsgroups save error
                if (newsgroupsGetErr) {
                  return done(newsgroupsGetErr);
                }

                // Get Newsgroups list
                var newsgroups = newsgroupsGetRes.body;

                // Set assertions
                (newsgroups[0].user._id).should.equal(userId);
                (newsgroups[0].name).should.match('Newsgroup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Newsgroup if not logged in', function (done) {
    agent.post('/api/newsgroups')
      .send(newsgroup)
      .expect(403)
      .end(function (newsgroupSaveErr, newsgroupSaveRes) {
        // Call the assertion callback
        done(newsgroupSaveErr);
      });
  });

  it('should not be able to save an Newsgroup if no name is provided', function (done) {
    // Invalidate name field
    newsgroup.name = '';

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

        // Save a new Newsgroup
        agent.post('/api/newsgroups')
          .send(newsgroup)
          .expect(400)
          .end(function (newsgroupSaveErr, newsgroupSaveRes) {
            // Set message assertion
            (newsgroupSaveRes.body.message).should.match('Please fill Newsgroup name');

            // Handle Newsgroup save error
            done(newsgroupSaveErr);
          });
      });
  });

  it('should be able to update an Newsgroup if signed in', function (done) {
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

        // Save a new Newsgroup
        agent.post('/api/newsgroups')
          .send(newsgroup)
          .expect(200)
          .end(function (newsgroupSaveErr, newsgroupSaveRes) {
            // Handle Newsgroup save error
            if (newsgroupSaveErr) {
              return done(newsgroupSaveErr);
            }

            // Update Newsgroup name
            newsgroup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Newsgroup
            agent.put('/api/newsgroups/' + newsgroupSaveRes.body._id)
              .send(newsgroup)
              .expect(200)
              .end(function (newsgroupUpdateErr, newsgroupUpdateRes) {
                // Handle Newsgroup update error
                if (newsgroupUpdateErr) {
                  return done(newsgroupUpdateErr);
                }

                // Set assertions
                (newsgroupUpdateRes.body._id).should.equal(newsgroupSaveRes.body._id);
                (newsgroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Newsgroups if not signed in', function (done) {
    // Create new Newsgroup model instance
    var newsgroupObj = new Newsgroup(newsgroup);

    // Save the newsgroup
    newsgroupObj.save(function () {
      // Request Newsgroups
      request(app).get('/api/newsgroups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Newsgroup if not signed in', function (done) {
    // Create new Newsgroup model instance
    var newsgroupObj = new Newsgroup(newsgroup);

    // Save the Newsgroup
    newsgroupObj.save(function () {
      request(app).get('/api/newsgroups/' + newsgroupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', newsgroup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Newsgroup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/newsgroups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Newsgroup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Newsgroup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Newsgroup
    request(app).get('/api/newsgroups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Newsgroup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Newsgroup if signed in', function (done) {
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

        // Save a new Newsgroup
        agent.post('/api/newsgroups')
          .send(newsgroup)
          .expect(200)
          .end(function (newsgroupSaveErr, newsgroupSaveRes) {
            // Handle Newsgroup save error
            if (newsgroupSaveErr) {
              return done(newsgroupSaveErr);
            }

            // Delete an existing Newsgroup
            agent.delete('/api/newsgroups/' + newsgroupSaveRes.body._id)
              .send(newsgroup)
              .expect(200)
              .end(function (newsgroupDeleteErr, newsgroupDeleteRes) {
                // Handle newsgroup error error
                if (newsgroupDeleteErr) {
                  return done(newsgroupDeleteErr);
                }

                // Set assertions
                (newsgroupDeleteRes.body._id).should.equal(newsgroupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Newsgroup if not signed in', function (done) {
    // Set Newsgroup user
    newsgroup.user = user;

    // Create new Newsgroup model instance
    var newsgroupObj = new Newsgroup(newsgroup);

    // Save the Newsgroup
    newsgroupObj.save(function () {
      // Try deleting Newsgroup
      request(app).delete('/api/newsgroups/' + newsgroupObj._id)
        .expect(403)
        .end(function (newsgroupDeleteErr, newsgroupDeleteRes) {
          // Set message assertion
          (newsgroupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Newsgroup error error
          done(newsgroupDeleteErr);
        });

    });
  });

  it('should be able to get a single Newsgroup that has an orphaned user reference', function (done) {
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

          // Save a new Newsgroup
          agent.post('/api/newsgroups')
            .send(newsgroup)
            .expect(200)
            .end(function (newsgroupSaveErr, newsgroupSaveRes) {
              // Handle Newsgroup save error
              if (newsgroupSaveErr) {
                return done(newsgroupSaveErr);
              }

              // Set assertions on new Newsgroup
              (newsgroupSaveRes.body.name).should.equal(newsgroup.name);
              should.exist(newsgroupSaveRes.body.user);
              should.equal(newsgroupSaveRes.body.user._id, orphanId);

              // force the Newsgroup to have an orphaned user reference
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

                    // Get the Newsgroup
                    agent.get('/api/newsgroups/' + newsgroupSaveRes.body._id)
                      .expect(200)
                      .end(function (newsgroupInfoErr, newsgroupInfoRes) {
                        // Handle Newsgroup error
                        if (newsgroupInfoErr) {
                          return done(newsgroupInfoErr);
                        }

                        // Set assertions
                        (newsgroupInfoRes.body._id).should.equal(newsgroupSaveRes.body._id);
                        (newsgroupInfoRes.body.name).should.equal(newsgroup.name);
                        should.equal(newsgroupInfoRes.body.user, undefined);

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
      Newsgroup.remove().exec(done);
    });
  });
});
