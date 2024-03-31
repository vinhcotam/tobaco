(function () {
  'use strict';

  // Languagevariables controller
  angular
    .module('languagevariables')
    .controller('LanguagevariablesController', LanguagevariablesController);

  LanguagevariablesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'languagevariableResolve', 'TopicsService'];

  function LanguagevariablesController($scope, $state, $window, Authentication, languagevariable, TopicsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.languagevariable = languagevariable;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;
    // Remove existing Languagevariable
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.languagevariable.$remove($state.go('languagevariables.list'));
      }
    }

    // Save Languagevariable
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.languagevariableForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.languagevariable._id) {
        vm.languagevariable.$update(successCallback, errorCallback);
      } else {
        vm.languagevariable.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('languagevariables.view', {
          languagevariableId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
