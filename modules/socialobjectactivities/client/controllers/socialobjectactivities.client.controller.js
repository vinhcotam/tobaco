(function () {
  'use strict';

  // Socialobjectactivities controller
  angular
    .module('socialobjectactivities')
    .controller('SocialobjectactivitiesController', SocialobjectactivitiesController);

  SocialobjectactivitiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'socialobjectactivityResolve'];

  function SocialobjectactivitiesController ($scope, $state, $window, Authentication, socialobjectactivity) {
    var vm = this;

    vm.authentication = Authentication;
    vm.socialobjectactivity = socialobjectactivity;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Socialobjectactivity
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.socialobjectactivity.$remove($state.go('socialobjectactivities.list'));
      }
    }

    // Save Socialobjectactivity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.socialobjectactivityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.socialobjectactivity._id) {
        vm.socialobjectactivity.$update(successCallback, errorCallback);
      } else {
        vm.socialobjectactivity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('socialobjectactivities.view', {
          socialobjectactivityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
