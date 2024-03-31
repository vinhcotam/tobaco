(function () {
  'use strict';

  angular
    .module('keyinformants')
    .controller('KeyinformantsListController', KeyinformantsListController);

  KeyinformantsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'KeyinformantsService'];

  function KeyinformantsListController($scope, $filter, $state, $window, Authentication, KeyinformantsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.user = Authentication.user;
    vm.user.roles.forEach(role => {
      if (role === "manager" || role === "admin") {
        vm.manager = true;
        vm.admin = true;
      }
    });
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    // vm.keyinformants = KeyinformantsService.query();
    // vm.keyinformants = KeyinformantsService.query(function (data) {
    //  vm.keyinformants = data;
    //  vm.buildPager();
    // });

    vm.buildPager();
    KeyinformantsService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    function figureOutItemsToDisplay() {
      // vm.filteredItems = $filter('filter')(vm.keyinformants, {
      //  $: vm.search
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
        KeyinformantsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }

      KeyinformantsService.query(params, function (data) {
        // vm.filterLength = data[0].count;
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
        var keyinformant = KeyinformantsService.delete({
          keyinformantId: id
        });
        window.location.reload();
      }
    }
  }
}());
