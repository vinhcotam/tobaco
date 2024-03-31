(function () {
  'use strict';

  angular
    .module('newsprivates')
    .controller('NewsprivatesListController', NewsprivatesListController);

  NewsprivatesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsprivatesService'];

  function NewsprivatesListController($scope, $filter, $state, $window, Authentication, NewsprivatesService) {
    var vm = this;

    vm.user = Authentication.user;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.user.roles.forEach(role => {
      if (role == "manager" || role == "admin") {
        vm.manager = true;
        vm.admin = true;
      }
    });

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    //vm.newsprivates = NewsprivatesService.query();
    //vm.newsprivates = NewsprivatesService.query(function (data) {
    //  vm.newsprivates = data;
    //  vm.buildPager();
    //});
    vm.buildPager();
    NewsprivatesService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    function figureOutItemsToDisplay() {
      //vm.filteredItems = $filter('filter')(vm.newsprivates, {
      //  $: vm.search
      //});
      //vm.filterLength = vm.filteredItems.length;
      //var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      //var end = begin + vm.itemsPerPage;
      //vm.pagedItems = vm.filteredItems.slice(begin, end);
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };

      if (vm.search != undefined) {
        params.search = vm.search;
        NewsprivatesService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }

      NewsprivatesService.query(params, function (data) {
        //vm.filterLength = data[0].count;
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
        var newsprivate = NewsprivatesService.delete({
          newsprivateId: id
        });
        window.location.reload();
      }
    }
  }
}());
