(function () {
  'use strict';

  angular
    .module('newsgroups')
    .controller('NewsgroupsListController', NewsgroupsListController);

  NewsgroupsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsgroupsService', 'TopicsService'];

  function NewsgroupsListController($scope, $filter, $state, $window, Authentication, NewsgroupsService, TopicsService) {
    //var vm = this;

    //vm.newsgroups = NewsgroupsService.query();
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /*vm.newsgroups = NewsgroupsService.query(function (data) {
      vm.newsgroups = data;
      vm.buildPager();
    });*/
    vm.buildPager();
    NewsgroupsService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });
    //console.log(vm.keywords);

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      /*vm.filteredItems = $filter('filter')(vm.newsgroups, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);*/
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };

      if (vm.search != undefined) {
        params.search = vm.search;
        NewsgroupsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      NewsgroupsService.query(params, function (data) {
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
        var newsgroup = NewsgroupsService.delete({
          newsgroupId: id
        });
        window.location.reload();
      }
    }
  }
}());
