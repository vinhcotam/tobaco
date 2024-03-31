(function () {
  'use strict';

  angular
    .module('labelingbytaxonomies')
    .controller('LabelingbytaxonomiesListController', LabelingbytaxonomiesListController);

  LabelingbytaxonomiesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'LabelingbytaxonomiesService'];

  function LabelingbytaxonomiesListController($scope, $filter, $state, $window, Authentication, LabelingbytaxonomiesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.authentication = Authentication;

    // vm.labelingbytaxonomies = LabelingbytaxonomiesService.query();
    /* vm.labelingbytaxonomies = LabelingbytaxonomiesService.query({ currentPage: 1}, function (data) {
      vm.labelingbytaxonomies = data[0].data;
      //vm.filterLength = data[0].count;
      vm.buildPager();
    });*/

    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element === 'admin') {
          vm.isAdmin = true;
        } else if (element === 'manager') {
          vm.isManager = true;
        } else {
          vm.isUser = true;
        }
      });
    }

    vm.buildPager();
    LabelingbytaxonomiesService.getTotal().$promise.then(function (number) {
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
      // vm.filteredItems = $filter('filter')(vm.labelingbytaxonomies, {
      // $: vm.search
      // });
      // vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      // vm.pagedItems = vm.filteredItems.slice(begin, end);
      // console.log(vm.pagedItems.slice(-1)[0]._id)
      var params = {
        currentPage: vm.currentPage
        // lastId: vm.pagedItems.slice(-1)[0] ? vm.pagedItems.slice(-1)[0]._id : null
      };
      if (vm.search !== undefined) {
        params.search = vm.search;
        LabelingbytaxonomiesService.getTotal(params).$promise.then(function (number) {
          if (number.length > 0) {
            vm.filterLength = number[0].total;
          } else {
            vm.filterLength = 0;
          }
        });
      }

      vm.labelingbytaxonomies = LabelingbytaxonomiesService.query(params, function (data) {
        // vm.filterLength = data[0].count;
        vm.filteredItems = data[0].data;
        vm.pagedItems = data[0].data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var labelingbytaxonomy = LabelingbytaxonomiesService.delete({
          labelingbytaxonomyId: id
        });
        window.location.reload();
      }
    }
    $('#btn_export').click(function () {
      window.open('/api/labelingbytaxonomies/export');
    });
  }
}());
