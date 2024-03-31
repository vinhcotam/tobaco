(function () {
  'use strict';

  // Activitylogs controller
  angular
    .module('activitylogs')
    .controller('ActivitylogsController', ActivitylogsController);

  ActivitylogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'activitylogResolve'];

  function ActivitylogsController($scope, $state, $window, Authentication, activitylog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.activitylog = activitylog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Activitylog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.activitylog.$remove($state.go('activitylogs.list'));
      }
    }

    // Save Activitylog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.activitylogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.activitylog._id) {
        vm.activitylog.$update(successCallback, errorCallback);
      } else {
        vm.activitylog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('activitylogs.view', {
          activitylogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
