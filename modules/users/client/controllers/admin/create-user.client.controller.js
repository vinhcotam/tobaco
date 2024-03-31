(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'AdminService'];

  function CreateUserController($scope, $state, $window, Authentication, user, Notification, AdminService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = user;
    vm.isContextUserSelf = isContextUserSelf;
    vm.save = save;
    AdminService.query(function (data) {
      vm.ls_users = data;
    });
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      var user = vm.user;
      user.provider = 'local';
      console.log(vm.user);
      user.$save(function () {
        $state.go('admin.users');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User saved error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
