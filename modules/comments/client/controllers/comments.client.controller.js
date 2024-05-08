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
    console.log("checkkk:", vm.comment)
    vm.error = null;
    vm.form = {};
    vm.save = save;
    function save(isValid) {
      console.log(vm.sentiment)
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sentimentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.comment._id) {
        vm.comment.$update(successCallback, errorCallback);
      } else {
        vm.comment.$save(successCallback, errorCallback);
      }
    }
  }
}());
