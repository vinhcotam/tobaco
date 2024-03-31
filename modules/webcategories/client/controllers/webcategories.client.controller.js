(function () {
  'use strict';

  // Webcategories controller
  angular
    .module('webcategories')
    .controller('WebcategoriesController', WebcategoriesController);

  WebcategoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'webcategoryResolve'];

  function WebcategoriesController($scope, $state, $window, Authentication, webcategory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.webcategory = webcategory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Webcategory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.webcategory.$remove($state.go('webcategories.list'));
      }
    }

    // Save Webcategory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.webcategoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.webcategory._id) {
        vm.webcategory.$update(successCallback, errorCallback);
      } else {
        vm.webcategory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('webcategories.view', {
          webcategoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
