(function () {
    'use strict';
  
    angular
      .module('labelingbysentiments')
      .controller('LabelingbysentimentsListController', LabelingbysentimentsListController);
  
    LabelingbysentimentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'LabelingbysentimentsService'];
  
    function LabelingbysentimentsListController($scope, $filter, $state, $window, Authentication, LabelingbysentimentsService) {
      var vm = this;
      vm.authentication = Authentication;
      if (vm.authentication.user == null) {
        window.location.href = '/authentication/signin';
      }
      vm.buildPager = buildPager;
      vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
      vm.pageChanged = pageChanged;
      vm.remove = remove;
      vm.authentication = Authentication;
  
      if (vm.authentication) {
        var roles = vm.authentication.user.roles;
        roles.forEach(function (element, index) {
          if (element === 'admin') {
            vm.isAdmin = true;
          } else if (element === 'manager') {
            vm.isManager = true;
          } else {
            vm.isUser = true;
          }
        });
      }
  
      vm.buildPager();
      LabelingbysentimentsService.getTotal().$promise.then(function (number) {
        if (number.length > 0) {
          vm.filterLength = number[0].total;
        } else {
          vm.filterLength = 0;
        }
      });
      function buildPager() {
        vm.pagedItems = [];
        vm.itemsPerPage = 10;
        vm.currentPage = 1;
        vm.figureOutItemsToDisplay();
      }
      function figureOutItemsToDisplay() {
       
        var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
        var end = begin + vm.itemsPerPage;

        var params = {
          currentPage: vm.currentPage
        };
        if (vm.search !== undefined) {
          params.search = vm.search;
          LabelingbysentimentsService.getTotal(params).$promise.then(function (number) {
            if (number.length > 0) {
              vm.filterLength = number[0].total;
            } else {
              vm.filterLength = 0;
            }
          });
        }
  
        vm.labelingbysentiments = LabelingbysentimentsService.query(params, function (data) {
          vm.filteredItems = data[0].data;
          vm.pagedItems = data[0].data;
        });
      }
  
      function pageChanged() {
        vm.figureOutItemsToDisplay();
      }
      function remove(id) {
        if ($window.confirm('Are you sure you want to delete?')) {
          var labelingbysentiment = LabelingbysentimentsService.delete({
            labelingbysentimentId: id
          });
          window.location.reload();
        }
      }
      $('#btn_export').click(function () {
        window.open('/api/labelingbysentiments/export');
      });
    }
  }());
  