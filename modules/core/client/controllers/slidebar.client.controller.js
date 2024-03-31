(function () {
  'use strict';

  angular
    .module('core')
    .controller('SlidebarController', SlidebarController);

  SlidebarController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function SlidebarController($scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;

    vm.menu = menuService.getMenu('topbar');

    console.log(vm.menu);

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    // if (vm.authentication.user == null) {

    // }
  }
}());
