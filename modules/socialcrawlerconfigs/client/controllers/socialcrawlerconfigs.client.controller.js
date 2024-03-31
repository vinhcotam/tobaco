(function () {
  'use strict';

  // Socialcrawlerconfigs controller
  angular
    .module('socialcrawlerconfigs')
    .controller('SocialcrawlerconfigsController', SocialcrawlerconfigsController);

  SocialcrawlerconfigsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'socialcrawlerconfigResolve', 'TopicsService'];

  function SocialcrawlerconfigsController($scope, $state, $window, Authentication, socialcrawlerconfig, TopicsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.socialcrawlerconfig = socialcrawlerconfig;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;

    // Remove existing Socialcrawlerconfig
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.socialcrawlerconfig.$remove($state.go('socialcrawlerconfigs.list'));
      }
    }

    // Save Socialcrawlerconfig
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.socialcrawlerconfigForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.socialcrawlerconfig._id) {
        vm.socialcrawlerconfig.$update(successCallback, errorCallback);
      } else {
        vm.socialcrawlerconfig.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('socialcrawlerconfigs.view', {
          socialcrawlerconfigId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
