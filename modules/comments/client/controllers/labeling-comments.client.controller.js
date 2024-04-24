(function () {
    'use strict';
    // Comments controller
    angular
        .module('comments')
        .controller('LabelingcommentsController', LabelingcommentsController);

        LabelingcommentsController.$inject = ['$scope', '$sce', '$state', '$window', 'Authentication', 'commentResolve', 'SentimentsService', 'LabelingbylabelstudiosService', 'Notification'];

    function LabelingcommentsController($scope, $sce, $state, $window, Authentication, comment, SentimentsService, LabelingbylabelstudiosService, Notification) {
        var vm = this;
        // vm.newsId = $stateParams.newsId;
        // console.log("vm.newsId:", vm.newsId);
        vm.newsId = $stateParams.newsId;
        console.log("LabelingcommentsController called");
        vm.authentication = Authentication;
        //redirect
        if (vm.authentication.user == null) {
            window.location.href = '/authentication/signin';
        }
        // SentimentsService.query(params, function (data) {
        //     vm.sentiments = data;
        // });
        // LabelingbylabelstudiosService.query({ comment: comment._id }).$promise.then(function (labelingbylabelstudio) {

        //     if (labelingbylabelstudio.length > 0) {
        //         vm.labelingbylabelstudio = labelingbylabelstudio[0];
        //     } else {
        //         vm.labelingbylabelstudio = new LabelingbylabelstudiosService();
        //     }
        // });
        // vm.removedentries = [];//remove entries
        // vm.labelingbylabelstudio = new LabelingbylabelstudiosService();
        // // vm.newsbytaxonomies = null;

        // //need check topic is null or undefined
        // SentimentsService.query().$promise.then(function (sentiments) {
        //     console.log(sentiments);
        //     sentiments.forEach(function (sentiment) {
        //         var choice = `<View>
        //         <Labels name="ner" toName="text">`;
        //         vm.sentiments.forEach(function (sentiment) {
        //             choice += '<Label value="' + sentiment._id + '">' + sentiment.name + '</Label>';
        //         });
        //         choice += `</Labels>
        //         <Text name="text" value="$text"></Text>`;

        //         choice += `<Sentiment name="sentiment" toName="text">`;
        //         // choice += OBJtoXML(tree);//BFS(tree));
        //         choice += `</Sentiment>`;

        //         choice += '</View>';
        //         console.log("---------------------")
        //         console.log(choice);
        //         var labelStudio = new LabelStudio('label-studio', {
        //             config: choice,
        //             interfaces: [
        //                 "panel",
        //                 //"update",
        //                 "controls",
        //                 "side-column",
        //                 "completions:menu",
        //                 "completions:add-new",
        //                 "completions:delete",
        //                 //"predictions:menu",
        //             ],

        //             user: {
        //                 //pk: newsdaily._id,
        //                 firstName: Authentication.firstName,
        //                 lastName: Authentication.lastName
        //             },
        //             task: {
        //                 id: 1,
        //                 data: {
        //                     text: newsdaily.npl_content
        //                 }
        //             },

        //             onLabelStudioLoad: function (LS) {
        //                 var c = LS.completionStore.addCompletion({
        //                     userGenerate: true
        //                 });
        //                 LS.completionStore.selectCompletion(c.id);
        //                 if (vm.labelingbylabelstudio._id) {
        //                     var completion = {};
        //                     try {
        //                         completion = JSON.parse(vm.labelingbylabelstudio.completion);
        //                         //console.log(typeof completion);
        //                         if (typeof completion !== 'object') {
        //                             completion = JSON.parse(completion);
        //                         }
        //                     } catch (err) {
        //                         alert('Error load data from server!')
        //                     }
        //                     //*end code*/
        //                     //delete completion.highlightedNode;
        //                     //delete completion
        //                     LS.completionStore.addCompletion(completion);
        //                     try {
        //                         LS.completionStore.selectCompletion(completion.id);
        //                     } catch (err) {
        //                         console.log(err);
        //                         console.log(LS);
        //                         delete completion.area;
        //                     }

        //                 }
        //             },


        //         });

        //     });
        // });

        // function successCallback(res) {
        // }

        // function errorCallback(res) {
        //     vm.error = res.data.message;
        // }



        // jQuery(document).ready(function ($) {
        //     //
        // });
    }
}
    ());
