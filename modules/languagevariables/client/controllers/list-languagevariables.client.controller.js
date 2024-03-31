(function () {
  'use strict';

  angular
    .module('languagevariables')
    .controller('LanguagevariablesListController', LanguagevariablesListController);

  LanguagevariablesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'LanguagevariablesService'];

  function LanguagevariablesListController($scope, $filter, $state, $window, Authentication, LanguagevariablesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    // vm.languagevariables = LanguagevariablesService.query();
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /* vm.variables = LanguagevariablesService.query(function (data) {
      vm.variables = data;
      vm.buildPager();
    });*/
    vm.buildPager();
    LanguagevariablesService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      /* vm.filteredItems = $filter('filter')(vm.variables, {
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
        LanguagevariablesService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      LanguagevariablesService.query(params, function (data) {
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
        var languagevariable = LanguagevariablesService.delete({
          languagevariableId: id
        });
        window.location.reload();
      }
    }
  }
}());
