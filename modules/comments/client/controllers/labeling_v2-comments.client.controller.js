
(function () {
    'use strict';

    angular
        .module('comments')
        .controller('Labelingv2commentsController', Labelingv2commentsController);

    Labelingv2commentsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams', 
        '$http', 'SentimentsService', 'Notification'
    ];

    function Labelingv2commentsController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, $http, SentimentsService, Notification) {
        var vm = this;
        vm.authentication = Authentication;
        if (vm.authentication.user == null) {
            window.location.href = '/authentication/signin';
        }
        var newsId = $stateParams.newsId;
        var newsTitle = $stateParams.newsTitle
        var newsSummary = $stateParams.newsSummary
         
        vm.newsId = newsId
        console.log("aaab", vm.newsId)
        vm.newsTitle = newsTitle
        vm.newsSummary = newsSummary
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        vm.buildPager();
        var promise = CommentsService.getTotal().$promise;
        promise.then(function (number) {
            vm.filterLength = number[0];
            vm.totalPages = Math.ceil(vm.filterLength / vm.itemsPerPage);
        });
        if (typeof newsId !== 'undefined') {
            promise = CommentsService.getTotal({ newsId: newsId }).$promise;

        }
        promise.then(function (number) {
            vm.filterLength = number[0];
        });
        //update label
        vm.confirmLabeling = function (){
            console.log(vm.comments);
            var updatePromises = [];
        
            vm.comments.forEach(function(element) {
                updatePromises.push(CommentsService.update(element).$promise);
                console.log("print");
            });
        
            Promise.all(updatePromises)
                .then(function(results) {
                    console.log("All comments have been updated:", results);
                    Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Labeling Updated!' });
                })
                .catch(function(error) {
                    console.error("Error updating comments:", error);
                    Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling Not Updated!' });
                });
        };

        

        vm.newsId = $stateParams.newsId;
        // auto labeling
        vm.autoLabeling = function () {
            console.log("print", vm.newsId)
            var apiUrl = 'http://localhost:5000/sentiment';
            var url = apiUrl + '?newsId=' + vm.newsId;
            console.log("print_url", url)
            $http.post(url)
                .then(function (response) {
                    console.log(response);
                    vm.figureOutItemsToDisplay();
                })
                .catch(function (error) {
                    console.error(error);
                })
        }
        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }
        
        function figureOutItemsToDisplay() {
            var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
            var end = begin + vm.itemsPerPage;
            var params = { currentPage: vm.currentPage };

            if (vm.search !== undefined) {
                params.search = vm.search;
                CommentsService.getTotal(params).$promise.then(function (number) {
                    vm.filterLength = number[0];
                    vm.totalPages = Math.ceil(vm.filterLength / vm.itemsPerPage);
                });
            }
            if (angular.isDefined(newsId)) {
                params.newsId = newsId;
            }
            CommentsService.query(params, function (data) {
                vm.filteredItems = data;
                vm.pagedItems = data;
                CommentsService.query(params, function (data) {
                    vm.filteredItems = data;
                    vm.pagedItems = data;
                    vm.comments = data
                    SentimentsService.query(function (sentiments) {
                      vm.sentiments = sentiments;
                      data.forEach(function(element) {
                        if (!element.hasOwnProperty('sentiment_researcher')) {
                            element.sentiment_researcher = element.sentiment_ai;
                            element.researcher_score = element.score_ai
                        }
                    });
                    
                      vm.getSentimentName = function(sentimentId) {
                        for (var i = 0; i < vm.sentiments.length; i++) {
                          if (vm.sentiments[i]._id === sentimentId) {
                            return vm.sentiments[i].name;
                          }
                        }
                        return '';
                      };
                    });
                  
                    
                  });
                
                
            });
        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }

    }
}());