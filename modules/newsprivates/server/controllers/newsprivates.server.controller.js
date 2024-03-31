'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Newsprivate = mongoose.model('Newsprivate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
const multer = require('multer');
var fs = require('fs');
/**
 * Create a Newsprivate
 */
exports.create = function (req, res) {
  // SET STORAGE
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './data/uploads/');
    },
    filename: function (req, file, callback) {
      var exploded_name = file.originalname.split(".");
      callback(null, file.fieldname + '-news-' + Date.now() + "." + exploded_name[exploded_name.length - 1]);
    }
  });

  var upload = multer({ storage: storage }).single('fileupload');

  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      // save newsprivate
      var newsprivate = new Newsprivate();
      newsprivate.user = req.user;
      newsprivate.topic = req.body.topic;
      newsprivate.targeted_issue = req.body.targeted_issue;
      newsprivate.taxonomy = req.body.taxonomy;
      newsprivate.keyinformant = req.body.keyinformant;
      newsprivate.filename = req.file.filename;
      newsprivate.filepath = req.file.path;
      newsprivate.description = req.body.description;
      newsprivate.confidentiality = req.body.confidentiality;

      newsprivate.save()
        .then((newsprivate) => {
          res.jsonp(newsprivate);
        })
        .catch((err) => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });
    }
    // res.end("File is uploaded");
  });
};

/**
 * Show the current Newsprivate
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var newsprivate = req.newsprivate ? req.newsprivate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  newsprivate.isCurrentUserOwner = req.user && newsprivate.user && newsprivate.user._id.toString() === req.user._id.toString();

  res.jsonp(newsprivate);
};

exports.getFile = function (req, res) {
  var newsprivate = req.newsprivate ? req.newsprivate.toJSON() : {};
  // fs.readFile(__dirname + filePath, function (err, data) {
  fs.readFile(newsprivate.filepath, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
};
/**
 * Update a Newsprivate
 */
exports.update = function (req, res) {
  var newsprivate = req.newsprivate;

  if (req.filename !== undefined) {
    fs.exists(newsprivate._doc.filepath, function (exists) {
      if (exists) {
        fs.unlink(newsprivate._doc.filepath, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    })
  };
  // SET STORAGE
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './data/uploads/');
    },
    filename: function (req, file, callback) {
      var exploded_name = file.originalname.split(".");
      callback(null, file.fieldname + '-news-' + Date.now() + "." + exploded_name[exploded_name.length - 1]);
    }
  });

  var upload = multer({ storage: storage }).single('fileupload');

  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      newsprivate = _.extend(newsprivate, req.body);
      if (req.file !== undefined) {
        newsprivate.filename = req.file.filename;
        newsprivate.filepath = req.file.path;
      }
      newsprivate.save()
        .then((newsprivate) => {
          res.jsonp(newsprivate);
        })
        .catch((err) => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });
    }
  })
};

/**
 * Delete an Newsprivate
 */
exports.delete = function (req, res) {
  var newsprivate = req.newsprivate;

  newsprivate.deleteOne()
    .then((newsprivate) => {
      res.jsonp(newsprivate);
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
 * Get number record
 *
 */
exports.count = function (req, res) {
  var roles = req.user.roles;
  var isRole = -1;
  roles.forEach(function (element, index) {
    if (element === 'admin') {
      isRole = 0;
    } else if (element === 'manager' && isRole === -1) {
      isRole = 1;
    } else if (element === 'user' && isRole === -1) {
      isRole = 2;
    }
  });

  var condition = {};
  if (isRole === 2) {
    // condition.user = req.user._id;
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status === 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "topic": { "$in": topicIds } };
  }

  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "targeted_issue": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "description": { $regex: new RegExp(req.query.search) } });
  }

  var newsp = Newsprivate.count(condition);
  if (orcondition.length > 0) {
    newsp = newsp.or(orcondition);
  }
  newsp.then((number) => {
    res.jsonp([number]);
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
 * List of Newsprivates
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var count = false;
  var condition = {};
  var roles = req.user.roles;
  var isRole = -1;
  roles.forEach(function (element, index) {
    if (element === 'admin') {
      isRole = 0;
    } else if (element === 'manager' && isRole === -1) {
      isRole = 1;
    } else if (element === 'user' && isRole === -1) {
      isRole = 2;
    }
  });
  if (isRole == 2) {
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "topic": { "$in": topicIds } };
  }

  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }

  if (req.query.count !== undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "targeted_issue": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "description": { $regex: new RegExp(req.query.search) } });
  }

  var newsp = Newsprivate.find(condition)// .sort('-created')
    .populate('user', 'displayName')
    .populate('topic', 'topic_name')
    .populate('taxonomy', 'taxonomy_name');
  if (orcondition.length > 0) {
    newsp = newsp.or(orcondition);
  }
  newsp.skip(10 * (currentPage - 1)).limit(10)
    .then((newsprivates) => {
      res.jsonp(newsprivates);
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
 * Newsprivate middleware
 */
exports.newsprivateByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Newsprivate is invalid'
    });
  }

  Newsprivate.findById(id).populate('user', 'displayName')
    .then((newsprivate) => {
      if (!newsprivate) {
        return res.status(404).send({
          message: 'No Newsprivate with that identifier has been found'
        });
      }
      req.newsprivate = newsprivate;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });

};