(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams', 'SentimentsService'];

  function CommentsListController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, SentimentsService) {
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
          console.log("abcdscas:::", params);
          console.log("abcdscas:::", data);
          SentimentsService.query(function (sentiments) {
            vm.sentiments = sentiments;
            vm.getSentimentName = function(sentimentId) {
              for (var i = 0; i < vm.sentiments.length; i++) {
                if (vm.sentiments[i]._id === sentimentId) {
                  return vm.sentiments[i].name;
                }
              }
              return '';
            };
          });
          data.forEach(element => {
            if (element.sentiment_researcher === "") {
                element.sentiment_researcher = element.sentiment_ai;
                element.defaultSentiment = element.sentiment_ai; 
            } else {
                element.defaultSentiment = element.sentiment_researcher;
            }
        });
        
        });
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());