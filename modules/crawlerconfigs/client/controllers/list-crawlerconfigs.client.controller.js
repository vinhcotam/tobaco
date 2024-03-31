(function () {
  'use strict';

  angular
    .module('crawlerconfigs')
    .controller('CrawlerconfigsListController', CrawlerconfigsListController);

  CrawlerconfigsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CrawlerconfigsService', 'NewsdailiesService'];

  function CrawlerconfigsListController($scope, $filter, $state, $window, Authentication, CrawlerconfigsService, NewsdailiesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    NewsdailiesService.query({ typeget: 1 }, function (data) {
      vm.news = data;
    });
    vm.crawlerconfigs = CrawlerconfigsService.query({ currentPage: 1 }, function (data) {
      vm.crawlerconfigs = data[0].data;
      vm.filterLength = data[0].count;
      vm.buildPager();
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
      }
      CrawlerconfigsService.query(params, function (data) {
        vm.filterLength = data[0].count;
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
        var crawlerdriver = CrawlerconfigsService.delete({
          crawlerconfigId: id
        });
        window.location.reload();
      }
    }

    $('#btn_asyn').click(function () {
      // alert();
      var crawlerconfig_id = $('#select_crawlerconfig').val();
      console.log(crawlerconfig_id);
      for (var i = 0; i < vm.news.length; i++) {
        // console.log(vm.news[i]);
        vm.news[i].crawlerconfig = crawlerconfig_id;
        vm.news[i].$update(function (res) { }, function (res) { });
      }
    });
  }
}());
