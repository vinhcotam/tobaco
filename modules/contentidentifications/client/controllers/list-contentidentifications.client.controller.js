(function () {
  'use strict';

  angular
    .module('contentidentifications')
    .controller('ContentidentificationsListController', ContentidentificationsListController);

  ContentidentificationsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'ContentidentificationsService'];

  function ContentidentificationsListController($scope, $filter, $state, $window, Authentication, ContentidentificationsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    vm.contentidentifications = ContentidentificationsService.query(function (data) {
      vm.contentidentifications = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 2;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.contentidentifications, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var topic = ContentidentificationsService.delete({
          contentidentificationId: id
        });
        window.location.reload();
      }
    }
  }
}());
