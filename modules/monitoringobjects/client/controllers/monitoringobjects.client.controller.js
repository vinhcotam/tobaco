(function () {
  'use strict';

  // Monitoringobjects controller
  angular
    .module('monitoringobjects')
    .controller('MonitoringobjectsController', MonitoringobjectsController);

  MonitoringobjectsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'monitoringobjectResolve', 'TopicsService', 'SocialcrawlerconfigsService', 'MonitoringtypesService'];

  function MonitoringobjectsController($scope, $state, $window, Authentication, monitoringobject, TopicsService, SocialcrawlerconfigsService, MonitoringtypesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.monitoringobject = monitoringobject;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = TopicsService.query();
    vm.socialcrawlerconfigs = SocialcrawlerconfigsService.query();
    vm.monitoringtypes = MonitoringtypesService.query();
    // Remove existing Monitoringobject
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.monitoringobject.$remove($state.go('monitoringobjects.list'));
      }
    }

    // Save Monitoringobject
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.monitoringobjectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.monitoringobject._id) {
        vm.monitoringobject.$update(successCallback, errorCallback);
      } else {
        vm.monitoringobject.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('monitoringobjects.view', {
          monitoringobjectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
