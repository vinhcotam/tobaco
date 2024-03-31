(function () {
  'use strict';

  // Assignedtopics controller
  angular
    .module('assignedtopics')
    .controller('AssignedtopicsController', AssignedtopicsController);

  AssignedtopicsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'assignedtopicResolve', 'TopicsService', 'AdminService'];

  function AssignedtopicsController($scope, $state, $window, Authentication, assignedtopic, TopicsService, AdminService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.assignedtopic = assignedtopic;

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // vm.topics = TopicsService.query(); // need filter topics by roles
    TopicsService.gettopicbyrole().$promise.then(function (topics) {
      vm.topics = topics;
    });
    /* AdminService.query({}, function (data) {
      vm.ls_users = data;
      console.log(data);
    }) ;*/

    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element === 'admin') {
          vm.isAdmin = true;
          vm.isManager = true;
        } else if (element === 'manager') {
          vm.isManager = true;
        }
      });

      if (vm.isAdmin === true || vm.isManager === true) {

        AdminService.query({ owner: vm.authentication.user._id }, function (data) {
          vm.ls_users = data;
        });
      }
      // else {
      // }
    }
    // Remove existing Assignedtopic
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.assignedtopic.$remove($state.go('assignedtopics.list'));
      }
    }

    // Save Assignedtopic
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.assignedtopicForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.assignedtopic._id) {
        vm.assignedtopic.$update(successCallback, errorCallback);
      } else {
        vm.assignedtopic.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('assignedtopics.view', {
          assignedtopicId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
