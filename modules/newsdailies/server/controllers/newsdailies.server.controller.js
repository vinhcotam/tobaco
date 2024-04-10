'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Newsdaily = mongoose.model('Newsdaily'),
  Newsgroup = mongoose.model('Newsgroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

const { forEach, each } = require('lodash');
const excel = require('node-excel-export');
/**
 * Create a Newsdaily
 */
exports.create = function(req, res) {
  var newsdaily = new Newsdaily(req.body);
  newsdaily.user = req.user;

  newsdaily.save()
    .then((newsdaily) => {
      res.jsonp(newsdaily);
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
 * Show the current Newsdaily
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var newsdaily = req.newsdaily ? req.newsdaily.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  newsdaily.isCurrentUserOwner = req.user && newsdaily.user && newsdaily.user._id.toString() === req.user._id.toString();

  res.jsonp(newsdaily);
};

/**
 * Update a Newsdaily
 */
exports.update = function(req, res) {
  var newsdaily = req.newsdaily;

  newsdaily = _.extend(newsdaily, req.body);

  newsdaily.save()
    .then((newsdaily) => {
      res.jsonp(newsdaily);
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
 * Delete an Newsdaily
 */
exports.delete = function(req, res) {
  var newsdaily = req.newsdaily;

  newsdaily.deleteOne()
    .then((newsdaily) => {
      res.jsonp(newsdaily);
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
 * Delete multiple records
 */
exports.forceDelete = function (req, res) {

  var list = req.body.listNews;
  var listObjectIds = []
  for (var id of list) {
    Newsdaily.find({ _id: new mongoose.Types.ObjectId(id)})
      .then((news) => {
        news[0].deleteOne().then(news => {
          res.json(true);
        }).catch((err) => {
          if (err) {
            res.json(false);
          }
        });
      })
      .catch((err) => {
        if (err) {
          res.json(false);
        }
      });
  }
}


/**
 * Get number record by assigned topic 
 * 
 */
exports.count4topics = async function (req, res) {
  var condition = {};

  var topics = req.user.topics;
  var topic_id = [];

  //
  topics.forEach((element, index) => {
    topic_id.push(element.topic._id);
  });

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {
      //show all rows
    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  //
  await Newsdaily.aggregate()
    .lookup({
      from: 'labelingbylabelstudios',
      localField: '_id',
      foreignField: 'newsdaily',
      as: 'labelingbylabelstudios'
    })
    .match(condition)
    .count('totalCount')
    .then((data) => {
      res.jsonp(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}
/**
 * Get number record by topic active
 * 
 */
exports.count = function (req, res) {
  //search
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
      //show all rows
    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  //search
  if (req.query.search != undefined) {
    condition.$or = [{ "news_title": { $regex: new RegExp(req.query.search, "i") } },
    { "news_summary": { $regex: new RegExp(req.query.search, "i") } },
    { "news_url": { $regex: new RegExp(req.query.search, "i") } }
    ];
  }

  if (req.query.filterbylabeled) {
    if (req.query.filterbylabeled == 0) {
      //condition.labelingbylabelstudios = { $exists: false };
      condition.$expr = {
        $eq: [
          {
            "$size": "$labelingbylabelstudios"
          },
          0
        ]
      };
    } else if (req.query.filterbylabeled == 1) {
      //condition.labelingbylabelstudios = { $exists: true };
      condition.$expr = {
        $gt: [
          {
            "$size": "$labelingbylabelstudios"
          },
          0
        ]
      };
    } else {

    }
  }

  if (req.query.filterbygroup && req.query.filterbygroup != 0) {
    condition.news_group = { "$eq": new mongoose.Types.ObjectId(req.query.filterbygroup) }
  }

  if (req.query.startfilterdate) {
    condition.posted = {
      "$gte": new Date(req.query.startfilterdate),
      "$lte": new Date(req.query.endfilterdate)
    }
  }
  //
  if (req.query.filterbycrawlerconfig) {
    condition.crawlerconfig = {
      "$eq": new mongoose.Types.ObjectId(req.query.filterbycrawlerconfig)
    }
  }
  Newsdaily.aggregate()
    .lookup({
      from: 'labelingbylabelstudios',
      localField: '_id',
      foreignField: 'newsdaily',
      as: 'labelingbylabelstudios'
    })
    .match(condition)
    .count('totalCount')
    .then((data) => {
      res.jsonp(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  //Newsdaily.count(condition)
  //  .then((number) => {
  //    res.jsonp([number]);
  //  })
  //  .catch((err) => {
  //    if (err) {
  //      return res.status(400).send({
  //        message: errorHandler.getErrorMessage(err)
  //      });
  //    }
  //  });
};

/**
 * List of Newsdailies
 */
exports.list = function (req, res) {
  /**
   * typeget = undefined 
   * typeget = 1 -> getall data
   * */

  if (req.query.typeget != undefined) {
    Newsdaily.find()
      .then((news) => {
        console.log("aaaaa", news)
        res.jsonp(news);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
  }
  else {
    var currentPage = 1;
    var count = false;
    if (req.query.currentPage != undefined) {
      currentPage = req.query.currentPage;
    }

    if (req.query.count != undefined) {
      count = req.query.count;
    }

    //create search by or operator in mongodb
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
        //show all rows
      } else {
        condition.topic = { '$in': topic_id };
      }
    }

    //search
    if (req.query.search != undefined) {
      condition.$or = [{ "news_title": { $regex: new RegExp(req.query.search, "i") } },
      { "news_summary": { $regex: new RegExp(req.query.search, "i") } },
      { "news_url": { $regex: new RegExp(req.query.search, "i") } }
      ];
    }
    //filterbylabeled
    if (req.query.filterbylabeled) {
      if (req.query.filterbylabeled == 0) {
        //condition.labelingbylabelstudios = { $exists: false };
        condition.$expr = {
          $eq: [
            {
              "$size": "$labelingbylabelstudios"
            },
            0
          ]
        };
      } else if (req.query.filterbylabeled == 1) {
        //condition.labelingbylabelstudios = { $exists: true };
        condition.$expr = {
          $gt: [
            {
              "$size": "$labelingbylabelstudios"
            },
            0
          ]
        };
      } else {

      }
    }
    if (req.query.filterbygroup && req.query.filterbygroup != 0) {
      //filterbygroup
      console.log(req.query.filterbygroup);
      //cond.group_news = { "$eq": parseInt(req.query.filterbygroup)}
      condition.news_group = { "$eq": new mongoose.Types.ObjectId(req.query.filterbygroup) }
    }
    if (req.query.startfilterdate) {
      condition.posted = {
        "$gte": new Date(req.query.startfilterdate),
        "$lte": new Date(req.query.endfilterdate)
      }
    }
    //
    if (req.query.filterbycrawlerconfig) {
      console.log(req.query.filterbycrawlerconfig);
      condition.crawlerconfig = {
        "$eq": new mongoose.Types.ObjectId(req.query.filterbycrawlerconfig)
      }
    }
    //===========================================check role===================================================
    
    var news = Newsdaily.aggregate()
      .lookup({
        from: 'labelingbylabelstudios',
        localField: '_id',
        foreignField: 'newsdaily',
        as: 'labelingbylabelstudios'
      })
      .match(condition);

    if (req.query.sortByPosted != undefined) {
      if (req.query.sortByPosted % 2 == 0) {
        news.sort({ posted: 'asc' });
      } else {
        news.sort({ posted: 'desc' });
      }
    }
    //query
    news.skip(10 * (currentPage - 1))
      .limit(10)
      .then((newsdailies) => {
        res.jsonp([{ count: 0, data: newsdailies }]);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
  }
};

/**
 * List of Newsdailies
 */
exports.listold = function (req, res) {
  /**
   * typeget = undefined 
   * typeget = 1 -> getall data
   * */

  if (req.query.typeget != undefined) {
    Newsdaily.find()
      .then((news) => {
        res.jsonp(news);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
  }
  else {
    var currentPage = 1;
    var count = false;
    if (req.query.currentPage != undefined) {
      currentPage = req.query.currentPage;
    }
    console.log(currentPage - 1);
    if (req.query.count != undefined) {
      count = req.query.count;
    }

    //create search by or operator in mongodb
    var orcondition = [];
    if (req.query.search != undefined) {
      orcondition.push({ "news_title": { $regex: new RegExp(req.query.search, "i") } });
      orcondition.push({ "news_summary": { $regex: new RegExp(req.query.search, "i") } });
      orcondition.push({ "news_url": { $regex: new RegExp(req.query.search, "i") } });
    }

    if (req.query.filterbylabeled) {

    }
    var rowsNews = Newsdaily.count();
    var countNews = Newsdaily.find();
    if (orcondition.length > 0) {
      rowsNews.or(orcondition);
      countNews.or(orcondition);
    }
    
    var cond = {
      "$or": [{ "news_title": { $regex: new RegExp(req.query.search, "i") } },
      { "news_summary": { $regex: new RegExp(req.query.search, "i") } },
      { "news_url": { $regex: new RegExp(req.query.search, "i") } }
      ],
      //size_labelingbylabelstudios: { "$eq": 1 }
    };
    if (req.query.filterbylabeled) {
      if (req.query.filterbylabeled == 0) {
        cond.size_labelingbylabelstudios = { "$eq": 0 }
      } else if (req.query.filterbylabeled == 1) {
        cond.size_labelingbylabelstudios = { "$gt": 0 }
      } else {
      }

    }
    if (req.query.filterbygroup && req.query.filterbygroup != 0) {
      //filterbygroup
      console.log(req.query.filterbygroup);
      //cond.group_news = { "$eq": parseInt(req.query.filterbygroup)}
      cond.news_group = { "$eq": new mongoose.Types.ObjectId(req.query.filterbygroup)}
    }
    if (req.query.startfilterdate) {
      cond.posted = {
        "$gte": new Date(req.query.startfilterdate),
        "$lte": new Date(req.query.endfilterdate)
      }
    }
    //
    if (req.query.filterbycrawlerconfig) {
      console.log(req.query.filterbycrawlerconfig);
      cond.crawlerconfig = {
        "$eq": new mongoose.Types.ObjectId(req.query.filterbycrawlerconfig)
      }
    }
    //===========================================check role===================================================
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    var added_fields = {};
    added_fields.size_labelingbylabelstudios = { $size: '$labelingbylabelstudios' };

    if (!isAdmin) {
      added_fields.working_status = {
        $size: {
          "$filter": {
            "input": "$asginedtopics",
            "as": "p",
            "cond": {
              '$and': [
                { "$eq": ["$$p.working_status", 1] },
                { "$eq": ["$$p.assigned_user", new mongoose.Types.ObjectId(req.user._id)]}
              ]
            }
          }
        }
      };
      //check working status
      cond.working_status = {
        "$gt": 0
      }
    }

    //===========================================================================================================
    var news = Newsdaily.aggregate()
      .lookup({
        from: 'labelingbylabelstudios',
        localField: '_id',
        foreignField: 'newsdaily',
        as: 'labelingbylabelstudios'
      })
      .lookup({
        from: 'assignedtopics',
        localField: 'topic',
        foreignField: 'topic',
        as: 'asginedtopics'
      })
      .addFields(added_fields)
      .match(cond);

      if (req.query.sortByPosted != undefined) {
        if (req.query.sortByPosted % 2 == 0) {
          news.sort({ posted: 'asc' });
        } else {
          news.sort({ posted: 'desc' });
        }
      }
      //.sort({ posted: 'asc'});

    var countRows = Newsdaily.aggregate()
      .lookup({ from: 'labelingbylabelstudios', localField: '_id', foreignField: 'newsdaily', as: 'labelingbylabelstudios' })
      .lookup({ from: 'assignedtopics', localField: 'topic', foreignField: 'topic', as: 'asginedtopics' })
      .addFields(added_fields)
      .match(cond).group({ _id: "$_id" });

    countRows
      .then((count) => {
        //res.jsonp({ count });
        news.skip(10 * (currentPage - 1))
          .limit(10)
          .then((newsdailies) => {
            res.jsonp([{ count: count.length, data: newsdailies }]);
          })
          .catch((err) => {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
        //rowsNews.find()//.sort('-created')
        //  .skip(10 * (currentPage - 1)).limit(10)
        //  .populate('user', 'displayName')
        //  //.lookup({ from: 'labelingbylabelstudios', localField: '_id', foreignField: 'newsdaily', as: 'labelingbylabelstudios' })
        //  .exec(function (err, newsdailies) {
        //    if (err) {
        //      return res.status(400).send({
        //        message: errorHandler.getErrorMessage(err)
        //      });
        //    } else {
        //      res.jsonp([{ count: count, data: newsdailies }]);
        //    }
        //  });
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });

    //get data
    /*if (count == false) {
      var rowsNews = Newsdaily.count();
      if (orcondition.length > 0) {
        rowsNews.or(orcondition);
      }
      rowsNews.find()//.sort('-created')
        .skip(10 * (currentPage - 1)).limit(10)
        .populate('user', 'displayName').exec(function (err, newsdailies) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp([{ count: 100, data: newsdailies }]);
          }
        });
    } else { //get count
      var countNews = Newsdaily.find();
      if (orcondition.length > 0) {
        countNews.or(orcondition);
      }
      countNews.count().exec(function (err, count) {
        if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
        } else {
          res.jsonp({ count });
        }
      });
    }*/
  }
};
/**/
exports.statistic = function (req, res) {
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
      //get all data
    } else {
      condition.topic = { '$in': topic_id };
    }
  }
  if (req.query.filterbygroup && req.query.filterbygroup != 0) {
    //filterbygroup
    console.log(req.query.filterbygroup);
    condition.news_group = { "$eq": new mongoose.Types.ObjectId(req.query.filterbygroup) }
  }
  if (req.query.startfilterdate) {
    condition.posted = {
      "$gte": new Date(req.query.startfilterdate),
      "$lte": new Date(req.query.endfilterdate)
    }
  }
  Newsdaily//.populate('website', 'source_address')
    .aggregate(
      [
        {
          $lookup: {
            from: "websites",
            localField: "website",
            foreignField: "_id",
            as: "websites"
          }
        }, {
          "$group": {
            "_id": {
              "source_address": "$websites.source_address"
            },
            posted: { $first: '$posted'},
            news_group: { $first: '$news_group' },
            topic: { $first: '$topic' },
            "count": {
              "$sum": 1.0
            }
          }
        }
      ]
    )
    .match(condition)
    .then((data) => {
      res.jsonp(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

exports.statisticbygroupnews = function (req, res) {
  var condition = { news_group: { $exists:true, $ne: null }};
  let groupCondition = {
    "_id": "$news_group",
    topic: { $first: '$topic' },
    group_name: { $first: '$newsgroups.name'},
    "count": {
      "$sum": 1.0
    }
  };
  if (Object.keys(req.query).length != 0) {
    condition.posted = {
      "$gte": new Date(req.query.start),
      "$lte": new Date(req.query.end)
    };
    groupCondition = {
      "_id": {posted: "$posted", news_group: "$news_group"},
      group_name: { $first: '$newsgroups.name'},
      "count": {
        "$sum": 1.0
      }
    };
  }
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

  Newsdaily//.populate('website', 'source_address')
    .aggregate(
      [
        {
          $match: condition
        },
        {
          $project: {
            topic: 1,
            posted: 1,
            news_group: 1,
          },
        },
        {
          $lookup: {
            from: "newsgroups",
            localField: "news_group",
            foreignField: "_id",
            as: "newsgroups"
          }
        }, 
        {
          $group: groupCondition,
        },
        {
          $sort: {posted: 1},
        }
      ]
    )
    .then((data) => {
      res.jsonp(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        /*return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });*/
      }
    });
};
/**
 * Newsdaily middleware
 */
exports.newsdailyByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Newsdaily is invalid'
    });
  }

  Newsdaily.findById(id)
    .populate('topic', '_id topic_name')
    .populate('user', 'displayName')
    .then((newsdaily) => {
      if (!newsdaily) {
        return res.status(404).send({
          message: 'No Newsdaily with that identifier has been found'
        });
      }
      req.newsdaily = newsdaily;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
//
exports.newsdailiesExport = function (req, res) {
  // You can define styles as json object
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
      },
    }
  };

  /*var currentPage = 1;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }
  console.log(currentPage - 1);*/
  if (req.query.count != undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "news_title": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "news_summary": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "news_url": { $regex: new RegExp(req.query.search, "i") } });
  }

  if (req.query.filterbylabeled) {

  }
  var rowsNews = Newsdaily.count();
  var countNews = Newsdaily.find();
  if (orcondition.length > 0) {
    rowsNews.or(orcondition);
    countNews.or(orcondition);
  }

  var cond = {
    "$or": [{ "news_title": { $regex: new RegExp(req.query.search, "i") } },
    { "news_summary": { $regex: new RegExp(req.query.search, "i") } },
    { "news_url": { $regex: new RegExp(req.query.search, "i") } }
    ],
    //size_labelingbylabelstudios: { "$eq": 1 }
  };
  if (req.query.filterbylabeled) {
    if (req.query.filterbylabeled == 0) {
      cond.size_labelingbylabelstudios = { "$eq": 0 }
    } else if (req.query.filterbylabeled == 1) {
      cond.size_labelingbylabelstudios = { "$gt": 0 }
    } else {
    }

  }
  if (req.query.filterbygroup && req.query.filterbygroup != 0) {
    //filterbygroup
    console.log(req.query.filterbygroup);
    cond.group_news = { "$eq": parseInt(req.query.filterbygroup) }
  }
  if (req.query.startfilterdate) {
    cond.posted = {
      "$gte": new Date(req.query.startfilterdate),
      "$lte": new Date(req.query.endfilterdate)
    }
  }
  if (req.query.filterbycrawlerconfig) {
    console.log(req.query.filterbycrawlerconfig);
    cond.crawlerconfig = {
      "$eq": new mongoose.Types.ObjectId(req.query.filterbycrawlerconfig)
    }
  }
  var news = Newsdaily.aggregate()
    .lookup({ from: 'labelingbylabelstudios', localField: '_id', foreignField: 'newsdaily', as: 'labelingbylabelstudios' })
    .addFields({ size_labelingbylabelstudios: { $size: '$labelingbylabelstudios' } })
    .match(cond);

  if (req.query.sortByPosted != undefined) {
    if (req.query.sortByPosted % 2 == 0) {
      news.sort({ posted: 'asc' });
    } else {
      news.sort({ posted: 'desc' });
    }
  }
  //.sort({ posted: 'asc'});

  news
    .then((newsdailies) => {
        //Array of objects representing heading rows (very top)
        const heading = [
          //[{ value: 'a1', style: styles.headerDark }, { value: 'b1', style: styles.cellGreen }, { value: 'c1', style: styles.headerDark }],
          //['a2', 'b2', 'c2'] // <-- It can be only values
        ];

        //Here you specify the export structure
        const specification = {
          news_title: { // <- the key should match the actual data key
            displayName: 'Title', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            /*cellStyle: function (value, row) { // <- style renderer function
              // if the status is 1 then color in green else color in red
              // Notice how we use another cell value to style the current one
              return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible 
            },*/
            cellStyle: styles.cellWrap,
            width: 120 // <- width in pixels
          },
          news_summary: {
            displayName: 'Summary',
            headerStyle: styles.headerDark,
            /*cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              return (value == 1) ? 'Active' : 'Inactive';
            },*/
            cellStyle: styles.cellWrap,
            width: '30' // <- width in chars (when the number is passed as string)
          },
          npl_content: {
            displayName: 'Content',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellWrap,
            width: '100' // <- width in chars (when the number is passed as string)
          },
          npl_date: {
            displayName: 'Posted date',
            headerStyle: styles.headerDark,
            width: 100
          },
          news_url: {
            displayName: 'URL',
            headerStyle: styles.headerDark,
            //cellStyle: styles.cellPink, // <- Cell style
            cellStyle: styles.cellWrap,
            width: 220 // <- width in pixels
          }
        }

        // Define an array of merges. 1-1 = A:1
        // The merges are independent of the data.
        // A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
          //{ start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
          //{ start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
          //{ start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
        ]
        const dataset = newsdailies;

        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
              name: 'newsdailies', // <- Specify sheet name (optional)
              heading: heading, // <- Raw heading array (optional)
              merges: merges, // <- Merge cell ranges
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );
        // You can then return this straight
        res.attachment('newsdailies.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
     
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
}

exports.convertnewsgroup = function (req, res) {
  Newsgroup.find({ topic: req.query.topic })
    .then((groups) => {
      Newsdaily.find({ topic: req.query.topic })
        .then((news) => {
          news.forEach(function (element) {
            if (element.group_news == 1) {//ung ho nganh cong nghiep thuoc la
              groups.forEach(function (group) {
                if (group.name == 'Ủng hộ ngành công nghiệp thuốc lá') {
                  element.news_group = group._id;
                }
              })

            } else if (element.group_news == 2) {//ung ho y te cong con
              groups.forEach(function (group) {
                if (group.name == 'Ủng hộ ngành y tế công cộng') {
                  element.news_group = group._id;
                }
              })
            } else if (element.group_news == 3) {//khong ro
              groups.forEach(function (group) {
                if (group.name == 'không xác định') {
                  element.news_group = group._id;
                }
              })
            }
            element.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                //res.jsonp(element);
              }
            });
          });
          res.jsonp(groups);
        })
        .catch((err) => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    })
};
