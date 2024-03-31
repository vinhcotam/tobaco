(function () {
  'use strict';

  angular
    .module('socialcrawlerconfigs')
    .controller('SocialcrawlerconfigsListController', SocialcrawlerconfigsListController);

  SocialcrawlerconfigsListController.$inject = ['$scope','$filter','$state','$window','Authentication','SocialcrawlerconfigsService'];

  function SocialcrawlerconfigsListController($scope, $filter, $state, $window, Authentication, SocialcrawlerconfigsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    /*vm.socialcrawlerconfigs = SocialcrawlerconfigsService.query(function (data) {
      vm.socialcrawlerconfigs = data;
      vm.buildPager();
    });*/

    vm.buildPager();
    SocialcrawlerconfigsService.getTotal().$promise.then(function (number) {
      vm.filterLength = number[0];
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 2;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      var params = { currentPage: vm.currentPage };

      if (vm.search != undefined) {
        params.search = vm.search;
        SocialcrawlerconfigsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      SocialcrawlerconfigsService.query(params, function (data) {
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
        var socialcrawlerconfig = SocialcrawlerconfigsService.delete({
          socialcrawlerconfigId: id
        });
        window.location.reload();
      }
    }
  }
}());
