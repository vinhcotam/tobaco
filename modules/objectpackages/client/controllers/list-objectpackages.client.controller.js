(function () {
  'use strict';

  angular
    .module('objectpackages')
    .controller('ObjectpackagesListController', ObjectpackagesListController);

  ObjectpackagesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'ObjectpackagesService', 'MonitoringobjectsService'];

  function ObjectpackagesListController($scope, $filter, $state, $window, Authentication, ObjectpackagesService, MonitoringobjectsService) {
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
    // vm.objectpackages = ObjectpackagesService.query(function (data) {
    //  vm.objectpackages = data;
    //  vm.buildPager();
    // });
    vm.buildPager();
    ObjectpackagesService.getTotal().$promise.then(function (number) {
      if (number.length > 0) {
        vm.filterLength = number[0].total;
      } else {
        vm.filterLength = 0;
      }
    });
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      // var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      // var end = begin + vm.itemsPerPage;
      // var params = { currentPage: vm.currentPage };
      // if (vm.search != undefined) {
      //  params.search = vm.search;
      // }
      // ObjectpackagesService.query(params, function (data) {
      //  vm.filterLength = data[0].count;
      //  vm.filteredItems = data[0].data;
      //  vm.pagedItems = data[0].data;
      // });
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };

      if (vm.search !== undefined) {
        params.search = vm.search;
        ObjectpackagesService.getTotal(params).$promise.then(function (number) {
          if (number.length > 0) {
            vm.filterLength = number[0].total;
          } else {
            vm.filterLength = 0;
          }
        });

      }

      ObjectpackagesService.query(params, function (data) {
        if (data.length > 0) {
          vm.filterLength = data[0].total;
        } else {
          vm.filterLength = 0;
        }
        vm.filteredItems = data;
        vm.pagedItems = data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var objectpackage = ObjectpackagesService.delete({
          objectpackageId: id
        });
        window.location.reload();
      }
    }

  }
}());
