(function () {
  'use strict';

  angular
    .module('core')
    .controller('BreadcrumbController', BreadcrumbController);

  BreadcrumbController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function BreadcrumbController($scope, $state, Authentication, menuService) {
    var topics = Authentication.user.topics;
    var vm = this;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.breadcrumbtitle = "Dashboard";

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
      var list_name = $state.current.name.split('.');
      console.log(list_name);
      var str = '';
      str = '<li class="breadcrumb-item"><a href="/">Home</a></li>';
      if (list_name.length > 1) {
        str += '<li class="breadcrumb-item"><a href="/' + list_name[0] + '">' + list_name[0] + '</a></li>';
        str += '<li class="breadcrumb-item active">' + list_name[1] + '</li>';
      }
      $('#ol-breadcrumb').empty();
      $('#ol-breadcrumb').append(str);

      if (typeof ($state.current.data) !== undefined) {
        if (list_name.length > 1) {
          // $('#breadcrumb-title').text($state.current.data.pageTitle);
          var working_topic = " ";
          topics.forEach(topic => {
            if (topic.working_status === 1) {
              working_topic += topic.topic.topic_name;
            }
          });
          // $('#breadcrumb-title').text("" + working_topic);
          vm.breadcrumbtitle = working_topic;
          $('#li-active').text($state.current.data.pageTitle);
        } else {
          // $('#breadcrumb-title').text('Dashboard')
          vm.breadcrumbtitle = "Dashboard";
        }
      }
    }
    // if (vm.authentication.user == null) {
    // }
  }
}());
