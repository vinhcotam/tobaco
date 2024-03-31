'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Taxonomy = mongoose.model('Taxonomy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Taxonomy
 */
exports.create = function(req, res) {
  var taxonomy = new Taxonomy(req.body);
  taxonomy.user = req.user;
  taxonomy.save()
    .then((taxonomy) => {
      res.jsonp(taxonomy);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};
/**
*
*/
exports.createleaf = function (req, res) {
  var taxonomy = new Taxonomy(req.body);
  taxonomy.user = req.user;
  taxonomy.save()
    .then((taxonomy) => {
      res.jsonp(taxonomy);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
}
/**
 * Show the current Taxonomy
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var taxonomy = req.taxonomy ? req.taxonomy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  taxonomy.isCurrentUserOwner = req.user && taxonomy.user && taxonomy.user._id.toString() === req.user._id.toString();

  res.jsonp(taxonomy);
};

/**
 * treeview
 */
exports.tree = function (req, res) {
  //console.log(req.query.topicId);
  var condition = {};

  //check topic is working for user
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }
  //===========================================================
  if (typeof req.query.topicId != "undefined") {
    condition.topic = req.query.topicId;
  } {
    condition._id = req.params.taxonomyId;
  }
  //if (req.params.taxonomyId != "undefined") {
  //  condition._id = req.params.taxonomyId;
  //}
  console.log(condition);
  Taxonomy.findOne(/*{ _id: req.params.taxonomyId }*/condition)
    .then((taxonomy) => {

      //=====================================================================================>note at here when ugrade to v2
      //taxonomy.getArrayTree({
      //  sort: {
      //    taxonomy_name: 1
      //  }
      //})
      //  .then((tree) => {
      //    res.jsonp(tree[0]);
      //  })
      //  .catch((err) => {
      //    if (err) {
      //      return res.status(400).send({
      //        message: errorHandler.getErrorMessage(err)
      //      });
      //    }
      //  });
      taxonomy.getArrayTree({
        sort: {
          taxonomy_name: 1
        }
      }, function (err, tree) {
        res.jsonp(tree[0]);
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * Treeview by Topic
 */
exports.treebytopic = function (req, res) {
  //console.log(req.query.topicId);
  var condition = {};
  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }
  condition.parentId = null;
  Taxonomy.findOne(condition)
    .then((taxonomy) => {
      if (taxonomy != null) {
        taxonomy.getArrayTree({
          sort: {
            taxonomy_name: 1
          }
        }, function (err, tree) {
          res.jsonp(tree[0]);
        });
      }
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**/
exports.clone = function (req, res) {
  var condition = {};
  //clone from topic
  if (typeof req.query.topicId != "undefined") {
    condition.topic = req.query.topicId;
    condition.parentId = null;
  }
  Taxonomy.findOne(condition)
    .then((taxonomy) => {
      taxonomy.getArrayTree({
        sort: {
          taxonomy_name: 1
        }
      })
        .then((tree) => {
            //add node 0
            var queue = [];
            var visited = [];
            queue.push({ node: tree[0], parentId: null });
            while (queue.length) {
              var current = queue.shift();
              visited.push(current);
              if (typeof current.node.children === 'object' && current.node.children.length > 0) {
                current.node.children.forEach(function (element) {
                  queue.push({ node: element, parentId: current.node });
                });
              }
            }

            visited.forEach(async function (element) {
              if (element.parentId != null) {
                var parentEntity = await Taxonomy.findOne({
                  taxonomy_name: element.parentId.taxonomy_name,
                  taxonomy_description: element.parentId.taxonomy_description,
                  topic: req.query.totopicId
                }).exec();

                if (parentEntity) {
                  var taxo = new Taxonomy();
                  taxo.taxonomy_name = element.node.taxonomy_name;
                  taxo.taxonomy_description = element.node.taxonomy_description;
                  taxo.user = req.user;
                  taxo.topic = req.query.totopicId;
                  taxo.parentId = parentEntity._id;
                  await taxo.save(function (err) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                    }
                  });
                }
              } else {
                var taxo = new Taxonomy();
                taxo.taxonomy_name = element.node.taxonomy_name;
                taxo.taxonomy_description = element.node.taxonomy_description;
                taxo.user = req.user;
                taxo.topic = req.query.totopicId;
                await taxo.save(function (err) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                  }
                });
              }
            });
            res.jsonp(visited);
        })
        .catch((err) => {

        });
        
    })
    .catch((err) => {

    });
}
/**
 * Update a Taxonomy
 */
exports.update = function(req, res) {
  var taxonomy = req.taxonomy;

  taxonomy = _.extend(taxonomy, req.body);

  taxonomy.save()
    .then((taxonomy) => {
      res.jsonp(taxonomy);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * Delete an Taxonomy
 */
exports.delete = function(req, res) {
  var taxonomy = req.taxonomy;

  taxonomy.deleteOne()
    .then((taxonomy) => {
      res.jsonp(taxonomy);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * List of Taxonomies
 */
exports.list = function (req, res) {

  var condition = {};

  //check topic is working for user
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {
      //condition.topic = { '$in': topic_id };
    } else {
      condition.topic = { '$in': topic_id };
    }
  }
  //var condition = { parentId: null };
  if (req.query.typefetch != undefined) {
    if (req.query.typefetch == "checking") {
      condition.taxonomy_name = req.query.taxonomy_name;
    }
  } else {
    condition.parentId = null;
  }

  if (typeof req.query.topic != "undefined") {
    condition.topic = req.query.topic;
  }

  Taxonomy.find(condition/*{ parentId: null }*/).sort('-created')
    .populate('topic', '_id, topic_name')
    .populate('user', 'displayName')
    .then((taxonomies) => {
      res.jsonp(taxonomies);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * Taxonomy middleware
 */
exports.taxonomyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Taxonomy is invalid'
    });
  }

  Taxonomy.findById(id).populate('user', 'displayName')
    .then((taxonomy) => {
      if (!taxonomy) {
        return res.status(404).send({
          message: 'No Taxonomy with that identifier has been found'
        });
      }
      req.taxonomy = taxonomy;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });

};
