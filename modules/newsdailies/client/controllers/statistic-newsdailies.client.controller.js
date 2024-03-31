(function () {
  'use strict';

  angular
    .module('newsdailies')
    .controller('NewsdailiesStatisticController', NewsdailiesStatisticController);

  NewsdailiesStatisticController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsdailiesStatisticService', 'NewsgroupsService'];

  function NewsdailiesStatisticController($scope, $filter, $state, $window, Authentication, NewsdailiesStatisticService, NewsgroupsService) {
    var vm = this;
    vm.authentication = Authentication;
    // redirect
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    $('#datetimefilter').daterangepicker({
      opens: 'left'
    }, function (start, end, label) {
      vm.startfilterdate = start.format('YYYY-MM-DD');
      vm.endfilterdate = end.format('YYYY-MM-DD');
      figureOutItemsToDisplay();
    });
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.newsgroups = NewsgroupsService.query({}, function (data) {
      vm.newsgroups = data;
    });
    var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
    var pieOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        position: 'right',
        display: false
      }
    };
    var pieChart = new Chart(pieChartCanvas, {
      type: 'line',
      // type: 'polarArea',
      // data: pieData,
      options: pieOptions
    });
    NewsdailiesStatisticService.query({}, function (rows) {
      var labels = [];
      var data = [];
      var colors = [];
      var count = 0;
      for (var i = 0; i < rows.length; i++) {
        labels.push(rows[i]._id.source_address[0]);
        data.push(rows[i].count);
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        count = count + rows[i].count;
      }
      var donutData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors
        }]
      };
      var pieData = donutData;
      pieChart.data.labels = labels;
      pieChart.data.datasets = [{
        data: data,
        backgroundColor: colors
      }];
      pieChart.update();
    });
    function figureOutItemsToDisplay() {
      var params = {};
      if (vm.filterbygroup !== undefined) {
        params.filterbygroup = vm.filterbygroup;
      }
      if (vm.startfilterdate !== undefined) {
        params.startfilterdate = vm.startfilterdate;
        params.endfilterdate = vm.endfilterdate;
      }
      NewsdailiesStatisticService.query(params, function (rows) {
        var labels = [];
        var data = [];
        var colors = [];
        for (var i = 0; i < rows.length; i++) {
          labels.push(rows[i]._id.source_address[0]);
          data.push(rows[i].count);
          colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        }
        var donutData = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors
          }]
        };
        var pieData = donutData;
        pieChart.data.labels = labels;
        pieChart.data.datasets = [{
          data: data,
          backgroundColor: colors
        }];
        pieChart.update();
      });
    }
  }
}());
