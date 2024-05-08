(function () {
    'use strict';

    angular
        .module('comments')
        .controller('Labelingv2commentsController', Labelingv2commentsController);

    Labelingv2commentsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams', 
        '$http', 'SentimentsService'
    ];

    function Labelingv2commentsController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, $http, SentimentsService) {
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
        vm.goToLabel = function (newsId) {
            console.log("print", vm.newsId)
            $state.go('comments.labeling', { newsId: vm.newsId });

        };
        vm.goToLabeling = function (newsId) {
            console.log("print", vm.newsId)
            $state.go('comments.labeling_v2', { newsId: vm.newsId });

        };
        

        vm.newsId = $stateParams.newsId;
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
                    SentimentsService.query(function (sentiments) {
                      vm.sentiments = sentiments;
                      data.forEach(function(element) {
                        if (!element.hasOwnProperty('sentiment_researcher')) {
                            element.sentiment_researcher = element.sentiment_ai;
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