(function () {
  'use strict';

  // Keyinformants controller
  angular
    .module('keyinformants')
    .controller('KeyinformantsController', KeyinformantsController);

  KeyinformantsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'keyinformantResolve'];

  function KeyinformantsController($scope, $state, $window, Authentication, keyinformant) {
    var vm = this;

    vm.authentication = Authentication;
    if (vm.authentication.user === null) {
      window.location.href = '/authentication/signin';
    }
    vm.keyinformant = keyinformant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = Authentication.user;
    vm.topics = [];

    vm.user.topics.forEach(function (element, index) {
      if (element.working_status === 1) {
        vm.topics.push(element);
      }
    });
    // Remove existing Keyinformant
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.keyinformant.$remove($state.go('keyinformants.list'));
      }
    }

    // Save Keyinformant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.keyinformantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.keyinformant._id) {
        vm.keyinformant.$update(successCallback, errorCallback);
      } else {
        vm.keyinformant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('keyinformants.view', {
          keyinformantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
