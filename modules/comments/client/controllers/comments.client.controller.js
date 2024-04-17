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

  }
}());
