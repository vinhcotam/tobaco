(function () {
  'use strict';

  angular
    .module('webcategories')
    .controller('WebcategoriesListController', WebcategoriesListController);

  WebcategoriesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'WebcategoriesService'];

  function WebcategoriesListController($scope, $filter, $state, $window, Authentication, WebcategoriesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.webcategories = WebcategoriesService.query(function (data) {
      vm.webcategories = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 2;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };
      if (vm.search !== undefined) {
        params.search = vm.search;
      }
      WebcategoriesService.query(params, function (data) {
        vm.filterLength = data[0].count;
        vm.filteredItems = data[0].data;
        vm.pagedItems = data[0].data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var webcategory = WebcategoriesService.delete({
          webcategoryId: id
        });
        window.location.reload();
      }
    }
  }
}());
