(function () {
    'use strict';
    // Comments controller
    angular
        .module('comments')
        .controller('LabelingcommentsController', LabelingcommentsController);

    LabelingcommentsController.$inject = ['$scope', '$sce', '$state', '$window', 'Authentication', 'commentResolve', 'SentimentsService', 'LabelingbylabelstudiosService', 'Notification', '$stateParams',
        'CommentsService'
    ];

    function LabelingcommentsController($scope, $sce, $state, $window, Authentication, comment, SentimentsService, LabelingbylabelstudiosService, Notification, $stateParams, CommentsService) {
        var vm = this;
        // vm.newsId = $stateParams.newsId;
        // console.log("vm.newsId:", vm.newsId);
        vm.newsId = $stateParams.newsId;
        vm.authentication = Authentication;
        //redirect
        if (vm.authentication.user == null) {
            window.location.href = '/authentication/signin';
        }
        SentimentsService.query(function (data) {
            vm.sentiments = data;
        });


        //get comment by newsId
        var contentObject = {};
        var params = { newsId: vm.newsId };
        CommentsService.query(params, function (dataComment) {
            dataComment.forEach(function (resource) {
                contentObject[resource._id] = resource.content;
            });
        });

        LabelingbylabelstudiosService.query({ comment: comment._id }).$promise.then(function (labelingbylabelstudio) {

            if (labelingbylabelstudio.length > 0) {
                vm.labelingbylabelstudio = labelingbylabelstudio[0];
            } else {
                vm.labelingbylabelstudio = new LabelingbylabelstudiosService();
            }
        });
        vm.removedentries = [];//remove entries
        vm.labelingbylabelstudio = new LabelingbylabelstudiosService();
        // vm.newsbytaxonomies = null;


        SentimentsService.query().$promise.then(function (sentiments) {
            console.log(sentiments);
            sentiments.forEach(function (sentiment) {
                var choice = `<View>
                <Labels name="ner" toName="text">`;
                vm.sentiments.forEach(function (sentiment) {
                    choice += '<Label value="' + sentiment._id + '">' + sentiment.name + '</Label>';
                });
                choice += `</Labels>
                <Text name="text" value="$text"></Text>`;
                choice += '</View>';

                var text = '';
                for (var key in contentObject) {
                    if (contentObject.hasOwnProperty(key)) {
                        text += '\n';
                        text += contentObject[key];
                        text += '\n';

                    }
                }

                var labelStudio = new LabelStudio('label-studio', {
                    config: choice,
                    interfaces: [
                        "panel",
                        "controls",
                        "side-column",
                        "completions:menu",
                        "completions:add-new",
                        "completions:delete",
                    ],

                    user: {
                        firstName: Authentication.firstName,
                        lastName: Authentication.lastName
                    },
                    task: {
                        id: 1,
                        data: {
                            text: text
                        }
                    },

                    onLabelStudioLoad: function (LS) {

                        var c = LS.completionStore.addCompletion({
                            userGenerate: true
                        });
                        LS.completionStore.selectCompletion(c.id);
                        if (vm.labelingbylabelstudio._id) {
                            var completion = {};
                            try {
                                completion = JSON.parse(vm.labelingbylabelstudio.completion);
                                //console.log(typeof completion);
                                if (typeof completion !== 'object') {
                                    completion = JSON.parse(completion);
                                }
                            } catch (err) {
                                alert('Error load data from server!')
                            }
                            //*end code*/
                            //delete completion.highlightedNode;
                            //delete completion
                            LS.completionStore.addCompletion(completion);
                            try {
                                LS.completionStore.selectCompletion(completion.id);
                            } catch (err) {
                                console.log(err);
                                console.log(LS);
                                delete completion.area;
                            }

                        }
                    },
                    onSubmitCompletion: function (ls, completion) {
                        // vm.labelingbylabelstudio.newsdaily = newsdaily._id;
                        vm.labelingbylabelstudio.completion = JSON.stringify(completion.toJSON());
                        var completionObject = JSON.parse(vm.labelingbylabelstudio.completion);
                        console.log("list:", contentObject)
                        var commentId = ""
                        for (const key in completionObject.areas) {
                            if (completionObject.areas.hasOwnProperty(key)) {
                                const item = completionObject.areas[key];
                                const text = item.text;
                                for (const [key, elements] of Object.entries(contentObject)) {
                                    if (typeof elements === 'string') {
                                        if (elements.includes(text)) {
                                            commentId = key
                                            console.log('Text được tìm thấy trong phần tử có key:', key);
                                        }
                                    } else {
                                        console.error(`Giá trị của phần tử ${key} không phải là chuỗi.`);
                                    }
                                }


                            }
                        }
                        if (vm.labelingbylabelstudio._id) {
                            vm.labelingbylabelstudio.$update(function (res) {
                                Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Labeling Updated!' });
                            }, function (err) {
                                Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling Not Updated!' });
                            });

                        }
                        else {
                            vm.labelingbylabelstudio.$save(function (res) {
                                //save success
                                if (vm.labelingbylabelstudio._id) {
                                    Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>Labeling Saved!' });
                                    /***********CODE SAVE ANOTHER TABLES*/
                                    completion = completion.toJSON();
                                    if (completion != undefined) {
                                        var areas = completion.areas;
                                        for (const [key, value] of Object.entries(areas)) {
                                            if (value.type != undefined) {
                                                if (value.type == "textrange") {
                                                    LabelingbysentimentsService.checkingEditOrRemove({
                                                        typefetch: 'checking',
                                                        keylabelstudio: key,
                                                        labelingtool: vm.labelingbylabelstudio._id,
                                                        comment: commentId
                                                    }).$promise.then(function (labelingbysentiment) {
                                                        var labelObject;
                                                        if (labelingbysentiment.length > 0) {
                                                            labelObject = labelingbysentiment[0];
                                                        } else {
                                                            labelObject = new LabelingbysentimentsService();
                                                        }

                                                        labelObject.start = value.start;
                                                        labelObject.end = value.end;
                                                        labelObject.text = value.text;
                                                        labelObject.keylabelstudio = key;
                                                        labelObject.labelingtool = vm.labelingbylabelstudio._id;
                                                        labelObject.comment = commentId;

                                                        if (value.results.length > 0) {
                                                            for (var i = 0; i < value.results.length; i++) {
                                                                if (value.results[i].type == "labels") {
                                                                    var labels = value.results[i].value.labels;
                                                                    if (labels.length > 0) {
                                                                        for (var j = 0; j < labels.length; j++) {
                                                                            var idvariable = vm.variables.find(v => v.name == labels[j])._id;
                                                                            labelObject.sentiments = idvariable;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        if (labelObject._id) {
                                                            labelObject.$update(function (res) {
                                                                console.log(res);
                                                                Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>LabelingbyTaxonomy updated!' });
                                                            }, function (err) {
                                                                Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling by Taxonomy not updated!' });
                                                            });
                                                        } else {
                                                            labelObject.$save(function (res) {
                                                                Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>LabelingbyTaxonomy Saved!' });
                                                            }, function (res) {
                                                                Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling by Taxonomy not Saved!' });
                                                            });
                                                        }
                                                    });
                                                }
                                            } else {
                                                //save taxonomy
                                                if (value.classification == true) {
                                                    var reclassification = value.results;
                                                    console.log(reclassification);
                                                    if (reclassification.length > 0) {
                                                        NewsbytaxonomiesService.query({
                                                            typefetch: 'checking',
                                                            keylabelstudio: value.id,
                                                            labelingtool: vm.labelingbylabelstudio._id,
                                                            newsdaily: newsdaily._id
                                                        }).$promise.then(function (newsbytaxonomies) {
                                                            console.log(newsbytaxonomies);
                                                            /******HANDLE TAXONOMY*/
                                                            var async_variable = 0;
                                                            for (var i = 0; i < reclassification.length; i++) {
                                                                if (reclassification[i].type == "taxonomy") {
                                                                    var taxonomies4completion_check = reclassification[i].value.taxonomy;
                                                                    for (var j = 0; j < taxonomies4completion_check.length; j++) {
                                                                        var taxo_check = taxonomies4completion_check[j];
                                                                        async_variable += taxo_check.length;
                                                                    }
                                                                }
                                                            }
                                                            var index_lastest = 0;
                                                            //
                                                            for (var i = 0; i < reclassification.length; i++) {
                                                                if (reclassification[i].type == "taxonomy") {
                                                                    //console.log(reclassification[i]);
                                                                    var taxonomies4completion = reclassification[i].value.taxonomy;
                                                                    for (var j = 0; j < taxonomies4completion.length; j++) {
                                                                        var taxo = taxonomies4completion[j];
                                                                        for (const [keytaxo, valuetaxo] of Object.entries(taxo)) {
                                                                            TaxonomiesService.query({
                                                                                typefetch: 'checking',
                                                                                taxonomy_name: valuetaxo
                                                                            }).$promise.then(function (rows2Taxonomy) {
                                                                                index_lastest++;
                                                                                if (rows2Taxonomy.length > 0) {
                                                                                    var taxonomyObject = newsbytaxonomies.find(news => news.taxonomy == rows2Taxonomy[0]._id);
                                                                                    //console.log(taxonomyObject);
                                                                                    if (taxonomyObject == undefined) {
                                                                                        taxonomyObject = new NewsbytaxonomiesService();
                                                                                        taxonomyObject.keylabelstudio = value.id;
                                                                                        taxonomyObject.taxonomy = rows2Taxonomy[0]._id;
                                                                                        taxonomyObject.labelingtool = vm.labelingbylabelstudio._id;
                                                                                        taxonomyObject.newsdaily = newsdaily._id;
                                                                                        taxonomyObject.$save(function (res) {
                                                                                            Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>News by Taxonomy Saved!' });
                                                                                        }, function (err) {
                                                                                            Notification.success({ message: '<i class="fa fa- bug" style="color: white;"></i>News by Taxonomy Not Saved!' });
                                                                                        });

                                                                                    } else {
                                                                                        //remove taxonomy in array if exist
                                                                                        var index = newsbytaxonomies.indexOf(taxonomyObject);
                                                                                        if (index > -1) {
                                                                                            newsbytaxonomies.splice(index, 1);
                                                                                        }
                                                                                        if (index_lastest == async_variable) {
                                                                                            for (let ii = 0; ii < newsbytaxonomies.length; ii++) {
                                                                                                newsbytaxonomies[ii].$remove(function (res) {
                                                                                                    Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i>News by Taxonomy deleted!' });
                                                                                                }, function (err) {
                                                                                                    Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i>News by Taxonomy Not Deleted!' });
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                /*********END HANDLE TAXONOMY**********/
                                                                            });
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            //remove all taxonomy
                                                            if (async_variable == 0) {
                                                                for (let ii = 0; ii < newsbytaxonomies.length; ii++) {
                                                                    newsbytaxonomies[ii].$remove(function (res) {
                                                                        Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>News by Taxonomy deleted!' });
                                                                    }, function (err) {
                                                                        Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>News by Taxonomy not deleted!' });
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }, function (err) {
                                Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i>News by Taxonomy Not deleted!' });
                            });
                        }
                    },

                    onUpdateCompletion: function (ls, completion) {
                        if (vm.labelingbylabelstudio._id) {
                            vm.labelingbylabelstudio.completion = JSON.stringify(completion.toJSON());

                            vm.labelingbylabelstudio.$update(function (res) {//save scuccess
                                Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Label-Studio Updated!' });
                                if (vm.removedentries.length > 0) {
                                    LabelingbysentimentsService.removeMany({
                                        removeKey: vm.removedentries,
                                        labelingtool: vm.labelingbylabelstudio._id,
                                        newsdaily: newsdaily._id,
                                    }).$promise.then(function (data) { // need check data and return deleted or not
                                        console.log(data);
                                        vm.removedentries = [];
                                        if (data[0].error.length > 0) {
                                            Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i>Labeling Not Deleted!' });
                                        } else {
                                            Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i>Labeling Deleted!' });
                                        }
                                    });
                                }
                                /***********CODE SAVE ANOTHER TABLES*/
                                completion = completion.toJSON();
                                if (completion != undefined) {
                                    var areas = completion.areas;
                                    var dataInsertOrUpdate = [];
                                    for (const [key, value] of Object.entries(areas)) {
                                        if (value.type != undefined) {
                                            if (value.type == "textrange") {
                                                let temp = new LabelingbysentimentsService();
                                                temp.labelingtool = vm.labelingbylabelstudio._id;
                                                temp.newsdaily = newsdaily._id;
                                                temp.keylabelstudio = key;
                                                temp.start = value.start;
                                                temp.end = value.end;
                                                temp.text = value.text;
                                                temp.user = vm.labelingbylabelstudio.user;
                                                if (value.results.length > 0) {
                                                    for (var i = 0; i < value.results.length; i++) {
                                                        if (value.results[i].type == "labels") {
                                                            var labels = value.results[i].value.labels;
                                                            if (labels.length > 0) {
                                                                for (var j = 0; j < labels.length; j++) {
                                                                    var idvariable = vm.variables.find(v => v.name == labels[j])._id;
                                                                    temp.languagevariables = idvariable;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                dataInsertOrUpdate.push(temp);
                                            }
                                        } else {
                                            if (value.classification == true) {
                                                var reclassification = value.results;
                                                console.log(reclassification);
                                                if (reclassification.length > 0) {
                                                    NewsbytaxonomiesService.query({
                                                        typefetch: 'checking',
                                                        keylabelstudio: value.id,
                                                        labelingtool: vm.labelingbylabelstudio._id,
                                                        newsdaily: newsdaily._id
                                                    }).$promise.then(function (newsbytaxonomies) {
                                                        console.log(newsbytaxonomies);
                                                        /******HANDLE TAXONOMY*/
                                                        var async_variable = 0;
                                                        for (var i = 0; i < reclassification.length; i++) {
                                                            if (reclassification[i].type == "taxonomy") {
                                                                var taxonomies4completion_check = reclassification[i].value.taxonomy;
                                                                for (var j = 0; j < taxonomies4completion_check.length; j++) {
                                                                    var taxo_check = taxonomies4completion_check[j];
                                                                    async_variable += taxo_check.length;
                                                                }
                                                            }
                                                        }
                                                        var index_lastest = 0;
                                                        //
                                                        for (var i = 0; i < reclassification.length; i++) {
                                                            if (reclassification[i].type == "taxonomy") {
                                                                //console.log(reclassification[i]);
                                                                var taxonomies4completion = reclassification[i].value.taxonomy;
                                                                var taxo2Insert = [];
                                                                for (var j = 0; j < taxonomies4completion.length; j++) {
                                                                    var taxo = taxonomies4completion[j];
                                                                    for (const [keytaxo, valuetaxo] of Object.entries(taxo)) {
                                                                        TaxonomiesService.query({
                                                                            typefetch: 'checking',
                                                                            taxonomy_name: valuetaxo
                                                                        }).$promise.then(function (rows2Taxonomy) {
                                                                            index_lastest++;
                                                                            if (rows2Taxonomy.length > 0) {
                                                                                var taxonomyObject = newsbytaxonomies.find(news => news.taxonomy == rows2Taxonomy[0]._id);
                                                                                if (taxonomyObject == undefined) {
                                                                                    taxonomyObject = new NewsbytaxonomiesService();
                                                                                    taxonomyObject.keylabelstudio = value.id;
                                                                                    taxonomyObject.taxonomy = rows2Taxonomy[0]._id;
                                                                                    taxonomyObject.labelingtool = vm.labelingbylabelstudio._id;
                                                                                    taxonomyObject.newsdaily = newsdaily._id;
                                                                                    taxonomyObject.$save(successCallback, errorCallback);
                                                                                    Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>NewsbyTaxonomy Saved!' });
                                                                                } else {
                                                                                    //remove taxonomy in array if exist
                                                                                    var index = newsbytaxonomies.indexOf(taxonomyObject);
                                                                                    if (index > -1) {
                                                                                        newsbytaxonomies.splice(index, 1);
                                                                                    }
                                                                                    if (index_lastest == async_variable) {
                                                                                        for (let ii = 0; ii < newsbytaxonomies.length; ii++) {
                                                                                            newsbytaxonomies[ii].$remove(function (res) {
                                                                                                Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i> News by Taxonomy deleted!' });
                                                                                            }, function (err) {
                                                                                                Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i> News by Taxonomy not deleted!' });
                                                                                            });

                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            /*********END HANDLE TAXONOMY**********/
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        //remove all taxonomy
                                                        if (async_variable == 0) {
                                                            for (let ii = 0; ii < newsbytaxonomies.length; ii++) {
                                                                newsbytaxonomies[ii].$remove(function (res) {
                                                                    Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i> News by Taxonomy deleted!' });
                                                                }, function (err) {
                                                                    Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i> News by Taxonomy not deleted!' });
                                                                });

                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    LabelingbysentimentsService.insertOrUpdate(dataInsertOrUpdate).$promise.then(function (data) {
                                        dataInsertOrUpdate = [];
                                    });;
                                    Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i> Labeling by Taxonomy updated!' });
                                }
                                /*************END CODE**************/
                            }, function (err) {
                                Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i>Label-Studio Not Updated!' });
                            });

                        } else {
                            vm.labelingbylabelstudio.$save(function (res) {
                                Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i> Labeling Saved!' });
                            }, function (err) {
                                Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i> Labeling Saved!' });
                            });

                        }
                    },
                    //   onDeleteCompletion: function (ls, completion) {
                    //     //console.log(completion.results);
                    //     vm.labelingbylabelstudio.$remove(function (res) {
                    //       Notification.error({ message: '<i class="fa fa-check" style="color: white;"></i> Labeling Deleted!' });
                    //     }, function (err) {
                    //       Notification.error({ message: '<i class="fa fa-bug" style="color: white;"></i> Labeling Not Deleted!' });
                    //     });

                    //     //remove label
                    //     LabelingbysentimentsService.checkingEditOrRemove({
                    //       typefetch: 'removedlist',
                    //       labelingtool: vm.labelingbylabelstudio._id,
                    //       newsdaily: newsdaily._id
                    //     }).$promise.then(function (rows) {

                    //       for (let i = 0; i < rows.length; i++) {
                    //         rows[i].$remove();
                    //       }
                    //     });
                    //     //remove taxonomy
                    //     NewsbytaxonomiesService.query({
                    //       typefetch: 'removedlist',
                    //       labelingtool: vm.labelingbylabelstudio._id,
                    //       newsdaily: newsdaily._id
                    //     }).$promise.then(function (rows) {
                    //       for (let i = 0; i < rows.length; i++) {
                    //         rows[i].$remove();
                    //       }
                    //     });
                    //   },

                });

            });

        });


    }
}
    ());
