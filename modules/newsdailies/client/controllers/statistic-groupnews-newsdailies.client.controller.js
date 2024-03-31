(function () {
  'use strict';

  angular
    .module('newsdailies')
    .controller('NewsdailiesStatisticGroupNewsController', NewsdailiesStatisticGroupNewsController);

  NewsdailiesStatisticGroupNewsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'NewsdailiesStatisticGroupNewsService', 'Notification'];

  function NewsdailiesStatisticGroupNewsController($scope, $filter, $state, $window, Authentication, NewsdailiesStatisticGroupNewsService, Notification) {
    var vm = this;
    vm.authentication = Authentication;
    var roles = vm.authentication.user.roles;
    vm.isRole = -1;
    roles.forEach(function (element, index) {
      if (element == 'admin') {
        vm.isRole = 0;
      } else if (element == 'manager' && vm.isRole == -1) {
        vm.isRole = 1;
      } else if (element == 'user' && vm.isRole == -1) {
        vm.isRole = 2;
      }
    });
    //redirect
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    NewsdailiesStatisticGroupNewsService.query({}, function (rows) {
      var labels = [];
      var data = [];
      var colors = [];
      for (var i = 0; i < rows.length; i++) {
        if (vm.isRole == 2 && rows[i].group_name == "Không xác định") {
          continue;
        }
        labels.push(rows[i].group_name);
        data.push(rows[i].count);
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
      };
      vm.donutData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
        }]
      }
      var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
      var pieOptions = {
        maintainAspectRatio: false,
        responsive: true,
      }
      var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: vm.donutData,
        options: pieOptions
      });
    });
    $('.filter-new-groups').on('click', 'li', function() {
      $('.filter-new-groups ul li.active').removeClass('active'); 
      $(this).addClass('active');
      if ($(this).hasClass('week')) {
        $('.filter-by-week').removeClass('hidden');
        $('.filter-by-month').addClass('hidden');
      } else {
        if ($(this).hasClass('default')) {
          $('.filter-by-month').addClass('hidden');
          $('.filter-by-week').addClass('hidden');
          $('.pieChart').removeClass('hidden');
          $('#pieChart').css({'display' : 'block', 'height' : '400px'});
          $('.card-body').removeClass('hidden');
          $('.display_line_chart').addClass('hidden');
        } else {
          $('.filter-by-month').removeClass('hidden');
          $('.filter-by-week').addClass('hidden');
        }
      }
    });
    $(function () {
      $('#from-date').datetimepicker({
        format : 'YYYY-MM-DD',
      });
      $('#end-date').datetimepicker({
        format : 'YYYY-MM-DD',
        useCurrent: false
      });
    });

    $(function () {
      $('#month_start_date').datetimepicker({
        format : 'YYYY-MM',
        viewMode: 'months'
      });
      $('#month_end_date').datetimepicker({
        format : 'YYYY-MM',
        viewMode: 'months'
      });
    });
    vm.filtergroupstartdate = '';
    vm.filtergroupenddate = '';
    vm.percentGroup = [];
    vm.filterGroupByDate = filterGroupByDate;
    vm.filterGroupByMonth = filterGroupByMonth;

    function filterGroupByDate() {
      $('.spinner-border').removeClass('hidden');
      $('#pieChart').css('display', 'none');
      $('#lineChartMonth').css('display', 'none');
      vm.filtergroupstartdate = $('input#startdate').val();
      vm.filtergroupenddate = $('input#enddate').val();
      if (vm.filtergroupstartdate != '' && vm.filtergroupenddate != '') {
        let startDate = new Date(vm.filtergroupstartdate);
        let endDate = new Date(vm.filtergroupenddate);
        let diffDay = endDate.getDate() - startDate.getDate();
        if (diffDay > 7) {
          Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>The date range must be in a week!' });
          $('.spinner-border').addClass('hidden');
          $('#pieChart').css('display', 'block');
          return;
        }
        if (diffDay < 0) {
          Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>The end date must greater than start date!' });
          $('.spinner-border').addClass('hidden');
          $('#pieChart').css('display', 'block');
          return;
        }
        var params = {
          start: new Date(new Date(vm.filtergroupstartdate).setDate(new Date(vm.filtergroupstartdate).getDate() - 7)),
          end: vm.filtergroupenddate
        }

        var lineChart = $('#lineChart').get(0).getContext('2d');
        var lineChartOptions = {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'bottom',
            display: true,
          }
        }
        var lineChart = new Chart(lineChart, {
          type: 'line',
          options: lineChartOptions,
        });
        NewsdailiesStatisticGroupNewsService.query(params, function (rows) {
          $('.display_line_chart').removeClass('hidden');
          $('.spinner-border').addClass('hidden');
          $('.card-body').addClass('hidden');
          $('#lineChart').css('display', 'block');
          var labels = [];
          var data = [0];
          var count = 0;
          let loopDay = startDate;
          vm.percentGroup = [];
          labels.push(startDate.toISOString().split('T')[0]);
          for(let i = 0; i < 6; i++) {
            labels.push(new Date(loopDay.setDate(loopDay.getDate() + 1)).toISOString().split('T')[0]);
            data.push(0);
          }
          let datasets = [];
          let percentGroup = [];
          let oldData = [];
          for (var i = 0; i < rows.length; i++) {
            if ( new Date(rows[i]._id.posted.split('T')[0]) < new Date(vm.filtergroupstartdate).getTime() ) {
              let key = rows[i].group_name[0];
              if (!(key in oldData)) {
                oldData[key] = rows[i].count;
              } else {
                oldData[key] = oldData[key] + rows[i].count;
              }
            }
          }
          vm.oldData = oldData;
          for (var i = 0; i < rows.length; i++) {
            if (vm.isRole == 2 && rows[i].group_name[0] == "Không xác định") {
              continue;
            }
            if ( new Date(rows[i]._id.posted.split('T')[0]).getTime() < new Date(vm.filtergroupstartdate).getTime() ) {
              continue;
            }
            let found = datasets.some(el => el.label === rows[i].group_name[0]);
            if (!found) {
              data.fill(0);
              let date = rows[i]._id.posted.split('T')[0];
              let index = labels.indexOf(date, 0);
              data[index] = rows[i].count;
              datasets.push({
                label: rows[i].group_name[0],
                data: [...data],
                fill: false,
                borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                backgroundColor: '#' + Math.floor(Math.random() * 16777220).toString(16),
              });
            } else {
              let indexMap = datasets.findIndex((el) => el.label === rows[i].group_name[0]);
              let date = rows[i]._id.posted.split('T')[0];
              let index = labels.indexOf(date, 0);
              datasets[indexMap].data[index] = rows[i].count;
            }
            count = count + rows[i].count;
          };
          datasets.forEach(function(item) {
            let sum = item.data.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0);
            let denominator = 1;
            if (vm.oldData[item.label]) {
              denominator = vm.oldData[item.label];
            }
            let type = 1;
            if (sum - vm.oldData[item.label] < 0) {
              type = -1;
            } 
            if (sum - vm.oldData[item.label] == 0) {
              type = 0;
            }
            percentGroup.push({
              label: item.label,
              type: type,
              compare_percent: Math.abs(Math.round((sum - (vm.oldData[item.label] ? vm.oldData[item.label] : 0)) * 100 / denominator)),
              percent: Math.round(sum * 100 / count),
              sum: sum,
            });
          });
          vm.percentGroup = percentGroup;
          lineChart.data.labels = labels;
          lineChart.data.datasets = datasets;
          lineChart.update();
        });
      } else {
        $('.spinner-border').addClass('hidden');
        $('#pieChart').css('display', 'block');
      }
    }

    function filterGroupByMonth() {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      $('.spinner-border').removeClass('hidden');
      $('#pieChart').css('display', 'none');
      $('#lineChart').css('display', 'none');
      let startMonth = $('input#month_start_date').val();
      let endMonth = $('input#month_end_date').val();
      var diffMonth = 0;
      if (startMonth != '' && endMonth != '') {
        let startMonthFormat = new Date(startMonth);
        let endMonthFormat = new Date(endMonth);
        diffMonth = endMonthFormat.getMonth() - startMonthFormat.getMonth();
        if (diffMonth == 0) {
          Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>The start and end date must different month!' });
          $('.spinner-border').addClass('hidden');
          $('#pieChart').css('display', 'block');
          return;
        }
        var params = {
          // start: new Date(startMonthFormat.setDate(1)),
          start: new Date(new Date(new Date(startMonth).setMonth(new Date(startMonth).getMonth() - 1)).setDate(1)),
          end: new Date(endMonthFormat.setMonth(endMonthFormat.getMonth() + 1)),
        }

        var lineChart = $('#lineChartMonth').get(0).getContext('2d');
        var lineChartOptions = {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'bottom',
            display: true,
          }
        }
        var lineChart = new Chart(lineChart, {
          type: 'line',
          options: lineChartOptions,
        });
        NewsdailiesStatisticGroupNewsService.query(params, function (rows) {
          $('.display_line_chart').removeClass('hidden');
          $('#lineChartMonth').css('display', 'block');
          $('.spinner-border').addClass('hidden');
          $('.card-body').addClass('hidden');
          var labels = [];
          var data = [0];
          var count = 0;
          vm.percentGroup = [];
          labels.push(months[startMonthFormat.getMonth()]);
          for(let i = 1; i <= diffMonth; i++) {
            labels.push(months[startMonthFormat.getMonth() + i]);
            data.push(0);
          }
          let datasets = [];
          let percentGroup = [];
          let oldData = [];
          for (var i = 0; i < rows.length; i++) {
            if ( new Date(rows[i]._id.posted).getTime() < new Date(startMonth).getTime() ) {
              let key = rows[i].group_name[0];
              if (!(key in oldData)) {
                oldData[key] = rows[i].count;
              } else {
                oldData[key] = oldData[key] + rows[i].count;
              }
            }
          }
          vm.oldData = oldData;
          for (var i = 0; i < rows.length; i++) {
            if (vm.isRole == 2 && rows[i].group_name[0] == "Không xác định") {
              continue;
            }
            if ( new Date(rows[i]._id.posted).getTime() < new Date(startMonth).getTime() ) {
              continue;
            }
            let found = datasets.some(el => el.label_id === rows[i]._id.news_group);
            if (!found) {
              data.fill(0);
              let date = months[new Date(rows[i]._id.posted).getMonth()];
              let index = labels.indexOf(date, 0);
              data[index] = rows[i].count;
              datasets.push({
                label_id: rows[i]._id.news_group,
                label: rows[i].group_name[0],
                data: [...data],
                fill: false,
                borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                backgroundColor: '#' + Math.floor(Math.random() * 16777220).toString(16),
              });
            } else {
              let indexMap = datasets.findIndex((el) => el.label_id === rows[i]._id.news_group);
              let date = months[new Date(rows[i]._id.posted).getMonth()];
              let index = labels.indexOf(date, 0);
              datasets[indexMap].data[index] = datasets[indexMap].data[index] + rows[i].count;
            }
            count = count + rows[i].count;
          };
          vm.total = count;
          datasets.forEach(function(item) {
            let sum = item.data.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0);
            let denominator = 1;
            if (vm.oldData[item.label]) {
              denominator = vm.oldData[item.label];
            }
            let type = 1;
            if (sum - vm.oldData[item.label] < 0) {
              type = -1;
            } 
            if (sum - vm.oldData[item.label] == 0) {
              type = 0;
            }
            percentGroup.push({
              label: item.label,
              type: type,
              compare_percent: Math.abs(Math.round((sum - (vm.oldData[item.label] ? vm.oldData[item.label] : 0)) * 100 / denominator)),
              percent: Math.round(sum * 100 / count),
              sum: sum,
            });
          });
          vm.percentGroup = percentGroup;
          lineChart.data.labels = labels;
          lineChart.data.datasets = datasets;
          lineChart.update();
        });
      } else {
        $('.spinner-border').addClass('hidden');
        $('#pieChart').css('display', 'block');
      }
    }
  }
}());
