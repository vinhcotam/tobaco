'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Labelingbytaxonomy = mongoose.model('Labelingbytaxonomy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  labelingbytaxonomy;

/**
 * Labelingbytaxonomy routes tests
 */
describe('Labelingbytaxonomy CRUD tests', function () {

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

    // Save a user to the test db and create new Labelingbytaxonomy
    user.save(function () {
      labelingbytaxonomy = {
        name: 'Labelingbytaxonomy name'
      };

      done();
    });
  });

  it('should be able to save a Labelingbytaxonomy if logged in', function (done) {
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

        // Save a new Labelingbytaxonomy
        agent.post('/api/labelingbytaxonomies')
          .send(labelingbytaxonomy)
          .expect(200)
          .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
            // Handle Labelingbytaxonomy save error
            if (labelingbytaxonomySaveErr) {
              return done(labelingbytaxonomySaveErr);
            }

            // Get a list of Labelingbytaxonomies
            agent.get('/api/labelingbytaxonomies')
              .end(function (labelingbytaxonomiesGetErr, labelingbytaxonomiesGetRes) {
                // Handle Labelingbytaxonomies save error
                if (labelingbytaxonomiesGetErr) {
                  return done(labelingbytaxonomiesGetErr);
                }

                // Get Labelingbytaxonomies list
                var labelingbytaxonomies = labelingbytaxonomiesGetRes.body;

                // Set assertions
                (labelingbytaxonomies[0].user._id).should.equal(userId);
                (labelingbytaxonomies[0].name).should.match('Labelingbytaxonomy name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Labelingbytaxonomy if not logged in', function (done) {
    agent.post('/api/labelingbytaxonomies')
      .send(labelingbytaxonomy)
      .expect(403)
      .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
        // Call the assertion callback
        done(labelingbytaxonomySaveErr);
      });
  });

  it('should not be able to save an Labelingbytaxonomy if no name is provided', function (done) {
    // Invalidate name field
    labelingbytaxonomy.name = '';

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

        // Save a new Labelingbytaxonomy
        agent.post('/api/labelingbytaxonomies')
          .send(labelingbytaxonomy)
          .expect(400)
          .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
            // Set message assertion
            (labelingbytaxonomySaveRes.body.message).should.match('Please fill Labelingbytaxonomy name');

            // Handle Labelingbytaxonomy save error
            done(labelingbytaxonomySaveErr);
          });
      });
  });

  it('should be able to update an Labelingbytaxonomy if signed in', function (done) {
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

        // Save a new Labelingbytaxonomy
        agent.post('/api/labelingbytaxonomies')
          .send(labelingbytaxonomy)
          .expect(200)
          .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
            // Handle Labelingbytaxonomy save error
            if (labelingbytaxonomySaveErr) {
              return done(labelingbytaxonomySaveErr);
            }

            // Update Labelingbytaxonomy name
            labelingbytaxonomy.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Labelingbytaxonomy
            agent.put('/api/labelingbytaxonomies/' + labelingbytaxonomySaveRes.body._id)
              .send(labelingbytaxonomy)
              .expect(200)
              .end(function (labelingbytaxonomyUpdateErr, labelingbytaxonomyUpdateRes) {
                // Handle Labelingbytaxonomy update error
                if (labelingbytaxonomyUpdateErr) {
                  return done(labelingbytaxonomyUpdateErr);
                }

                // Set assertions
                (labelingbytaxonomyUpdateRes.body._id).should.equal(labelingbytaxonomySaveRes.body._id);
                (labelingbytaxonomyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Labelingbytaxonomies if not signed in', function (done) {
    // Create new Labelingbytaxonomy model instance
    var labelingbytaxonomyObj = new Labelingbytaxonomy(labelingbytaxonomy);

    // Save the labelingbytaxonomy
    labelingbytaxonomyObj.save(function () {
      // Request Labelingbytaxonomies
      request(app).get('/api/labelingbytaxonomies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Labelingbytaxonomy if not signed in', function (done) {
    // Create new Labelingbytaxonomy model instance
    var labelingbytaxonomyObj = new Labelingbytaxonomy(labelingbytaxonomy);

    // Save the Labelingbytaxonomy
    labelingbytaxonomyObj.save(function () {
      request(app).get('/api/labelingbytaxonomies/' + labelingbytaxonomyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', labelingbytaxonomy.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Labelingbytaxonomy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/labelingbytaxonomies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Labelingbytaxonomy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Labelingbytaxonomy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Labelingbytaxonomy
    request(app).get('/api/labelingbytaxonomies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Labelingbytaxonomy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Labelingbytaxonomy if signed in', function (done) {
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

        // Save a new Labelingbytaxonomy
        agent.post('/api/labelingbytaxonomies')
          .send(labelingbytaxonomy)
          .expect(200)
          .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
            // Handle Labelingbytaxonomy save error
            if (labelingbytaxonomySaveErr) {
              return done(labelingbytaxonomySaveErr);
            }

            // Delete an existing Labelingbytaxonomy
            agent.delete('/api/labelingbytaxonomies/' + labelingbytaxonomySaveRes.body._id)
              .send(labelingbytaxonomy)
              .expect(200)
              .end(function (labelingbytaxonomyDeleteErr, labelingbytaxonomyDeleteRes) {
                // Handle labelingbytaxonomy error error
                if (labelingbytaxonomyDeleteErr) {
                  return done(labelingbytaxonomyDeleteErr);
                }

                // Set assertions
                (labelingbytaxonomyDeleteRes.body._id).should.equal(labelingbytaxonomySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Labelingbytaxonomy if not signed in', function (done) {
    // Set Labelingbytaxonomy user
    labelingbytaxonomy.user = user;

    // Create new Labelingbytaxonomy model instance
    var labelingbytaxonomyObj = new Labelingbytaxonomy(labelingbytaxonomy);

    // Save the Labelingbytaxonomy
    labelingbytaxonomyObj.save(function () {
      // Try deleting Labelingbytaxonomy
      request(app).delete('/api/labelingbytaxonomies/' + labelingbytaxonomyObj._id)
        .expect(403)
        .end(function (labelingbytaxonomyDeleteErr, labelingbytaxonomyDeleteRes) {
          // Set message assertion
          (labelingbytaxonomyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Labelingbytaxonomy error error
          done(labelingbytaxonomyDeleteErr);
        });

    });
  });

  it('should be able to get a single Labelingbytaxonomy that has an orphaned user reference', function (done) {
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

          // Save a new Labelingbytaxonomy
          agent.post('/api/labelingbytaxonomies')
            .send(labelingbytaxonomy)
            .expect(200)
            .end(function (labelingbytaxonomySaveErr, labelingbytaxonomySaveRes) {
              // Handle Labelingbytaxonomy save error
              if (labelingbytaxonomySaveErr) {
                return done(labelingbytaxonomySaveErr);
              }

              // Set assertions on new Labelingbytaxonomy
              (labelingbytaxonomySaveRes.body.name).should.equal(labelingbytaxonomy.name);
              should.exist(labelingbytaxonomySaveRes.body.user);
              should.equal(labelingbytaxonomySaveRes.body.user._id, orphanId);

              // force the Labelingbytaxonomy to have an orphaned user reference
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

                    // Get the Labelingbytaxonomy
                    agent.get('/api/labelingbytaxonomies/' + labelingbytaxonomySaveRes.body._id)
                      .expect(200)
                      .end(function (labelingbytaxonomyInfoErr, labelingbytaxonomyInfoRes) {
                        // Handle Labelingbytaxonomy error
                        if (labelingbytaxonomyInfoErr) {
                          return done(labelingbytaxonomyInfoErr);
                        }

                        // Set assertions
                        (labelingbytaxonomyInfoRes.body._id).should.equal(labelingbytaxonomySaveRes.body._id);
                        (labelingbytaxonomyInfoRes.body.name).should.equal(labelingbytaxonomy.name);
                        should.equal(labelingbytaxonomyInfoRes.body.user, undefined);

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
      Labelingbytaxonomy.remove().exec(done);
    });
  });
});
