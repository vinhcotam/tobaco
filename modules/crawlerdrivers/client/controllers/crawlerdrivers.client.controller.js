(function () {
  'use strict';

  // Crawlerdrivers controller
  angular
    .module('crawlerdrivers')
    .controller('CrawlerdriversController', CrawlerdriversController);

  CrawlerdriversController.$inject = ['$scope', '$state', '$window', 'Authentication', 'crawlerdriverResolve'];

  function CrawlerdriversController($scope, $state, $window, Authentication, crawlerdriver) {
    var vm = this;

    vm.authentication = Authentication;
    vm.crawlerdriver = crawlerdriver;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Crawlerdriver
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawlerdriver.$remove($state.go('crawlerdrivers.list'));
      }
    }

    // Save Crawlerdriver
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crawlerdriverForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crawlerdriver._id) {
        vm.crawlerdriver.$update(successCallback, errorCallback);
      } else {
        vm.crawlerdriver.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crawlerdrivers.view', {
          crawlerdriverId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
