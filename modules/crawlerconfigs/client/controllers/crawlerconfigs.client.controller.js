(function () {
  'use strict';

  // Crawlerconfigs controller
  angular
    .module('crawlerconfigs')
    .controller('CrawlerconfigsController', CrawlerconfigsController);

  CrawlerconfigsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'crawlerconfigResolve', 'TopicsService', 'WebsitesService', 'KeywordsService'];

  function CrawlerconfigsController($scope, $state, $window, Authentication, crawlerconfig, TopicsService, WebsitesService, KeywordsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.crawlerconfig = crawlerconfig;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = TopicsService.query();
    vm.websites = WebsitesService.query();
    vm.keywords = KeywordsService.query();


    vm.someModel = vm.websites.map(function (item) {
      return item.id;
    });

    // topic change
    $('#topic').change(function () {
      // console.log($('#topic').val());
      // vm.keywords = KeywordsService.query();
    });
    // Remove existing Crawlerconfig
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawlerconfig.$remove($state.go('crawlerconfigs.list'));
      }
    }

    // Save Crawlerconfig
    function save(isValid) {
      var websites = [];
      $('#bootstrap-duallistbox-selected-list_website option').map(function () {
        websites.push($(this).val());
        return $(this).val();
      }).get();
      var keywords = $('#bootstrap-duallistbox-selected-list_keyword option').map(function () { return $(this).val(); }).get();
      console.log(websites);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crawlerconfigForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crawlerconfig._id) {
        vm.crawlerconfig.$update(successCallback, errorCallback);
      } else {
        vm.crawlerconfig.parameters.websites = websites;
        vm.crawlerconfig.parameters.keywords = keywords;
        // console.log(vm.crawlerconfig);
        // console.log(typeof (websites));
        // alert();
        vm.crawlerconfig.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crawlerconfigs.view', {
          crawlerconfigId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    //
    $scope.$on('$viewContentLoaded', function () {
      setTimeout(
        function () {
          $('.duallistbox').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: false,
            nonSelectedFilter: ''
          });
        }, 500);
    });
  }
}());
