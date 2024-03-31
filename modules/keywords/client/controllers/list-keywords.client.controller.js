(function () {
  'use strict';

  angular
    .module('keywords')
    .controller('KeywordsListController', KeywordsListController);

  KeywordsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'KeywordsService', 'TopicsService'];

  function KeywordsListController($scope, $filter, $state, $window, Authentication, KeywordsService, TopicsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /* vm.keywords = KeywordsService.query(function (data) {
      vm.keywords = data;
      vm.buildPager();
    });*/
    vm.buildPager();
    KeywordsService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });
    // console.log(vm.keywords);

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      /* vm.filteredItems = $filter('filter')(vm.keywords, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);*/
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };

      if (vm.search !== undefined) {
        params.search = vm.search;
        KeywordsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      KeywordsService.query(params, function (data) {
        vm.filteredItems = data;
        vm.pagedItems = data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var keyword = KeywordsService.delete({
          keywordId: id
        });
        window.location.reload();
      }
    }
  }
}());
