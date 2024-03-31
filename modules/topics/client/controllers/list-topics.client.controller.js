(function () {
  'use strict';

  angular
    .module('topics')
    .controller('TopicsListController', TopicsListController);

  TopicsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'TopicsService'];

  function TopicsListController($scope, $filter, $state, $window, Authentication, TopicsService) {
    var vm = this;
    vm.user = Authentication.user;
    if (vm.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.user.roles.forEach(role => {
      if (role === "manager" || role === "admin") {
        vm.manager = true;
        vm.admin = true;
      }
    });

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.topics = TopicsService.query(function (data) {
      vm.topics = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.topics, {
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
        var topic = TopicsService.delete({
          topicId: id
        });
        window.location.reload();
      }
    }
  }
}());
