(function () {
  'use strict';

  angular
    .module('objectprofiles')
    .controller('ObjectprofilesListController', ObjectprofilesListController);

  ObjectprofilesListController.$inject = ['$scope','$filter','$state','$window','Authentication','ObjectprofilesService'];

  function ObjectprofilesListController($scope, $filter, $state, $window, Authentication, ObjectprofilesService) {
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

    ObjectprofilesService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
      console.log(vm.filterLength)
    });


    vm.objectprofiles = ObjectprofilesService.query(function (data) {
      vm.objectprofiles = data;
      vm.buildPager();
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
      if (vm.search != undefined) {
        params.search = vm.search;
        ObjectprofilesService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });
      }
      ObjectprofilesService.query(params, function (data) {
        //vm.filterLength = data[0].count;
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
        var objectprofile = ObjectprofilesService.delete({
          objectprofileId: id
        });
        window.location.reload();
      }
    }
  }
}());
