(function () {
  'use strict';

  angular
    .module('activitylogs')
    .controller('ActivitylogsListController', ActivitylogsListController);

  ActivitylogsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'ActivitylogsService'];

  function ActivitylogsListController($scope, $filter, $state, $window, Authentication, ActivitylogsService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    // vm.activitylogs = ActivitylogsService.query(function (data) {
    //  vm.activitylogs = data;
    //  vm.buildPager();
    // });
    vm.buildPager();
    ActivitylogsService.getTotal().$promise.then(function (number) {
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
        ActivitylogsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });
      }
      ActivitylogsService.query(params, function (data) {
        // vm.filterLength = data[0].count;
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
        var activitylog = ActivitylogsService.delete({
          activitylogId: id
        });
        window.location.reload();
      }
    }
  }
}());
