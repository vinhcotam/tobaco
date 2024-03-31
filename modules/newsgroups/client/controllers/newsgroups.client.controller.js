(function () {
  'use strict';

  // Newsgroups controller
  angular
    .module('newsgroups')
    .controller('NewsgroupsController', NewsgroupsController);

  NewsgroupsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsgroupResolve', 'TopicsService'];

  function NewsgroupsController($scope, $state, $window, Authentication, newsgroup, TopicsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.newsgroup = newsgroup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;

    // Remove existing Newsgroup
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newsgroup.$remove($state.go('newsgroups.list'));
      }
    }

    // Save Newsgroup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsgroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.newsgroup._id) {
        vm.newsgroup.$update(successCallback, errorCallback);
      } else {
        vm.newsgroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newsgroups.view', {
          newsgroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
