(function () {
  'use strict';

  angular
    .module('monitoringobjects')
    .controller('MonitoringobjectsListController', MonitoringobjectsListController);

  MonitoringobjectsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', ' MonitoringobjectsService'];

  function MonitoringobjectsListController($scope, $filter, $state, $window, Authentication, MonitoringobjectsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element === 'admin') {
          vm.isAdmin = true;
        } else if (element === 'manager') {
          vm.isManager = true;
        }
      });
    }

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /* vm.monitoringobjects = MonitoringobjectsService.query(function (data) {
      vm.monitoringobjects = data;
      vm.buildPager();
    }); */
    vm.buildPager();
    MonitoringobjectsService.getTotal().$promise.then(function (number) {
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
        MonitoringobjectsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      MonitoringobjectsService.query(params, function (data) {
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
        var monitoringobject = MonitoringobjectsService.delete({
          monitoringobjectId: id
        });
        window.location.reload();
      }
    }
  }
}());
