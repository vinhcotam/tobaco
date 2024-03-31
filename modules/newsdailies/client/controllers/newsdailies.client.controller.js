(function () {
  'use strict';

  // Newsdailies controller
  angular
    .module('newsdailies')
    .controller('NewsdailiesController', NewsdailiesController);

  NewsdailiesController.$inject = ['$scope', '$filter', '$sce', '$state', '$window', 'Authentication', 'newsdailyResolve', 'Notification', 'NewsgroupsService', 'TopicsService'];

  function NewsdailiesController($scope, $filter, $sce, $state, $window, Authentication, newsdaily, Notification, NewsgroupsService, TopicsService) {
    var vm = this;

    vm.authentication = Authentication;
    //redirect
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    vm.newsdaily = newsdaily;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    if ('topic' in newsdaily) {
      vm.newsgroups = NewsgroupsService.query({ topic: newsdaily.topic._id }, function (data) {
        vm.newsgroups = data;
      });
    }

    vm.topics = vm.authentication.user.topics;

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.assignedtopics, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    $('#btn_submit_group').click(function () {
      var myRadio = $("input[name=flexRadioDefault]:checked");
      if (myRadio.val() != 'undefined') {
        vm.newsdaily.news_group = myRadio.val();
        if (vm.newsdaily._id) {
          vm.newsdaily.$update(function (res) {
          }, function (res) {
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Submit success!' });
        }
      } 
    });

    /*if (vm.newsdaily.group_news == 1) {
      $('#flexRadioDefault1')[0].checked = true;
    } else if (vm.newsdaily.group_news == 2) {
      $('#flexRadioDefault2')[0].checked = true;
    } else if (vm.newsdaily.group_news == 3) {
      $('#flexRadioDefault3')[0].checked = true;
    }*/

    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    }
    // Remove existing Newsdaily
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newsdaily.$remove($state.go('newsdailies.list'));
      }
    }

    // Save Newsdaily
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsdailyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.newsdaily._id) {
        vm.newsdaily.$update(successCallback, errorCallback);
      } else {
        vm.newsdaily.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newsdailies.view', {
          newsdailyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
