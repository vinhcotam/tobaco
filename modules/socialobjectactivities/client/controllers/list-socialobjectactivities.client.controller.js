(function () {
  'use strict';

  angular
    .module('socialobjectactivities')
    .controller('SocialobjectactivitiesListController', SocialobjectactivitiesListController);

  SocialobjectactivitiesListController.$inject = ['$scope','$filter','$state','$window','Authentication','SocialobjectactivitiesService'];

  function SocialobjectactivitiesListController($scope, $filter, $state, $window, Authentication, SocialobjectactivitiesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.socialobjectactivities = SocialobjectactivitiesService.query(function (data) {
      vm.socialobjectactivities = data;
      vm.buildPager();
    });


    SocialobjectactivitiesService.getTotal().$promise.then(function (number) {
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

      if (vm.search != undefined) {
        params.search = vm.search;
        SocialobjectactivitiesService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      
      SocialobjectactivitiesService.query(params, function (data) {
        //vm.filterLength = data[0].count;
        vm.filteredItems = data[0].data;
        vm.pagedItems = data[0].data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var socialobjectactivity = SocialobjectactivitiesService.delete({
          socialobjectactivityId: id
        });
        window.location.reload();
      }
    }
  }
}());
