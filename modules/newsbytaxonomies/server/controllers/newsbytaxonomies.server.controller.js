'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Newsbytaxonomy = mongoose.model('Newsbytaxonomy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
const excel = require('node-excel-export');
/**
 * Create a Newsbytaxonomy
 */
exports.create = function(req, res) {
  var newsbytaxonomy = new Newsbytaxonomy(req.body);
  newsbytaxonomy.user = req.user;

  newsbytaxonomy.save()
    .then((newsbytaxonomy) => {
      res.jsonp(newsbytaxonomy);
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
 * Show the current Newsbytaxonomy
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var newsbytaxonomy = req.newsbytaxonomy ? req.newsbytaxonomy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  newsbytaxonomy.isCurrentUserOwner = req.user && newsbytaxonomy.user && newsbytaxonomy.user._id.toString() === req.user._id.toString();

  res.jsonp(newsbytaxonomy);
};

/**
 * Update a Newsbytaxonomy
 */
exports.update = function(req, res) {
  var newsbytaxonomy = req.newsbytaxonomy;

  newsbytaxonomy = _.extend(newsbytaxonomy, req.body);

  newsbytaxonomy.save()
    .then((newsbytaxonomy) => {
      res.jsonp(newsbytaxonomy);
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
 * Delete an Newsbytaxonomy
 */
exports.delete = function(req, res) {
  var newsbytaxonomy = req.newsbytaxonomy;

  newsbytaxonomy.deleteOne()
    .then((newsbytaxonomy) => {
      res.jsonp(newsbytaxonomy);
    })
    .catch((err) => {
      //need add to log error let check
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  
};

/**
 * List of Newsbytaxonomies
 */
exports.insertMany = function (req, res) {
  let ok = [];
  let error = [];
  for (const [key, value] of Object.entries(req.body)) {
    let newsbytaxonomy = new Newsbytaxonomy(value);
    newsbytaxonomy.save()
      .then((newsbytaxonomy) => {
        ok.push(value);
      })
      .catch((err) => {
        error.push(value);
      });
  }
  res.jsonp([{ data: 'sucess!', ok: ok, error: error }]);
}

exports.removeMany = function (req, res) {
  let data = req.body;
}

/**
 * Get number record
 *
 */
exports.count = function (req, res) {
  var condition = {};
  var roles = req.user.roles;
  var isRole = -1;
  roles.forEach(function (element, index) {
    if (element == 'admin') {
      isRole = 0;
    } else if (element == 'manager' && isRole == -1) {
      isRole = 1;
    } else if (element == 'user' && isRole == -1) {
      isRole = 2;
    }
  });

  if (isRole == 2) {
    //condition.user = req.user._id;
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = {
      "newsdaily.topic": { '$in': topicIds }
    };
  }

  var orcondition = [];
  //create search by or operator in mongodb
  if (req.query.search != undefined) {
    orcondition.push({ "newsdaily.news_title": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "taxonomy.taxonomy_name": { $regex: new RegExp(req.query.search) } });
  }
  //
  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }
  //
  var newstaxonomy = Newsbytaxonomy.aggregate()//.sort('-created')
    //.populate('user', 'displayName')
    //.populate('taxonomy', 'taxonomy_name')
    .lookup({
      from: 'newsdailies',
      localField: 'newsdaily',
      foreignField: '_id',
      as: 'newsdaily'
    })
    .match(condition)
    .count('total');

  newstaxonomy.then((number) => {
      res.jsonp(number);
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
 * List of Newsbytaxonomies
 */
exports.list = function (req, res) {
  var condition = {};
  var currentPage = 1;
  
  var roles = req.user.roles;
  var isRole = -1;
  roles.forEach(function (element, index) {
    if (element == 'admin') {
      isRole = 0;
    } else if (element == 'manager' && isRole == -1) {
      isRole = 1;
    } else if (element == 'user' && isRole == -1) {
      isRole = 2;
    }
  });

  if (isRole == 2) {
    //condition.user = req.user._id;
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = {
      "newsdaily.topic": { '$in': topicIds }
    };
  }

  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  if (req.query.typefetch != undefined && req.query.typefetch == 'checking') {
    condition.labelingtool = req.query.labelingtool;
    condition.keylabelstudio = req.query.keylabelstudio;
    condition.newsdaily = req.query.newsdaily;
  }
  if (req.query.typefetch != undefined && req.query.typefetch == 'removedlist') {
    condition.labelingtool = req.query.labelingtool;
    condition.newsdaily = req.query.newsdaily;
  }

  var orcondition = [];
  //create search by or operator in mongodb
  if (req.query.search != undefined) {
    orcondition.push({ "newsdaily.news_title": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "taxonomy.taxonomy_name": { $regex: new RegExp(req.query.search) } });
  }
  //
  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }

  var newstaxonomy = Newsbytaxonomy.aggregate()//.sort('-created')
    //.populate('user', 'displayName')
    //.populate('taxonomy', 'taxonomy_name')
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    })
    .unwind('user')
    .lookup({
      from: 'newsdailies',
      localField: 'newsdaily',
      foreignField: '_id',
      as: 'newsdaily'
    })
    .unwind('newsdaily')
    .lookup({
      from: 'taxonomies',
      localField: 'taxonomy',
      foreignField: '_id',
      as: 'taxonomy'
    })
    .unwind('taxonomy')
    .match(condition)
    .project('_id newsdaily.topic newsdaily.news_title newsdaily.news_url taxonomy.taxonomy_name');

  newstaxonomy.skip(10 * (currentPage - 1))
    .limit(10)
    .then((newsbytaxonomies) => {
    res.jsonp(newsbytaxonomies);
  })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  //Newsbytaxonomy.find(condition).sort('-created')
  //  .populate('user', 'displayName')
  //  .populate('taxonomy', 'taxonomy_name')
  //  .populate('newsdaily', '_id news_title news_url')
  //  .then((newsbytaxonomies) => {
  //    res.jsonp(newsbytaxonomies);
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
 * export to excel
 */
exports.export2Excel = function (req, res) {
  var condition = {};
  var roles = req.user.roles;
  var isRole = -1;
  roles.forEach(function (element, index) {
    if (element == 'admin') {
      isRole = 0;
    } else if (element == 'manager' && isRole == -1) {
      isRole = 1;
    } else if (element == 'user' && isRole == -1) {
      isRole = 2;
    }
  });

  if (isRole == 2) {
    //condition.user = req.user._id;
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = {
      "newsdaily.topic": { '$in': topicIds }
    };
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
      },
    }
  };
  //need add by topic
  
  //Newsbytaxonomy.find(condition).sort('-created')
  //  .populate('user', 'displayName')
  //  .populate('taxonomy', 'taxonomy_name')
  //  .populate('newsdaily', '_id news_title news_url')
  var newstaxonomy = Newsbytaxonomy.aggregate()//.sort('-created')
    //.populate('user', 'displayName')
    //.populate('taxonomy', 'taxonomy_name')
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    })
    .unwind('user')
    .lookup({
      from: 'newsdailies',
      localField: 'newsdaily',
      foreignField: '_id',
      as: 'newsdaily'
    })
    .unwind('newsdaily')
    .lookup({
      from: 'taxonomies',
      localField: 'taxonomy',
      foreignField: '_id',
      as: 'taxonomy'
    })
    .unwind('taxonomy')
    .lookup({
      from: 'crawlerconfigs',
      localField: 'newsdaily.crawlerconfig',
      foreignField: '_id',
      as: 'crawlerconfigs'
    })
    .match(condition)
    .project('_id newsdaily.topic newsdaily.news_title newsdaily.news_url taxonomy.taxonomy_name crawlerconfigs.config_name');
  newstaxonomy.then((newsbytaxonomies) => {
        newsbytaxonomies.forEach((element, index) => {
          newsbytaxonomies[index].news_url = element.newsdaily.news_url;
        });
        const merges = []
        const dataset = newsbytaxonomies;
        const heading = [];
        const specification = {
          newsdaily: { // <- the key should match the actual data key
            displayName: 'News Title', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              return value.news_title;
            },
            cellStyle: styles.cellWrap,
            width: '100' // <- width in pixels
          },
          taxonomy: {
            displayName: 'Taxonomy',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              return value.taxonomy_name;
            },
            cellStyle: styles.cellWrap,
            width: '30' // <- width in chars (when the number is passed as string)
          },
          crawlerconfigs: {
            displayName: 'Package',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) {
              if (value.length > 0) {
                return value[0].config_name;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '50'
          },
          news_url: {
            displayName: 'URL',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              return value;
            },
            cellStyle: styles.cellWrap,
            width: '100' // <- width in chars (when the number is passed as string)
          }
        }
        //res.jsonp(newsbytaxonomies);
        const report = excel.buildExport(
          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
              name: 'news', // <- Specify sheet name (optional)
              heading: heading, // <- Raw heading array (optional)
              merges: merges, // <- Merge cell ranges
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        res.attachment('Newsbytaxonomies.xlsx');
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

/**
 * statistic
 */
exports.statisticbytaxonomy = function (req, res) {
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

  //let only topic
  if (req.query.topic != null) {
    condition.topic = req.query.topic;
  }

  Newsbytaxonomy
    .aggregate(
      [
        {
          $lookup: {
            from: "newsdailies",
            localField: "newsdaily",
            foreignField: "_id",
            as: "newsdailies",
            //pipeline: [
            //  { $match: { "newsdailies.topic": { '$in': topic_id } } }
            //],
          }
        },
        {
          "$group": {
            "_id": {
              "taxonomy": "$taxonomy",
              //"newsdaily": '$newsdaily'
            },
            id_taxonomy: {
              $push: "$_id"
            },
            id_newsdailies: {
              $push: "$newsdaily"
            },
            //created: {
            //  $push: "$created"
            //},
            topic: {
              $first: "$newsdailies.topic"//chon first de show khi group
              //$push: "$newsdailies.topic"//chon first de show khi group
            },
            //news_group: {
            //  //$first: "$newsdailies.news_group"//chon first de show khi group
            //  $push: "$newsdailies.news_group"//chon first de show khi group
            //},
            count: {
              "$sum": 1
            }
          }
        }
      ]
    )
    .match(condition)

    .then((data) => {

        //res.jsonp([{ count: count, data: newsdailies }]);
        console.log(data);
        var newdata = [];
        var dumplicate_ids = []


        for (var i = 0; i < data.length; i++) {
          var arr_dump = []
          for (var ii = 0; ii < data[i].id_newsdailies.length; ii++) {
            arr_dump.push({ taxonomy: data[i].id_taxonomy[ii], newsdaily: data[i].id_newsdailies[ii] })
          }
          const filteredArr = arr_dump.reduce((acc, current) => {
            const x = acc.find(item => item.taxonomy == current.taxonomy && item.newsdaily == current.newsdaily);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          newdata.push({
            //_id: data[i].id_taxonomy,
            //newsdaily: data[i].id_newsdailies,
            //created: data[i].created,
            taxonomy: data[i]._id.taxonomy,
            //topic: data[i].topic,
            //news_group: data[i].news_group,
            //count: data[i].count,
            count: filteredArr.length
          });
          for (var j = 0; j < data[i].id_taxonomy.length - 1; j++) {
            dumplicate_ids.push(data[i].id_taxonomy[j]);
          }
        }



        //res.jsonp(topic_id);
        res.jsonp(newdata);

        //Newsbytaxonomy.find({ _id: { '$in': dumplicate_ids } }).sort('-created')
        //  .exec(function (err, newsbytaxonomies) {
        //    res.jsonp(newsbytaxonomies)
        //    for (var k = 0; k < newsbytaxonomies.length; k ++) {
        //      newsbytaxonomies[k].remove(function (err) {

        //      })
        //    }
        //  })
        //res.jsonp(dumplicate_ids)


      
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
 * Newsbytaxonomy middleware
 */
exports.newsbytaxonomyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Newsbytaxonomy is invalid'
    });
  }

  Newsbytaxonomy.findById(id).populate('user', 'displayName')
    .then((newsbytaxonomy) => {
      if (!newsbytaxonomy) {
        return res.status(404).send({
          message: 'No Newsbytaxonomy with that identifier has been found'
        });
      }
      req.newsbytaxonomy = newsbytaxonomy;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
