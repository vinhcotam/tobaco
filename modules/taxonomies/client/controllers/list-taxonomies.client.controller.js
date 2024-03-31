(function () {
  'use strict';

  angular
    .module('taxonomies')
    .controller('TaxonomiesListController', TaxonomiesListController);

  TaxonomiesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'TaxonomiesService', 'TopicsService'];

  function TaxonomiesListController($scope, $filter, $state, $window, Authentication, TaxonomiesService, TopicsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.taxonomies = TaxonomiesService.query({}, function (data) {
      vm.taxonomies = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.taxonomies, {
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
        var topic = TaxonomiesService.delete({
          taxonomyId: id
        });
        window.location.reload();
      }
    }
  }
}());
