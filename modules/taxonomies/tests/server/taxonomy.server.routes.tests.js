'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Taxonomy = mongoose.model('Taxonomy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  taxonomy;

/**
 * Taxonomy routes tests
 */
describe('Taxonomy CRUD tests', function () {

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

    // Save a user to the test db and create new Taxonomy
    user.save(function () {
      taxonomy = {
        name: 'Taxonomy name'
      };

      done();
    });
  });

  it('should be able to save a Taxonomy if logged in', function (done) {
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

        // Save a new Taxonomy
        agent.post('/api/taxonomies')
          .send(taxonomy)
          .expect(200)
          .end(function (taxonomySaveErr, taxonomySaveRes) {
            // Handle Taxonomy save error
            if (taxonomySaveErr) {
              return done(taxonomySaveErr);
            }

            // Get a list of Taxonomies
            agent.get('/api/taxonomies')
              .end(function (taxonomiesGetErr, taxonomiesGetRes) {
                // Handle Taxonomies save error
                if (taxonomiesGetErr) {
                  return done(taxonomiesGetErr);
                }

                // Get Taxonomies list
                var taxonomies = taxonomiesGetRes.body;

                // Set assertions
                (taxonomies[0].user._id).should.equal(userId);
                (taxonomies[0].name).should.match('Taxonomy name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Taxonomy if not logged in', function (done) {
    agent.post('/api/taxonomies')
      .send(taxonomy)
      .expect(403)
      .end(function (taxonomySaveErr, taxonomySaveRes) {
        // Call the assertion callback
        done(taxonomySaveErr);
      });
  });

  it('should not be able to save an Taxonomy if no name is provided', function (done) {
    // Invalidate name field
    taxonomy.name = '';

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

        // Save a new Taxonomy
        agent.post('/api/taxonomies')
          .send(taxonomy)
          .expect(400)
          .end(function (taxonomySaveErr, taxonomySaveRes) {
            // Set message assertion
            (taxonomySaveRes.body.message).should.match('Please fill Taxonomy name');

            // Handle Taxonomy save error
            done(taxonomySaveErr);
          });
      });
  });

  it('should be able to update an Taxonomy if signed in', function (done) {
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

        // Save a new Taxonomy
        agent.post('/api/taxonomies')
          .send(taxonomy)
          .expect(200)
          .end(function (taxonomySaveErr, taxonomySaveRes) {
            // Handle Taxonomy save error
            if (taxonomySaveErr) {
              return done(taxonomySaveErr);
            }

            // Update Taxonomy name
            taxonomy.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Taxonomy
            agent.put('/api/taxonomies/' + taxonomySaveRes.body._id)
              .send(taxonomy)
              .expect(200)
              .end(function (taxonomyUpdateErr, taxonomyUpdateRes) {
                // Handle Taxonomy update error
                if (taxonomyUpdateErr) {
                  return done(taxonomyUpdateErr);
                }

                // Set assertions
                (taxonomyUpdateRes.body._id).should.equal(taxonomySaveRes.body._id);
                (taxonomyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Taxonomies if not signed in', function (done) {
    // Create new Taxonomy model instance
    var taxonomyObj = new Taxonomy(taxonomy);

    // Save the taxonomy
    taxonomyObj.save(function () {
      // Request Taxonomies
      request(app).get('/api/taxonomies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Taxonomy if not signed in', function (done) {
    // Create new Taxonomy model instance
    var taxonomyObj = new Taxonomy(taxonomy);

    // Save the Taxonomy
    taxonomyObj.save(function () {
      request(app).get('/api/taxonomies/' + taxonomyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', taxonomy.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Taxonomy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/taxonomies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Taxonomy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Taxonomy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Taxonomy
    request(app).get('/api/taxonomies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Taxonomy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Taxonomy if signed in', function (done) {
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

        // Save a new Taxonomy
        agent.post('/api/taxonomies')
          .send(taxonomy)
          .expect(200)
          .end(function (taxonomySaveErr, taxonomySaveRes) {
            // Handle Taxonomy save error
            if (taxonomySaveErr) {
              return done(taxonomySaveErr);
            }

            // Delete an existing Taxonomy
            agent.delete('/api/taxonomies/' + taxonomySaveRes.body._id)
              .send(taxonomy)
              .expect(200)
              .end(function (taxonomyDeleteErr, taxonomyDeleteRes) {
                // Handle taxonomy error error
                if (taxonomyDeleteErr) {
                  return done(taxonomyDeleteErr);
                }

                // Set assertions
                (taxonomyDeleteRes.body._id).should.equal(taxonomySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Taxonomy if not signed in', function (done) {
    // Set Taxonomy user
    taxonomy.user = user;

    // Create new Taxonomy model instance
    var taxonomyObj = new Taxonomy(taxonomy);

    // Save the Taxonomy
    taxonomyObj.save(function () {
      // Try deleting Taxonomy
      request(app).delete('/api/taxonomies/' + taxonomyObj._id)
        .expect(403)
        .end(function (taxonomyDeleteErr, taxonomyDeleteRes) {
          // Set message assertion
          (taxonomyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Taxonomy error error
          done(taxonomyDeleteErr);
        });

    });
  });

  it('should be able to get a single Taxonomy that has an orphaned user reference', function (done) {
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

          // Save a new Taxonomy
          agent.post('/api/taxonomies')
            .send(taxonomy)
            .expect(200)
            .end(function (taxonomySaveErr, taxonomySaveRes) {
              // Handle Taxonomy save error
              if (taxonomySaveErr) {
                return done(taxonomySaveErr);
              }

              // Set assertions on new Taxonomy
              (taxonomySaveRes.body.name).should.equal(taxonomy.name);
              should.exist(taxonomySaveRes.body.user);
              should.equal(taxonomySaveRes.body.user._id, orphanId);

              // force the Taxonomy to have an orphaned user reference
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

                    // Get the Taxonomy
                    agent.get('/api/taxonomies/' + taxonomySaveRes.body._id)
                      .expect(200)
                      .end(function (taxonomyInfoErr, taxonomyInfoRes) {
                        // Handle Taxonomy error
                        if (taxonomyInfoErr) {
                          return done(taxonomyInfoErr);
                        }

                        // Set assertions
                        (taxonomyInfoRes.body._id).should.equal(taxonomySaveRes.body._id);
                        (taxonomyInfoRes.body.name).should.equal(taxonomy.name);
                        should.equal(taxonomyInfoRes.body.user, undefined);

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
      Taxonomy.remove().exec(done);
    });
  });
});
