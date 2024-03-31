(function () {
  'use strict';

  // Labelingbylabelstudios controller
  angular
    .module('labelingbylabelstudios')
    .controller('LabelingbylabelstudiosController', LabelingbylabelstudiosController);

  LabelingbylabelstudiosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'labelingbylabelstudioResolve'];

  function LabelingbylabelstudiosController($scope, $state, $window, Authentication, labelingbylabelstudio) {
    var vm = this;

    vm.authentication = Authentication;
    vm.labelingbylabelstudio = labelingbylabelstudio;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Labelingbylabelstudio
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.labelingbylabelstudio.$remove($state.go('labelingbylabelstudios.list'));
      }
    }

    // Save Labelingbylabelstudio
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.labelingbylabelstudioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.labelingbylabelstudio._id) {
        vm.labelingbylabelstudio.$update(successCallback, errorCallback);
      } else {
        vm.labelingbylabelstudio.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('labelingbylabelstudios.view', {
          labelingbylabelstudioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
