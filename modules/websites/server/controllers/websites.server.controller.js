'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Website = mongoose.model('Website'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

const excel = require('node-excel-export');

/**
 * Create a Website
 */
exports.create = function (req, res) {
  var website = new Website(req.body);
  website.user = req.user;

  website.save()
    .then((website) => {
      res.json(website);
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
 * Show the current Website
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var website = req.website ? req.website.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  website.isCurrentUserOwner = req.user && website.user && website.user._id.toString() === req.user._id.toString();

  res.json(website);
};

/**
 * Update a Website
 */
exports.update = function (req, res) {
  var website = req.website;

  website = _.extend(website, req.body);

  website.save()
    .then((website) => {
      res.json(website);
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
 * Delete an Website
 */
exports.delete = function (req, res) {
  var website = req.website;

  website.deleteOne()
    .then(() => {
      res.json(website);
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
  // check role and working area
  var condition = {};
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status === 1) {
      topic_id.push(element.topic._id);
    }
  });

  // check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');
    if (!isAdmin) {
      condition = {
        "website.topic": { '$in': topic_id }
      };
    }
    // if (isAdmin) {

    // } else {
    //   //condition.topic = { '$in': topic_id };
    //   condition = {
    //     "website.topic": { '$in': topic_id }
    //   };
    // }
  }

  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "website_name": { $regex: new RegExp(req.query.search) } });
  }
  if (orcondition.length > 0) {
    condition.$or(orcondition);
  }
  var web = Website.count();
  if (orcondition.length > 0) {
    web.or(orcondition);
  }
  /* var web = Website.aggregate()
    .lookup({
      from: 'newsdailies',
      localField: '_id',
      foreignField: 'website',
      as: 'website'
    })
    // .unwind('website')
    .match(condition)
    .project("_id source_url source_address website_name collected created website.topic")
    .count("total");*/
  web.then((number) => {
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
 * List of Websites
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var orcondition = [];
  var condition = {};
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status === 1) {
      topic_id.push(element.topic._id);
    }
  });
  // check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (!isAdmin) {
      condition = {
        "website.topic": { '$in': topic_id }
      };
    }
    // else {
    //   //condition.topic = { '$in': topic_id };
    //   condition = {
    //     "website.topic": { '$in': topic_id }
    //   };
    // }
  }
  if (req.query.search !== undefined) {
    orcondition.push({ "website_name": { $regex: new RegExp(req.query.search) } });
  }

  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }
  if (orcondition.length > 0) {
    condition.$or(orcondition);
  }
  var web = Website.find();
  // .sort('-created')
  if (orcondition.length > 0) {
    web = web.or(orcondition);
  }
  /* var web = Website.aggregate()
    .lookup({
      from: 'newsdailies',
      localField: '_id',
      foreignField: 'website',
      as: 'website'
    })
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    })
    .match(condition)
    .project("_id source_url source_address website_name collected created website.topic user.displayName");*/
  web.skip(10 * (currentPage - 1))
    .limit(10)
    // .populate('user', 'displayName')
    .then((websites) => {
      res.json([{ /* total: websites.length,*/ websites: websites }]);
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
 * Website middleware
 */
exports.websiteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Website is invalid'
    });
  }

  Website.findById(id)
    .populate('user', 'displayName')
    .then((website) => {
      if (!website) {
        return res.status(404).send({
          message: 'No Website with that identifier has been found'
        });
      }
      req.website = website;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
exports.websitesExport = function (req, res) {
  var condition = {};
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status === 1) {
      topic_id.push(element.topic._id);
    }
  })

  // check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (!isAdmin) {
      condition = {
        "website.topic": { '$in': topic_id }
      };
    }
    // else {
    //   //condition.topic = { '$in': topic_id };
    //   condition = {
    //     "website.topic": { '$in': topic_id }
    //   };
    // }
  }
  const styles = {
    headerDark: {
      alignment: {
        horizontal: "center",
        wrapText: true
      },
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      font: {
        color: {
          rgb: 'FFFFFFFF'
        },
        sz: 14,
        bold: true,
        underline: true
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    },
    cellWrap: {
      alignment: {
        horizontal: "top",
        wrapText: true
      }
    }
  };
  Website.find().sort('-created').populate('user', 'displayName')
    .then((websites) => {
      /* var web = Website.aggregate()
        .lookup({
          from: 'newsdailies',
          localField: '_id',
          foreignField: 'website',
          as: 'website'
        })
        .lookup({
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        })
        .match(condition)
        .project("_id source_url source_address website_name collected created website.topic user.displayName");
      web.then((websites) => {*/
      // console.log(websites)
      const heading = [];
      const specification = {
        website_name: { // <- the key should match the actual data key
          displayName: 'Name', // <- Here you specify the column header
          headerStyle: styles.headerDark, // <- Header style
          cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
            return value;
          },
          cellStyle: styles.cellWrap,
          width: 120 // <- width in pixels
        },
        source_url: {
          displayName: 'URL',
          headerStyle: styles.headerDark,
          cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
            return value;
          },
          cellStyle: styles.cellWrap,
          width: '30' // <- width in chars (when the number is passed as string)
        },
        collected: {
          displayName: 'date',
          headerStyle: styles.headerDark,
          cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
            return value;
          },
          cellStyle: styles.cellWrap,
          width: '10' // <- width in chars (when the number is passed as string)
        }
      };

      const merges = [];
      const dataset = websites;

      // Create the excel report.
      // This function will return Buffer
      const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: 'websites', // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            merges: merges, // <- Merge cell ranges
            specification: specification, // <- Report specification
            data: dataset // <-- Report data
          }
        ]
      );
      // You can then return this straight
      res.attachment('Websites.xlsx'); // This is sails.js specific (in general you need to set headers)
      return res.send(report);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};
