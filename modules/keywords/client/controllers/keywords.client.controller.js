(function () {
  'use strict';

  // Keywords controller
  angular
    .module('keywords')
    .controller('KeywordsController', KeywordsController);

  KeywordsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'keywordResolve', 'TopicsService'];

  function KeywordsController($scope, $state, $window, Authentication, keyword, TopicsService) {
    var vm = this;

    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.keyword = keyword;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;

    // Remove existing Keyword
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.keyword.$remove($state.go('keywords.list'));
      }
    }

    // Save Keyword
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.keywordForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.keyword._id) {
        vm.keyword.$update(successCallback, errorCallback);
      } else {
        vm.keyword.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('keywords.view', {
          keywordId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
