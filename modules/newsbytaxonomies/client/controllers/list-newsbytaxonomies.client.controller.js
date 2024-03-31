(function () {
  'use strict';

  angular
    .module('newsbytaxonomies')
    .controller('NewsbytaxonomiesListController', NewsbytaxonomiesListController);

  NewsbytaxonomiesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsbytaxonomiesService'];

  function NewsbytaxonomiesListController($scope, $filter, $state, $window, Authentication, NewsbytaxonomiesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element == 'admin') {
          vm.isAdmin = true;
        } else if (element == 'manager') {
          vm.isManager = true;
        }
      });
    }
    vm.assignedtopics =
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /*vm.newsbytaxonomies = NewsbytaxonomiesService.query(function (data) {
      console.log(data);
      vm.newsbytaxonomies = data;
      vm.buildPager();
    });*/
    vm.buildPager();
    NewsbytaxonomiesService.getTotal().$promise.then(function (number) {
      if (number.length > 0) {
        vm.filterLength = number[0].total;
      } else {
        vm.filterLength = 0
      }
    });
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    function figureOutItemsToDisplay() {
      /*vm.filteredItems = $filter('filter')(vm.newsbytaxonomies, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);*/
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      //vm.pagedItems = vm.filteredItems.slice(begin, end);

      var params = { currentPage: vm.currentPage };
      if (vm.search != undefined) {
        params.search = vm.search;
        NewsbytaxonomiesService.getTotal(params).$promise.then(function (number) {
          if (number.length > 0) {
            vm.filterLength = number[0].total;
          } else {
            vm.filterLength = 0
          }
        });
      }

      vm.newsbytaxonomies = NewsbytaxonomiesService.query(params, function (data) {
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
        var Newsbytaxonomy = NewsbytaxonomiesService.delete({
          newsbytaxonomyId: id
        });
        window.location.reload();
      }
    }
    $('#btn_export_excel').click(function () {
      window.open('/api/newsbytaxonomies/export2excel')
    })
  }
}());
