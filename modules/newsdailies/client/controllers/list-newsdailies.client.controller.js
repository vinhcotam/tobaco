(function () {
  'use strict';

  angular
    .module('newsdailies')
    .controller('NewsdailiesListController', NewsdailiesListController);

  NewsdailiesListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsdailiesService', 'CrawlerconfigsService', 'NewsdailiesExportService', 'NewsgroupsService', 'Notification'];

  function NewsdailiesListController($scope, $filter, $state, $window, Authentication, NewsdailiesService, CrawlerconfigsService, NewsdailiesExportService, NewsgroupsService, Notification) {
    var vm = this;
    vm.authentication = Authentication;

    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.buildPager = buildPager;
    /*NewsdailiesService.get({ count: true }, function (data) {
      vm.filterLength = data.toJSON().count;
    })*/
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.forceRemove = forceRemove;
    vm.sortPostedFunc = sortPostedFunc;
    vm.sortByPosted = -1;
    vm.newsgroups = NewsgroupsService.query({}, function (data) {
      vm.newsgroups = data;
    });
    vm.listDelete = [];
    $('#datetimefilter').daterangepicker({
      opens: 'left'
    }, function (start, end, label) {
        vm.startfilterdate = start.format('YYYY-MM-DD');
        vm.endfilterdate = end.format('YYYY-MM-DD');
       figureOutItemsToDisplay();
    });

    function sortPostedFunc() {
      //alert("Sort by Posted is pendding");
      vm.sortByPosted += 1;
      $('#sortbyposted').empty();
      if (vm.sortByPosted % 2 == 0) {
        $('#sortbyposted').append('<i class="fas fa-sort-up" style="color: blue"></i>');
      } else {
        $('#sortbyposted').append('<i class="fas fa-sort-down" style="color: blue"></i>');
      }
      figureOutItemsToDisplay();
    }
    CrawlerconfigsService.filter({}, function (data) {
      vm.crawlerconfigs = data[0].data;
    });

    NewsdailiesService.getTotal().$promise.then(function (number) {
      if (number.length > 0) {
        vm.filterLength = number[0].totalCount;
      } else {
        vm.filterLength = 0
      }
      
    });
    vm.newsdailies = NewsdailiesService.query({ currentPage: 1 }, function (data) {
      vm.newsdailies = data[0].data;
      //vm.filterLength = data[0].count;
      vm.buildPager();
    });
    
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      /*vm.filteredItems = $filter('filter')(vm.newsdailies, {
        $: vm.search
      });*/
      
      /*if (vm.search != undefined) {
        NewsdailiesService.get({ count: true, search: vm.search }, function (data) {
          vm.filterLength = data.toJSON().count;
          NewsdailiesService.query({ currentPage: vm.currentPage, search: vm.search }, function (data) {
            vm.filteredItems = data[0].data;
          });
        })
      }*/
      //vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      //vm.pagedItems = vm.filteredItems.slice(begin, end);
      var params = { currentPage: vm.currentPage };
      if (vm.search != undefined) {
        params.search = vm.search;
      }
      if (vm.filterbylabeled != undefined) {
        //console.log(vm.filterbylabeled);
        params.filterbylabeled = vm.filterbylabeled;
      }
      if (vm.filterbygroup != undefined) {
        params.filterbygroup = vm.filterbygroup;
      }
      if (vm.startfilterdate != undefined) {
        params.startfilterdate = vm.startfilterdate;
        params.endfilterdate = vm.endfilterdate;
      }
      if (vm.sortByPosted > -1) {
        params.sortByPosted = vm.sortByPosted;
      }

      if (vm.filterbycrawlerconfig != undefined) {
        //alert(vm.filterbycrawwlerconfig);
        if (vm.filterbycrawlerconfig != 0) {
          params.filterbycrawlerconfig = vm.filterbycrawlerconfig;
        }
      }
      //
      NewsdailiesService.getTotal(params).$promise.then(function (number) {
        if (number.length > 0) {
          vm.filterLength = number[0].totalCount;
        } else {
          vm.filterLength = 0
        }
      });
      //
      NewsdailiesService.query(params, function (data) {
        //vm.filterLength = data[0].count;
        vm.filteredItems = data[0].data;
        vm.pagedItems = data[0].data;
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    async function forceRemove() {
      if (vm.listDelete.length == 0) {
        return;
      }
      let result = await NewsdailiesService.forceDelete(
        {
          listNews : vm.listDelete
        }
      );
      if (!result) {
        Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Remove Failed! Something error' });
      } else {
        Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Remove success!' });
      }
      setTimeout(() => {
        document.location.reload();
      }, 2000);
      
    }

    //
    function remove(id) {
      if ($window.confirm('Are you sure you want to delete?')) {
        for (let index in vm.pagedItems) {
          if (vm.pagedItems[index]._id == id) {
            vm.pagedItems.splice(index, 1);
          }
        }
        vm.listDelete.push(id);
      }
    }
    //
    $('#btn_export').click(function () {
      //NewsdailiesExportService.get();
      window.open('/api/newsdailies/export')
    })
  }
}());
