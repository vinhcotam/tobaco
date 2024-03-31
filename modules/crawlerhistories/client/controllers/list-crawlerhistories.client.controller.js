(function () {
  'use strict';

  angular
    .module('crawlerhistories')
    .controller('CrawlerhistoriesListController', CrawlerhistoriesListController);

  CrawlerhistoriesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CrawlerhistoriesService'];

  function CrawlerhistoriesListController($scope, $filter, $state, $window, Authentication, CrawlerhistoriesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.crawlerhistories = CrawlerhistoriesService.query(function (data) {
      vm.crawlerhistories = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 2;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      // vm.filteredItems = $filter('filter')(vm.crawlerhistories, {
      //   $: vm.search
      // });
      // vm.filterLength = vm.filteredItems.length;
      // var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      // var end = begin + vm.itemsPerPage;
      // vm.pagedItems = vm.filteredItems.slice(begin, end);
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };
      if (vm.search !== undefined) {
        params.search = vm.search;
      }
      CrawlerhistoriesService.query(params, function (data) {
        vm.filterLength = data[0].count;
        vm.filteredItems = data[0].data;
        vm.pagedItems = data[0].data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var crawlerhistory = CrawlerhistoriesService.delete({
          crawlerhistoryId: id
        });
        window.location.reload();
      }
    }
  }
}());
