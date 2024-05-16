(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams', 'SentimentsService', 'NewsdailiesService'];

  function CommentsListController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, SentimentsService, NewsdailiesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    var newsId = $stateParams.newsId;
    vm.newsId = newsId
    NewsdailiesService.get({ newsdailyId: vm.newsId }, function (data) {
      vm.newsTitle = data.news_title
      vm.newsSummary = data.news_summary
    });
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.buildPager();
    vm.goToLabel = function (newsId) {
      $state.go('comments.labeling', { newsId: vm.newsId });

    };
    vm.goToLabeling = function (newsId) {
      $state.go('comments.labeling_v2', { newsId: vm.newsId });

    };
    vm.goToNews = function(){
      $state.go('newsdailies.view', {newsdailyId: vm.newsId});
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
          console.log(vm.totalPages)
        });
      }
      if (angular.isDefined(newsId)) {
        params.newsId = newsId;
      }
      CommentsService.query(params, function (data) {
        vm.filteredItems = data;
        vm.pagedItems = data;
        SentimentsService.query(function (sentiments) {
          vm.sentiments = sentiments;
          data.forEach(function (element) {
            if (!element.hasOwnProperty('sentiment_researcher')) {
              element.sentiment_researcher = element.sentiment_ai;
            }
          });

          vm.getSentimentName = function (sentimentId) {
            for (var i = 0; i < vm.sentiments.length; i++) {
              if (vm.sentiments[i]._id === sentimentId) {
                return vm.sentiments[i].name;
              }
            }
            return '';
          };
          vm.getSentimentBackgroundColor = function (sentimentId) {
            for (var i = 0; i < vm.sentiments.length; i++) {
                if (vm.sentiments[i]._id === sentimentId) {
                    if (vm.sentiments[i].name === 'positive') {
                        return '#45AA16'; 
                    } else if (vm.sentiments[i].name === 'negative') {
                        return '#D30000'; 
                    }else{
                      return '#FFD467';
                    }
                }
            }
            return ''; 
        };
        });
      });
    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());