(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams'];

  function CommentsListController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    var newsId = $stateParams.newsId;
    var newsTitle = $stateParams.newsTitle
    var newsSummary = $stateParams.newsSummary
    console.log("Aa", newsTitle)
    vm.newsTitle = newsTitle
    vm.newsSummary = newsSummary
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    // vm.remove = remove;
    vm.buildPager();
    var promise = CommentsService.getTotal().$promise;
    promise.then(function (number) {
      vm.filterLength = number[0];
    });
    if (typeof newsId !== 'undefined') {
      promise = CommentsService.getTotal({ newsId: newsId }).$promise;
    }

    promise.then(function (number) {
      vm.filterLength = number[0];
    });

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
        });

      }
      if (angular.isDefined(newsId)) {
        params.newsId = newsId;
      }
      CommentsService.query(params, function (data) {
        vm.filteredItems = data;
        vm.pagedItems = data;
        console.log("dataaa", data[0])
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var comment = CommentsService.delete({
          commentId: id
        });
        window.location.reload();
      }
    }
  }
}());