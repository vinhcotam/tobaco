(function () {
  'use strict';

  // Crawlerhistories controller
  angular
    .module('crawlerhistories')
    .controller('CrawlerhistoriesController', CrawlerhistoriesController);

  CrawlerhistoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'crawlerhistoryResolve'];

  function CrawlerhistoriesController($scope, $state, $window, Authentication, crawlerhistory) {
    var vm = this;

    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.crawlerhistory = crawlerhistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Crawlerhistory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawlerhistory.$remove($state.go('crawlerhistories.list'));
      }
    }

    // Save Crawlerhistory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crawlerhistoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crawlerhistory._id) {
        vm.crawlerhistory.$update(successCallback, errorCallback);
      } else {
        vm.crawlerhistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crawlerhistories.view', {
          crawlerhistoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
