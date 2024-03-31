(function () {
  'use strict';

  // Objectpackages controller
  angular
    .module('objectpackages')
    .controller('ObjectpackagesController', ObjectpackagesController);

  ObjectpackagesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'objectpackageResolve', 'SocialcrawlerconfigsService'];

  function ObjectpackagesController($scope, $state, $window, Authentication, objectpackage, SocialcrawlerconfigsService) {
    var vm = this;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    vm.authentication = Authentication;
    vm.objectpackage = objectpackage;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    SocialcrawlerconfigsService.query(function (data) {
      vm.scconfigs = data[0].data;
    });

    // Remove existing Objectpackage
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.objectpackage.$remove($state.go('objectpackages.list'));
      }
    }

    // Save Objectpackage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.objectpackageForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.objectpackage._id) {
        vm.objectpackage.$update(successCallback, errorCallback);
      } else {
        vm.objectpackage.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('objectpackages.view', {
          objectpackageId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
