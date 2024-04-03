(function () {
    'use strict';
  
    angular
      .module('sentiments')
      .controller('SentimentsListController', SentimentsListController);
  
    SentimentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'SentimentsService'];
  
    function SentimentsListController($scope, $filter, $state, $window, Authentication, SentimentsService) {
      var vm = this;
      vm.authentication = Authentication;
      if (vm.authentication.user == null) {
        window.location.href = '/authentication/signin';
      }
  
      vm.buildPager = buildPager;
      vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
      vm.pageChanged = pageChanged;
      vm.remove = remove;
      vm.buildPager();
      SentimentsService.getTotal().$promise.then(function (number) {
        vm.filterLength = number[0];
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
        var params = { currentPage: vm.currentPage };
  
        if (vm.search !== undefined) {
          params.search = vm.search;
          SentimentsService.getTotal(params).$promise.then(function (number) {
            vm.filterLength = number[0];
          });
  
        }
        SentimentsService.query(params, function (data) {
          vm.filteredItems = data;
          vm.pagedItems = data;
        });
      }
  
      function pageChanged() {
        vm.figureOutItemsToDisplay();
      }
  
      //
      function remove(id) {
        if ($window.confirm('Are you sure you want to delete?')) {
          var sentiment = SentimentsService.delete({
            sentimentId: id
          });
          window.location.reload();
        }
      }
    }
  }());
  