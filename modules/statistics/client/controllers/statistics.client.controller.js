(function () {
  'use strict';

  // Statistics controller
  angular
    .module('statistics')
    .controller('StatisticsController', StatisticsController);

  StatisticsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'statisticResolve'];

  function StatisticsController ($scope, $state, $window, Authentication, statistic) {
    var vm = this;

    vm.authentication = Authentication;
    vm.statistic = statistic;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Statistic
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.statistic.$remove($state.go('statistics.list'));
      }
    }

    // Save Statistic
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statisticForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.statistic._id) {
        vm.statistic.$update(successCallback, errorCallback);
      } else {
        vm.statistic.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('statistics.view', {
          statisticId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
