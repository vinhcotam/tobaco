(function () {
  'use strict';

  // Objectprofiles controller
  angular
    .module('objectprofiles')
    .controller('ObjectprofilesController', ObjectprofilesController);

  ObjectprofilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'objectprofileResolve'];

  function ObjectprofilesController ($scope, $state, $window, Authentication, objectprofile) {
    var vm = this;

    vm.authentication = Authentication;
    vm.objectprofile = objectprofile;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Objectprofile
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.objectprofile.$remove($state.go('objectprofiles.list'));
      }
    }

    // Save Objectprofile
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.objectprofileForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.objectprofile._id) {
        vm.objectprofile.$update(successCallback, errorCallback);
      } else {
        vm.objectprofile.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('objectprofiles.view', {
          objectprofileId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
