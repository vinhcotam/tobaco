(function () {
  'use strict';

  angular
    .module('assignedtopics')
    .controller('AssignedtopicsListController', AssignedtopicsListController);

  AssignedtopicsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'AssignedtopicsService', 'TopicsService'];

  function AssignedtopicsListController($scope, $filter, $state, $window, Authentication, AssignedtopicsService, TopicsService) {
    var vm = this;
    vm.authentication = Authentication;
    // vm.assignedtopics = AssignedtopicsService.query();
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    if (vm.authentication.user === null) {
      window.location.href = '/authentication/signin';
    }

    if (vm.authentication) {
      var roles = vm.authentication.user.roles;
      roles.forEach(function (element, index) {
        if (element === 'admin') {
          vm.isAdmin = true;
        } else if (element === 'manager') {
          vm.isManager = true;
        }
      });
    }
    // need check by role
    vm.assignedtopics = AssignedtopicsService.query(function (data) {
      vm.assignedtopics = data;
      vm.buildPager();
    });

    TopicsService.gettopicbyrole().$promise.then(function (topics) {
      vm.topics = topics;
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.assignedusersgroup = [];
      if (vm.isManager === true) {
        vm.assignedtopics.forEach(function (assignedTopic, index) {
          let checkExist = vm.assignedusersgroup.some(element => {
            if (element.topic._id === assignedTopic.topic._id) {
              return true;
            }
            return false;
          });
          if (!checkExist) {
            vm.assignedusersgroup.push(
              {
                topic: {
                  _id: assignedTopic.topic._id,
                  topic_name: assignedTopic.topic.topic_name,
                  topic_description: assignedTopic.topic.topic_description
                },
                assigned_user: {
                  displayName: assignedTopic.assigned_user.displayName
                },
                created: assignedTopic.created,
                working_status: assignedTopic.working_status,
                _id: assignedTopic._id
              }
            );
          } else {
            let index = vm.assignedusersgroup.findIndex(element => {
              return element.topic._id === assignedTopic.topic._id;
            });
            if (index !== -1) {
              vm.assignedusersgroup[index].assigned_user.displayName = vm.assignedusersgroup[index].assigned_user.displayName + ', ' + assignedTopic.assigned_user.displayName;
            }
          }
        });
        vm.assignedtopics = vm.assignedusersgroup;
      }

      if (vm.filterbytopic) {
        console.log(vm.filterbytopic._id);
        vm.filteredItems = $filter('filter')(vm.assignedtopics, {
          // $: vm.search
          $: vm.filterbytopic.topic_name
        });
      } else {
        vm.filteredItems = $filter('filter')(vm.assignedtopics, {
          $: vm.search
        });
      }

      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var assignedtopic = AssignedtopicsService.delete({
          assignedtopicId: id
        });
        window.location.reload();
      }
    }
  }
}());
