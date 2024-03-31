'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Labelingbytaxonomy = mongoose.model('Labelingbytaxonomy'),
  Newsbytaxonomy = mongoose.model('Newsbytaxonomy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
const { forEach } = require('lodash');
const excel = require('node-excel-export');
/**
 * Create a Labelingbytaxonomy
 */
exports.create = function(req, res) {
  var labelingbytaxonomy = new Labelingbytaxonomy(req.body);
  labelingbytaxonomy.user = req.user;

  labelingbytaxonomy.save()
    .then((labelingbytaxonomy) => {
      res.jsonp(labelingbytaxonomy);
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
 * Show the current Labelingbytaxonomy
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var labelingbytaxonomy = req.labelingbytaxonomy ? req.labelingbytaxonomy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  labelingbytaxonomy.isCurrentUserOwner = req.user && labelingbytaxonomy.user && labelingbytaxonomy.user._id.toString() === req.user._id.toString();

  res.jsonp(labelingbytaxonomy);
};

/**
 * Update a Labelingbytaxonomy
 */
exports.update = function(req, res) {
  var labelingbytaxonomy = req.labelingbytaxonomy;

  labelingbytaxonomy = _.extend(labelingbytaxonomy, req.body);

  labelingbytaxonomy.save()
    .then((labelingbytaxonomy) => {
      res.jsonp(labelingbytaxonomy);
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
 * Delete an Labelingbytaxonomy
 */
exports.delete = function(req, res) {
  var labelingbytaxonomy = req.labelingbytaxonomy;

  labelingbytaxonomy.deleteOne()
    .then((labelingbytaxonomy) => {
      res.jsonp(labelingbytaxonomy);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
    
};

/*
  * Insert or update
*/
exports.insertOrUpdate = async function (req, res) {
  let datas = req.body;
  let ok = [];
  let error = [];
  for (const [key, data] of Object.entries(req.body)) {
    await Labelingbytaxonomy.updateOne(
      {
        labelingtool: data.labelingtool,
        newsdaily: data.newsdaily,
        keylabelstudio: data.keylabelstudio
      },
      {
        "$set": {
          'start': data.start,
          'end': data.end,
          'text': data.text,
        },
        "$setOnInsert": {
          'labelingtool': data.labelingtool,
          'newsdaily': data.newsdaily,
          'keylabelstudio': data.keylabelstudio,
          'user': data.user,
          'created': Date(),
        }
      },
      { upsert: true })
      .then((object) => {
        ok.push(data.keylabelstudio);
      })
      .catch((err) => {
        if (err) console.log(err);
        error.push(data.keylabelstudio);
      });

      //,
      //function(err){
      //    if (err) console.log(err);
      //});
  }
  res.jsonp([{ data: 'sucess!', ok: ok, error: error }]);
}

/*
  * remove many
*/

exports.removeMany = async function (req, res) {
  let data = req.body;
  var numberDelete = 0;
  let removeCondition = {
    labelingtool: new mongoose.Types.ObjectId(data.labelingtool),
    newsdaily: new mongoose.Types.ObjectId(data.newsdaily),
  };
  let ok = [];
  let error = [];
  for (const [key, value] of Object.entries(data.removeKey)) {
    removeCondition.keylabelstudio = value;

    await Labelingbytaxonomy.deleteOne(removeCondition)
      .then((object) => {
        console.log(object);
        ok.push(value);
      })
      .catch((err) => {
        error.push(value);
        console.log(err);
      });
    //Labelingbytaxonomy.remove(removeCondition, function (err) {
    //  if (err != null) {
    //    console.log(err);
    //  } else {
    //  }
    //});
  }
  res.jsonp([{ data: 'sucess!', error: error, ok: ok }]);
}

/*
  * List for checking
*/
exports.checkingEditOrRemove = function (req, res) {
  var condition = {};

  if (req.query.typefetch != undefined && req.query.typefetch == 'checking') {
    condition.labelingtool = req.query.labelingtool;
    condition.keylabelstudio = req.query.keylabelstudio;
    condition.newsdaily = req.query.newsdaily;
  }

  if (req.query.typefetch != undefined && req.query.typefetch == 'removedlist') {
    condition.labelingtool = req.query.labelingtool;
    condition.newsdaily = req.query.newsdaily;
  }

  //
  var currentPage = 1;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "text": { $regex: new RegExp(req.query.search, "i") } });
  }
  var isAdmin = req.user.roles.includes('admin');
  var isManager = req.user.roles.includes('manager');

  var listlabel = Labelingbytaxonomy.aggregate()
    .lookup({ from: 'newsdailies', localField: 'newsdaily', foreignField: '_id', as: 'newsdaily' })
    .lookup({
      from: 'assignedtopics',
      localField: 'newsdaily.topic',
      foreignField: 'topic',
      as: 'asginedtopics'
    })
    .lookup({ from: 'newsbytaxonomies', localField: 'newsdaily._id', foreignField: 'newsdaily', as: 'newsbytaxonomy' })
    .lookup({ from: 'taxonomies', localField: 'newsbytaxonomy.taxonomy', foreignField: '_id', as: 'taxonomies' })
    .lookup({ from: 'languagevariables', localField: 'languagevariables', foreignField: '_id', as: 'languagevariables' })
    .match(condition);

    
  listlabel
    .then((list) => {
      console.log("=================");
      console.log(condition);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });

  var countRows = Labelingbytaxonomy.aggregate()
    .lookup({ from: 'newsdailies', localField: 'newsdaily', foreignField: '_id', as: 'newsdaily' })
    .lookup({ from: 'newsbytaxonomies', localField: 'newsdaily._id', foreignField: 'newsdaily', as: 'newsbytaxonomy' })
    .lookup({ from: 'taxonomies', localField: 'newsbytaxonomy.taxonomy', foreignField: '_id', as: 'taxonomies' })
    .match(condition);

  if (req.query.typefetch != undefined && req.query.typefetch == 'checking') {
    Labelingbytaxonomy
      .find(condition).sort('-created')
      .populate('user', 'displayName')
      .populate({
        path: 'newsdaily',
        select: '_id news_url'
      })

      .then((labelingbytaxonomies) => {
        //News
        res.jsonp(labelingbytaxonomies);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
      
  }

  //
  if (req.query.typefetch != undefined && req.query.typefetch == 'removedlist') {
    Labelingbytaxonomy
      .find(condition).sort('-created')
      .populate('user', 'displayName')
      .populate({
        path: 'newsdaily',
        select: '_id news_url'
      })
      .exec(function (err, labelingbytaxonomies) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          //News
          res.jsonp(labelingbytaxonomies);
        }
      });
  } else {
    if (orcondition.length > 0) {
      listlabel.or(orcondition);
      countRows.or(orcondition);
    }
    countRows
      .then((count) => {
        listlabel.skip(10 * (currentPage - 1))
          .limit(10)
          .then((list) => {
            res.jsonp([{ count: count.length, data: list }]);
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
      });

  }
};

/**
 * Get number record
 *
 */
exports.count = function (req, res) {
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
      condition = {
        "newsdaily.topic": { '$in': topic_id }
      };
    }
  }

  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "text": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "languagevariables.name": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "newsdaily.news_url": { $regex: new RegExp(req.query.search, "i") } });
  }
  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }

  var countRows = Labelingbytaxonomy.aggregate()
    .lookup({
      from: 'newsdailies',
      localField: 'newsdaily', 
      foreignField: '_id',
      as: 'newsdaily'
    })
    //.unwind('newsdaily')
    .lookup({ from: 'languagevariables', localField: 'languagevariables', foreignField: '_id', as: 'languagevariable' })
    //.unwind('languagevariable')
    .match(condition)
    .count('total');

  countRows
    .then((count) => {
      res.jsonp(count);
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
 * List of Labelingbytaxonomies
 */
exports.list = async function (req, res) {
  var condition = {};

  if (req.query.typefetch != undefined && req.query.typefetch == 'checking') {
    condition.labelingtool = req.query.labelingtool;
    condition.keylabelstudio = req.query.keylabelstudio;
    condition.newsdaily = req.query.newsdaily;
  }

  if (req.query.typefetch != undefined && req.query.typefetch == 'removedlist') {
    condition.labelingtool = req.query.labelingtool;
    condition.newsdaily = req.query.newsdaily;
  }

  //
  var currentPage = 1;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "text": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "languagevariables.name": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "newsdaily.news_url": { $regex: new RegExp(req.query.search, "i") } });
  }
  //
  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  var isAdmin = req.user.roles.includes('admin');
  var isManager = req.user.roles.includes('manager');
  var added_fields = {};
  if (!isAdmin) {
    /*added_fields.working_status = {
      $size: {
        "$filter": {
          "input": "$newsdaily",
          "as": "p",
          "cond": {
            '$and': [
              { "$in": ["$$p.topic", topic_id] }
            ]
          }
        }
      }
    };

    condition.working_status = {
      "$gt": 0
    }*/
    //condition.newsdaily.topic = { '$in': topic_id };
    condition = {
      "newsdaily.topic": { '$in': topic_id }
    };
  }
  
  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }

  var listlabel = Labelingbytaxonomy.aggregate()
    .lookup({ from: 'newsdailies', localField: 'newsdaily', foreignField: '_id', as: 'newsdaily' })
    .lookup({ from: 'topics', localField: 'newsdaily.topic', foreignField: '_id', as: 'topic' })
    .lookup({ from: 'newsbytaxonomies', localField: 'newsdaily._id', foreignField: 'newsdaily', as: 'newsbytaxonomy' })
    .lookup({ from: 'taxonomies', localField: 'newsbytaxonomy.taxonomy', foreignField: '_id', as: 'taxonomies' })
    .lookup({ from: 'languagevariables', localField: 'languagevariables', foreignField: '_id', as: 'languagevariables' })
    .unwind('topic')
    .project("_id text created user newsdaily.topic newsdaily.news_url topic.topic_name languagevariables.name taxonomies.taxonomy_name");//decontruct aray to object
    //.unwind('newsdaily')
    
    if (!isAdmin) {
      //listlabel.addFields(added_fields);
    }
  listlabel = listlabel.match(condition);
  //listlabel = listlabel.count('total');

  await listlabel.skip(10 * (currentPage - 1))
    .limit(10)
    .then((list) => {
      res.jsonp([{data: list }]);
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
 * statistic by language variable4. thiệt hại kt trong khó khăn
 */
exports.statisticbyargument = function (req, res) {
  var condition = {};
  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  });
  let groupCondition = {
    "_id": {
      "name": "$languagevariables.name",
    },
    topic: { $first: '$languagevariables.topic' },
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
      "_id": {posted: "$newsdailies.posted", name: "$languagevariables.name"},
      topic: { $first: '$languagevariables.topic' },
      name: {$first: '$languagevariables.name'},
      newsdaily: {$first: '$newsdailies._id'},
      posted: {$first: '$newsdailies.posted'},
      "count": {
        "$sum": 1.0
      }
    };
  }

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }
  Labelingbytaxonomy
    .aggregate(
      [
        {
          $lookup: {
            from: "languagevariables",
            localField: "languagevariables",
            foreignField: "_id",
            as: "languagevariables"
          }
        },
        {
          $lookup: {
            from: "newsdailies",
            localField: "newsdaily",
            foreignField: "_id",
            as: "newsdailies"
          }
        },
        {
          $group: groupCondition,
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
    
}

/**
 * Labelingbytaxonomy middleware
 */
exports.labelingbytaxonomyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Labelingbytaxonomy is invalid'
    });
  }

  Labelingbytaxonomy.findById(id).populate('user', 'displayName')
    .then((labelingbytaxonomy) => {
      if (!labelingbytaxonomy) {
        return res.status(404).send({
          message: 'No Labelingbytaxonomy with that identifier has been found'
        });
      }
      req.labelingbytaxonomy = labelingbytaxonomy;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
//
exports.labelingbytaxonomyExport = function (req, res) {
  //
  var condition = {};
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
      //condition.topic = { '$in': topic_id };
    }
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

  var currentPage = 1;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "text": { $regex: new RegExp(req.query.search, "i") } });
  }
  var listlabel = Labelingbytaxonomy.aggregate()
    .lookup({ from: 'newsdailies', localField: 'newsdaily', foreignField: '_id', as: 'newsdaily' })
    .lookup({ from: 'topics', localField: 'newsdaily.topic', foreignField: '_id', as: 'topic' })
    .lookup({ from: 'newsbytaxonomies', localField: 'newsdaily._id', foreignField: 'newsdaily', as: 'newsbytaxonomy' })
    .lookup({ from: 'crawlerconfigs', localField: 'newsdaily.crawlerconfig', foreignField: '_id', as: 'crawlerconfigs' })
    .lookup({ from: 'newsgroups', localField: 'newsdaily.news_group', foreignField: '_id', as: 'news_groups' })
    .lookup({ from: 'websites', localField: 'newsdaily.website', foreignField: '_id', as: 'websites' })
    .lookup({ from: 'taxonomies', localField: 'newsbytaxonomy.taxonomy', foreignField: '_id', as: 'taxonomies' })
    .lookup({ from: 'languagevariables', localField: 'languagevariables', foreignField: '_id', as: 'languagevariables' })
    .unwind('topic')
    .project("_id text newsdaily.npl_date created user newsdaily.topic newsdaily.news_url topic.topic_name languagevariables.name taxonomies.taxonomy_name crawlerconfigs.config_name news_groups.name websites.website_name")/*;//decontruct aray to object
    //.unwind('newsdaily')
  var listlabel = Labelingbytaxonomy.aggregate()
    .lookup({ from: 'newsdailies', localField: 'newsdaily', foreignField: '_id', as: 'newsdaily' })
    .lookup({ from: 'topics', localField: 'newsdaily.topic', foreignField: '_id', as: 'topic' })
    .lookup({ from: 'newsgroups', localField: 'newsdaily.news_group', foreignField: '_id', as: 'newsgroup' })
    .lookup({ from: 'websites', localField: 'newsdaily.website', foreignField: '_id', as: 'websites' })
    .lookup({ from: 'newsbytaxonomies', localField: 'newsdaily._id', foreignField: 'newsdaily', as: 'newsbytaxonomy' })
    .lookup({ from: 'newsdailies', localField: 'newsbytaxonomies.newsdaily', foreignField: '_id', as: 'group_news' })
    .lookup({ from: 'taxonomies', localField: 'newsbytaxonomy.taxonomy', foreignField: '_id', as: 'taxonomies' })
    .lookup({ from: 'languagevariables', localField: 'languagevariables', foreignField: '_id', as: 'languagevariables' })
    .unwind('topic')
    .unwind('newsgroup')*/
    .match(condition);

  listlabel
    .then((list) => {
        const heading = [];

        //Here you specify the export structure
        const specification = {
          languagevariables: { // <- the key should match the actual data key
            displayName: 'Argument', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            /*cellStyle: function (value, row) { // <- style renderer function
              // if the status is 1 then color in green else color in red
              // Notice how we use another cell value to style the current one
              return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible 
            },*/
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              if (value.length > 0) {
                return value[value.length - 1].name;
                //return value[0].name;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: 120 // <- width in pixels
          },
          taxonomies: {
            displayName: 'Taxonomy',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              if (value.length > 0) {
                var str = "";
                if (value.length == 1) {
                  str = value[0].taxonomy_name;
                } else {
                  for (var i = 0; i < value.length; i++) {
                    if (i == value.length - 1) {
                      str += value[i].taxonomy_name;
                    } else {
                      str += value[i].taxonomy_name + "->";
                    }
                  }
                }

                return str;
              } else {
                return "";
              }

            },
            cellStyle: styles.cellWrap,
            width: '30' // <- width in chars (when the number is passed as string)
          },
          text: {
            displayName: 'Text',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) {
              return value;
            },
            cellStyle: styles.cellWrap,
            width: '30'
          },
          topic: {
            displayName: 'Topic',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              if (value != null) {
                return value.topic_name;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '30'
          },
          npl_date: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              if (value.length > 0) {
                return value[0].npl_date;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '20' 
          },
          news_groups: {
            displayName: 'Group news',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { 
              if (value.length > 0) {
                return value[0].name;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '20' 
          },
          websites: {
            displayName: 'Websites',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { 
              if (value.length > 0) {
                return value[0].website_name;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '20'
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
            width: '100'
          },
          newsdaily: {
            displayName: 'URL',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { 
              if (value.length > 0) {
                return value[0].news_url;
              } else {
                return "";
              }
            },
            cellStyle: styles.cellWrap,
            width: '100' // <- width in chars (when the number is passed as string)
          }
        }

        // Define an array of merges. 1-1 = A:1
        // The merges are independent of the data.
        // A merge will overwrite all data _not_ in the top-left cell.
        const merges = []
        const dataset = list;
        list.forEach((element, index) => {
          //list[index].group_news = element.newsdaily;
          list[index].npl_date = element.newsdaily;
        })
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
        res.attachment('Argument.xlsx'); // This is sails.js specific (in general you need to set headers)
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
