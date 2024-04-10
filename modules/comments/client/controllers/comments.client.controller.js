(function () {
  'use strict';

  // comments controller
  angular
    .module('comments')
    .controller('CommentsController', CommentsController);
// , 'TopicsService'
    CommentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'commentResolve'];
// , TopicsService
  function CommentsController($scope, $state, $window, Authentication, comment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.comment = comment;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    // vm.save = save;
    // vm.topics = vm.authentication.user.topics;
    // Remove existing comment
    // function remove() {
    //   if ($window.confirm('Are you sure you want to delete?')) {
    //     vm.sentiment.$remove($state.go('sentiments.list'));
    //   }
    // }

    // // Save sentiment
    // function save(isValid) {
    //   console.log(vm.sentiment)
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.sentimentForm');
    //     return false;
    //   }

    //   // TODO: move create/update logic to service
    //   if (vm.sentiment._id) {
    //     vm.sentiment.$update(successCallback, errorCallback);
    //   } else {
    //     vm.sentiment.$save(successCallback, errorCallback);
    //   }

    //   function successCallback(res) {
    //     $state.go('sentiments.view', {
    //       sentimentId: res._id
    //     });
    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }
  }
}());
