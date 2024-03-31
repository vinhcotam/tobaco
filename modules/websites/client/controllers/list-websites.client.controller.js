(function () {
  'use strict';

  angular
    .module('websites')
    .controller('WebsitesListController', WebsitesListController);

  WebsitesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'WebsitesService'];

  function WebsitesListController($scope, $filter, $state, $window, Authentication, WebsitesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user === null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;

    vm.websites = WebsitesService.query(function (data) {
      vm.websites = data[0].websites;
      vm.buildPager();
    });

    WebsitesService.getTotal().$promise.then(function (number) {
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
        WebsitesService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
        });

      }
      WebsitesService.query(params, function (data) {
        vm.filteredItems = data[0].websites;
        vm.pagedItems = data[0].websites;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        var website = WebsitesService.delete({
          websiteId: id
        });
        window.location.reload();
      }
    }
    $('#btn_export').click(function () {
      window.open('/api/websites/export');
    });
  }
}());
