(function () {
  'use strict';

  // Crawlerschedules controller
  angular
    .module('crawlerschedules')
    .controller('CrawlerschedulesController', CrawlerschedulesController);

  CrawlerschedulesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'crawlerscheduleResolve'];

  function CrawlerschedulesController($scope, $state, $window, Authentication, crawlerschedule) {
    var vm = this;

    vm.authentication = Authentication;
    vm.crawlerschedule = crawlerschedule;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Crawlerschedule
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawlerschedule.$remove($state.go('crawlerschedules.list'));
      }
    }

    // Save Crawlerschedule
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crawlerscheduleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crawlerschedule._id) {
        vm.crawlerschedule.$update(successCallback, errorCallback);
      } else {
        vm.crawlerschedule.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crawlerschedules.view', {
          crawlerscheduleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
