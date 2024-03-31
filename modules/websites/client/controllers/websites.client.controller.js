(function () {
  'use strict';

  // Websites controller
  angular
    .module('websites')
    .controller('WebsitesController', WebsitesController);

  WebsitesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'websiteResolve'];

  function WebsitesController($scope, $state, $window, Authentication, website) {
    var vm = this;

    vm.authentication = Authentication;
    vm.website = website;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.topics = vm.authentication.user.topics;


    // Remove existing Website
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.website.$remove($state.go('websites.list'));
      }
    }

    // Save Website
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.websiteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.website._id) {
        vm.website.$update(successCallback, errorCallback);
      } else {
        vm.website.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('websites.list', {
          websiteId: res._id
        });
        /* $state.go('websites.view', {
          websiteId: res._id
        });*/
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
