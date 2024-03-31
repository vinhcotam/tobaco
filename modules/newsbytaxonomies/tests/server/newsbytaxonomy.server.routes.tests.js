'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Newsbytaxonomy = mongoose.model('Newsbytaxonomy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  newsbytaxonomy;

/**
 * Newsbytaxonomy routes tests
 */
describe('Newsbytaxonomy CRUD tests', function () {

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

    // Save a user to the test db and create new Newsbytaxonomy
    user.save(function () {
      newsbytaxonomy = {
        name: 'Newsbytaxonomy name'
      };

      done();
    });
  });

  it('should be able to save a Newsbytaxonomy if logged in', function (done) {
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

        // Save a new Newsbytaxonomy
        agent.post('/api/newsbytaxonomies')
          .send(newsbytaxonomy)
          .expect(200)
          .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
            // Handle Newsbytaxonomy save error
            if (newsbytaxonomySaveErr) {
              return done(newsbytaxonomySaveErr);
            }

            // Get a list of Newsbytaxonomies
            agent.get('/api/newsbytaxonomies')
              .end(function (newsbytaxonomiesGetErr, newsbytaxonomiesGetRes) {
                // Handle Newsbytaxonomies save error
                if (newsbytaxonomiesGetErr) {
                  return done(newsbytaxonomiesGetErr);
                }

                // Get Newsbytaxonomies list
                var newsbytaxonomies = newsbytaxonomiesGetRes.body;

                // Set assertions
                (newsbytaxonomies[0].user._id).should.equal(userId);
                (newsbytaxonomies[0].name).should.match('Newsbytaxonomy name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Newsbytaxonomy if not logged in', function (done) {
    agent.post('/api/newsbytaxonomies')
      .send(newsbytaxonomy)
      .expect(403)
      .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
        // Call the assertion callback
        done(newsbytaxonomySaveErr);
      });
  });

  it('should not be able to save an Newsbytaxonomy if no name is provided', function (done) {
    // Invalidate name field
    newsbytaxonomy.name = '';

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

        // Save a new Newsbytaxonomy
        agent.post('/api/newsbytaxonomies')
          .send(newsbytaxonomy)
          .expect(400)
          .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
            // Set message assertion
            (newsbytaxonomySaveRes.body.message).should.match('Please fill Newsbytaxonomy name');

            // Handle Newsbytaxonomy save error
            done(newsbytaxonomySaveErr);
          });
      });
  });

  it('should be able to update an Newsbytaxonomy if signed in', function (done) {
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

        // Save a new Newsbytaxonomy
        agent.post('/api/newsbytaxonomies')
          .send(newsbytaxonomy)
          .expect(200)
          .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
            // Handle Newsbytaxonomy save error
            if (newsbytaxonomySaveErr) {
              return done(newsbytaxonomySaveErr);
            }

            // Update Newsbytaxonomy name
            newsbytaxonomy.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Newsbytaxonomy
            agent.put('/api/newsbytaxonomies/' + newsbytaxonomySaveRes.body._id)
              .send(newsbytaxonomy)
              .expect(200)
              .end(function (newsbytaxonomyUpdateErr, newsbytaxonomyUpdateRes) {
                // Handle Newsbytaxonomy update error
                if (newsbytaxonomyUpdateErr) {
                  return done(newsbytaxonomyUpdateErr);
                }

                // Set assertions
                (newsbytaxonomyUpdateRes.body._id).should.equal(newsbytaxonomySaveRes.body._id);
                (newsbytaxonomyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Newsbytaxonomies if not signed in', function (done) {
    // Create new Newsbytaxonomy model instance
    var newsbytaxonomyObj = new Newsbytaxonomy(newsbytaxonomy);

    // Save the newsbytaxonomy
    newsbytaxonomyObj.save(function () {
      // Request Newsbytaxonomies
      request(app).get('/api/newsbytaxonomies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Newsbytaxonomy if not signed in', function (done) {
    // Create new Newsbytaxonomy model instance
    var newsbytaxonomyObj = new Newsbytaxonomy(newsbytaxonomy);

    // Save the Newsbytaxonomy
    newsbytaxonomyObj.save(function () {
      request(app).get('/api/newsbytaxonomies/' + newsbytaxonomyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', newsbytaxonomy.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Newsbytaxonomy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/newsbytaxonomies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Newsbytaxonomy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Newsbytaxonomy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Newsbytaxonomy
    request(app).get('/api/newsbytaxonomies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Newsbytaxonomy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Newsbytaxonomy if signed in', function (done) {
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

        // Save a new Newsbytaxonomy
        agent.post('/api/newsbytaxonomies')
          .send(newsbytaxonomy)
          .expect(200)
          .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
            // Handle Newsbytaxonomy save error
            if (newsbytaxonomySaveErr) {
              return done(newsbytaxonomySaveErr);
            }

            // Delete an existing Newsbytaxonomy
            agent.delete('/api/newsbytaxonomies/' + newsbytaxonomySaveRes.body._id)
              .send(newsbytaxonomy)
              .expect(200)
              .end(function (newsbytaxonomyDeleteErr, newsbytaxonomyDeleteRes) {
                // Handle newsbytaxonomy error error
                if (newsbytaxonomyDeleteErr) {
                  return done(newsbytaxonomyDeleteErr);
                }

                // Set assertions
                (newsbytaxonomyDeleteRes.body._id).should.equal(newsbytaxonomySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Newsbytaxonomy if not signed in', function (done) {
    // Set Newsbytaxonomy user
    newsbytaxonomy.user = user;

    // Create new Newsbytaxonomy model instance
    var newsbytaxonomyObj = new Newsbytaxonomy(newsbytaxonomy);

    // Save the Newsbytaxonomy
    newsbytaxonomyObj.save(function () {
      // Try deleting Newsbytaxonomy
      request(app).delete('/api/newsbytaxonomies/' + newsbytaxonomyObj._id)
        .expect(403)
        .end(function (newsbytaxonomyDeleteErr, newsbytaxonomyDeleteRes) {
          // Set message assertion
          (newsbytaxonomyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Newsbytaxonomy error error
          done(newsbytaxonomyDeleteErr);
        });

    });
  });

  it('should be able to get a single Newsbytaxonomy that has an orphaned user reference', function (done) {
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

          // Save a new Newsbytaxonomy
          agent.post('/api/newsbytaxonomies')
            .send(newsbytaxonomy)
            .expect(200)
            .end(function (newsbytaxonomySaveErr, newsbytaxonomySaveRes) {
              // Handle Newsbytaxonomy save error
              if (newsbytaxonomySaveErr) {
                return done(newsbytaxonomySaveErr);
              }

              // Set assertions on new Newsbytaxonomy
              (newsbytaxonomySaveRes.body.name).should.equal(newsbytaxonomy.name);
              should.exist(newsbytaxonomySaveRes.body.user);
              should.equal(newsbytaxonomySaveRes.body.user._id, orphanId);

              // force the Newsbytaxonomy to have an orphaned user reference
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

                    // Get the Newsbytaxonomy
                    agent.get('/api/newsbytaxonomies/' + newsbytaxonomySaveRes.body._id)
                      .expect(200)
                      .end(function (newsbytaxonomyInfoErr, newsbytaxonomyInfoRes) {
                        // Handle Newsbytaxonomy error
                        if (newsbytaxonomyInfoErr) {
                          return done(newsbytaxonomyInfoErr);
                        }

                        // Set assertions
                        (newsbytaxonomyInfoRes.body._id).should.equal(newsbytaxonomySaveRes.body._id);
                        (newsbytaxonomyInfoRes.body.name).should.equal(newsbytaxonomy.name);
                        should.equal(newsbytaxonomyInfoRes.body.user, undefined);

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
      Newsbytaxonomy.remove().exec(done);
    });
  });
});
