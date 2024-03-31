(function () {
  'use strict';

  // Topics controller
  angular
    .module('topics')
    .controller('TopicsController', TopicsController);

  TopicsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'topicResolve', 'AdminService'];

  function TopicsController($scope, $state, $window, Authentication, topic, AdminService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.topic = topic;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    console.log(vm.authentication);

    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element === 'admin') {
          vm.isAdmin = true;
          AdminService.query(function (data) {
            vm.ls_users = data;
          });
        }
      });
    }

    // Remove existing Topic
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.topic.$remove($state.go('topics.list'));
      }
    }

    // Save Topic
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.topicForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.topic._id) {
        vm.topic.$update(successCallback, errorCallback);
      } else {
        vm.topic.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('topics.view', {
          topicId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
