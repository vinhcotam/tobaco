(function () {
  'use strict';

  // Monitoringtypes controller
  angular
    .module('monitoringtypes')
    .controller('MonitoringtypesController', MonitoringtypesController);

  MonitoringtypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'monitoringtypeResolve'];

  function MonitoringtypesController ($scope, $state, $window, Authentication, monitoringtype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.monitoringtype = monitoringtype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Monitoringtype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.monitoringtype.$remove($state.go('monitoringtypes.list'));
      }
    }

    // Save Monitoringtype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.monitoringtypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.monitoringtype._id) {
        vm.monitoringtype.$update(successCallback, errorCallback);
      } else {
        vm.monitoringtype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('monitoringtypes.view', {
          monitoringtypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
