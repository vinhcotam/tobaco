(function () {
  'use strict';

  angular
    .module('comments')
    .controller('LabelingbysentimentsStatisticController', LabelingbysentimentsStatisticController);

  LabelingbysentimentsStatisticController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsAllService', 'Notification', 'CommentsService', 'SentimentsService', 'LabelingbysentimentsStatisticService', 'NewsgroupsService'];

  function LabelingbysentimentsStatisticController($scope, $filter, $state, $window, Authentication, CommentsAllService, Notification, CommentsService, SentimentsService, LabelingbysentimentsStatisticService, NewsgroupsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.argumentMin = 0;
    vm.argumentMax = 5;
    vm.isLoaded = false;
    vm.newsGroups = [];

    loadNewsGroups();

    function loadNewsGroups() {
      NewsgroupsService.query({}, function (data) {
        vm.newsGroups = data;
        vm.isLoaded = true;
        console.log("groupss", vm.newsGroups);
      });
    }
    vm.filterByGroups = function() {
      console.log("Selected value: ", vm.selectedNewsGroupId);
      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        LabelingbysentimentsStatisticService.query({newsgroup: vm.selectedNewsGroupId}, function (rows) {
          var labels = [];
          var data = [];
          var colors = [];
          var sentimentMap = {};
          var roles = vm.authentication.user.roles;
          vm.isRole = -1;
          roles.forEach(function (element, index) {
            if (element === 'admin') {
              vm.isRole = 0;
            } else if (element === 'manager' && vm.isRole === -1) {
              vm.isRole = 1;
            } else if (element === 'user' && vm.isRole === -1) {
              vm.isRole = 2;
            }
          });
          vm.totals = rows.length
          for (var i = 0; i < rows.length - 1; i++) {
            var sentimentValue = rows[i].sentiment_researcher || rows[i].sentiment_ai;
            var sentimentName = '';
            for (var k = 0; k < sentiments.length; k++) {
              if (sentiments[k]._id === sentimentValue) {
                sentimentName = sentiments[k].name;
                break;
              }
            }
            if (sentimentMap[sentimentName]) {
              sentimentMap[sentimentName].push(rows[i]);
            } else {
              sentimentMap[sentimentName] = [rows[i]];
            }
          }
          for (var sentimentName in sentimentMap) {
            var sentimentCount = sentimentMap[sentimentName].length;

            if (vm.isRole === 2 && sentimentName === "") {
              continue;
            }
            labels.push(sentimentName);
            data.push(sentimentCount);
            colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          }

          for (var k = 0; k < sentiments.length; k++) {
            var sentimentName = sentiments[k].name;
            if (!sentimentMap[sentimentName]) {
              labels.push(sentimentName);
              data.push(0);
              colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
            }
          }
          var donutData = {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors
            }]
          };


          var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
          var pieData = donutData;

          var pieOptions = {
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var dataset = data.datasets[tooltipItem.datasetIndex];
                  var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex) {
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    if (!meta.data[currentIndex].hidden) {
                      return previousValue + currentValue;
                    }
                    return previousValue;
                  }, 0);

                  var currentValue = dataset.data[tooltipItem.index];
                  var percentage = (currentValue / total * 100).toFixed(2);
                  return data.labels[tooltipItem.index] + ': ' + currentValue + ' (' + percentage + '%)';
                }
              }
            }
          };
          var pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: pieData,
            options: pieOptions
          });
        });
      });
    };    
    //pie chart
    vm.displayPieChart = function displayPieChart() {
      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        LabelingbysentimentsStatisticService.query({}, function (rows) {
          var labels = [];
          var data = [];
          var colors = [];
          var sentimentMap = {};
          var roles = vm.authentication.user.roles;
          vm.isRole = -1;
          roles.forEach(function (element, index) {
            if (element === 'admin') {
              vm.isRole = 0;
            } else if (element === 'manager' && vm.isRole === -1) {
              vm.isRole = 1;
            } else if (element === 'user' && vm.isRole === -1) {
              vm.isRole = 2;
            }
          });
          vm.totals = rows.length
          for (var i = 0; i < rows.length - 1; i++) {
            var sentimentValue = rows[i].sentiment_researcher || rows[i].sentiment_ai;
            var sentimentName = '';
            for (var k = 0; k < sentiments.length; k++) {
              if (sentiments[k]._id === sentimentValue) {
                sentimentName = sentiments[k].name;
                break;
              }
            }
            if (sentimentMap[sentimentName]) {
              sentimentMap[sentimentName].push(rows[i]);
            } else {
              sentimentMap[sentimentName] = [rows[i]];
            }
          }
          for (var sentimentName in sentimentMap) {
            var sentimentCount = sentimentMap[sentimentName].length;

            if (vm.isRole === 2 && sentimentName === "") {
              continue;
            }
            labels.push(sentimentName);
            data.push(sentimentCount);
            colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          }

          for (var k = 0; k < sentiments.length; k++) {
            var sentimentName = sentiments[k].name;
            if (!sentimentMap[sentimentName]) {
              labels.push(sentimentName);
              data.push(0);
              colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
            }
          }
          var donutData = {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors
            }]
          };


          var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
          var pieData = donutData;

          var pieOptions = {
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var dataset = data.datasets[tooltipItem.datasetIndex];
                  var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex) {
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    if (!meta.data[currentIndex].hidden) {
                      return previousValue + currentValue;
                    }
                    return previousValue;
                  }, 0);

                  var currentValue = dataset.data[tooltipItem.index];
                  var percentage = (currentValue / total * 100).toFixed(2);
                  return data.labels[tooltipItem.index] + ': ' + currentValue + ' (' + percentage + '%)';
                }
              }
            }
          };


          var pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: pieData,
            options: pieOptions
          });




        });
      });
    }
    //line chart
    vm.displayLineChart =function displayLineChart() {
      $("#pieChart").hide();
      $("#lineChartt").show();
      $(".line-chart").addClass("active");
      $(".default").removeClass("active");
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        LabelingbysentimentsStatisticService.query({}, function (rows) {
          var sentimentMap = {};
          var roles = vm.authentication.user.roles;
          vm.isRole = -1;
          roles.forEach(function (element, index) {
            if (element === 'admin') {
              vm.isRole = 0;
            } else if (element === 'manager' && vm.isRole === -1) {
              vm.isRole = 1;
            } else if (element === 'user' && vm.isRole === -1) {
              vm.isRole = 2;
            }
          });
          vm.totals = rows.length;
          for (var i = 0; i < rows.length; i++) {
            var sentimentValue = rows[i].sentiment_researcher || rows[i].sentiment_ai;
            var sentimentName = '';
            for (var k = 0; k < sentiments.length; k++) {
              if (sentiments[k]._id === sentimentValue) {
                sentimentName = sentiments[k].name;
                break;
              }
            }
            var date = rows[i].date_comment;
            if (date.includes('/')) { // Convert 'dd/mm/yyyy' to 'yyyy-mm-dd'
              var parts = date.split('/');
              date = parts[2] + '-' + parts[1] + '-' + parts[0];
            }
            if (!sentimentMap[sentimentName]) {
              sentimentMap[sentimentName] = {};
            }
            if (!sentimentMap[sentimentName][date]) {
              sentimentMap[sentimentName][date] = 1;
            } else {
              sentimentMap[sentimentName][date]++;
            }
          }

          var labels = [];
          var data = [];

          // Tạo mảng labels từ ngày comment và sắp xếp từ nhỏ đến lớn
          for (var sentimentName in sentimentMap) {
            var dates = Object.keys(sentimentMap[sentimentName]);
            dates.sort(); // Sắp xếp ngày comment từ nhỏ đến lớn
            for (var j = 0; j < dates.length; j++) {
              if (!labels.includes(dates[j])) {
                labels.push(dates[j]);
              }
            }
          }

          // Tạo mảng data với số lượng sentiment tương ứng trên mỗi ngày
          for (var sentimentName in sentimentMap) {
            var sentimentData = [];
            for (var j = 0; j < labels.length; j++) {
              sentimentData.push(sentimentMap[sentimentName][labels[j]] || 0);
            }
            data.push(sentimentData);
          }

          var lineData = {
            labels: labels,
            datasets: []
          };

          // Tạo mỗi dataset cho mỗi sentiment
          for (var i = 0; i < Object.keys(sentimentMap).length; i++) {
            lineData.datasets.push({
              label: Object.keys(sentimentMap)[i],
              data: data[i],
              fill: false,
              borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
              lineTension: 0.1
            });
          }

          var lineChartCanvas = $('#lineChartt').get(0).getContext('2d');
          var lineOptions = {
            maintainAspectRatio: false,
            responsive: true
          };
          var lineChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineData,
            options: lineOptions,
          });
        });
      });
    }
    vm.displayPieChart();

    $('.filter-new-groups').on('click', 'li', function () {
      $('.filter-new-groups ul li.active').removeClass('active');
      $(this).addClass('active');
      if ($(this).hasClass('week')) {
        $('#btn_month_filter').addClass('hidden');
        $('#btn_week_filter').removeClass('hidden');
        $('.filter-new-groups-detail').removeClass('hidden');
        $('.start-date').removeClass('hidden');
        $('.end-date').removeClass('hidden');
        $('.start-month').addClass('hidden');
        $('.end-month').addClass('hidden');
      } else {
        if ($(this).hasClass('month')) {
          $('#btn_week_filter').addClass('hidden');
          $('#btn_month_filter').removeClass('hidden');
          $('.filter-new-groups-detail').removeClass('hidden');
          $('.start-date').addClass('hidden');
          $('.end-date').addClass('hidden');
          $('.start-month').removeClass('hidden');
          $('.end-month').removeClass('hidden');
        } else {
          $('.filter-new-groups-detail').addClass('hidden');
        }
      }
    });

    $(function () {
      $('#from-date').datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#end-date').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false
      });
    });
    $(function () {
      $('#startMonth').datetimepicker({
        format: 'YYYY-MM'
      });
      $('#endMonth').datetimepicker({
        format: 'YYYY-MM',
        useCurrent: false
      });
    });
    vm.filtergroupstartdate = '';
    vm.filtergroupenddate = '';
    function filterArgumentByDate() {
      vm.filtergroupstartdate = $('input#startdate').val();
      vm.filtergroupenddate = $('input#enddate').val();
      $('#lineChartMonth').css('display', 'none');
      if (vm.filtergroupstartdate !== '' && vm.filtergroupenddate !== '') {
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
            display: true
          }
        };
        var lineChart = new Chart(lineChart, {
          type: 'line',
          options: lineChartOptions
        });
        LabelingbytaxonomiesStatisticArguService.query(params, function (rows) {
          $('.display_line_chart').removeClass('hidden');
          $('.spinner-border').addClass('hidden');
          $('.card-body').addClass('hidden');
          $('#lineChart').css('display', 'block');
          var labels = [];
          var data = [0];
          var count = 0;
          vm.percentGroup = [];
          let loopDay = startDate;
          labels.push(startDate.toISOString().split('T')[0]);
          for (let i = 0; i < 6; i++) {
            labels.push(new Date(loopDay.setDate(loopDay.getDate() + 1)).toISOString().split('T')[0]);
            data.push(0);
          }
          let datasets = [];
          let countByNewsDaily = [];
          let percentGroup = [];
          let oldData = [];
          for (var i = 0; i < rows.length; i++) {
            let key = rows[i].name[0];
            if (new Date(rows[i]._id.posted[0].split('T')[0]) < new Date(vm.filtergroupstartdate).getTime()) {
              if (!(key in oldData)) {
                oldData[key] = rows[i].count;
              } else {
                oldData[key] = oldData[key] + rows[i].count;
              }
            }
            if (!(key in countByNewsDaily)) {
              countByNewsDaily[key] = rows[i].count;
            } else {
              countByNewsDaily[key] = countByNewsDaily[key] + rows[i].count;
            }
          }
          vm.oldData = oldData;
          for (var i = 0; i < rows.length; i++) {
            if (vm.isRole === 2 && rows[i]._id.name.length === 0) {
              continue;
            }
            let found = datasets.some(el => el.label === rows[i].name[0]);
            if (vm.argumentMin >= countByNewsDaily[rows[i].name[0]] || countByNewsDaily[rows[i].name[0]] >= vm.argumentMax) {
              continue;
            }
            if (new Date(rows[i]._id.posted[0].split('T')[0]).getTime() < new Date(vm.filtergroupstartdate).getTime()) {
              continue;
            }
            if (!found) {
              data.fill(0);
              let date = rows[i]._id.posted[0].split('T')[0];
              let index = labels.indexOf(date, 0);
              data[index] = rows[i].count;
              datasets.push({
                label: rows[i].name[0],
                data: [...data],
                fill: false,
                borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                backgroundColor: '#' + Math.floor(Math.random() * 16777220).toString(16)
              });
            } else {
              let indexMap = datasets.findIndex((el) => el.label === rows[i].name[0]);
              let date = rows[i]._id.posted[0].split('T')[0];
              let index = labels.indexOf(date, 0);
              datasets[indexMap].data[index] = rows[i].count;
            }
            count = count + rows[i].count;
          }
          datasets.forEach(function (item) {
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
            if (sum - vm.oldData[item.label] === 0) {
              type = 0;
            }
            percentGroup.push({
              label: item.label ? item.label : "Không xác định",
              type: type,
              compare_percent: Math.abs(Math.round((sum - (vm.oldData[item.label] ? vm.oldData[item.label] : 0)) * 100 / denominator)),
              percent: Math.round(sum * 100 / count),
              sum: sum
            });
          });
          vm.percentGroup = percentGroup;
          lineChart.data.labels = labels;
          lineChart.data.datasets = datasets;
          lineChart.update();
        });
      }
    }
    function filterArgumentByMonth() {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      $('#pieChart').css('display', 'none');
      $('#lineChart').css('display', 'none');
      let startMonth = $('input#start-month').val();
      let endMonth = $('input#end-month').val();
      var diffMonth = 0;
      if (startMonth !== '' && endMonth !== '') {
        let startMonthFormat = new Date(startMonth);
        let endMonthFormat = new Date(endMonth);
        diffMonth = endMonthFormat.getMonth() - startMonthFormat.getMonth();
        if (diffMonth === 0) {
          Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>The start and end date must different month!' });
          $('.spinner-border').addClass('hidden');
          $('#pieChart').css('display', 'block');
          return;
        }
        var params = {
          start: new Date(new Date(new Date(startMonth).setMonth(new Date(startMonth).getMonth() - 1)).setDate(1)),
          end: new Date(endMonthFormat.setMonth(endMonthFormat.getMonth() + 1))
        };
        var lineChart = $('#lineChartMonth').get(0).getContext('2d');
        var lineChartOptions = {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'bottom',
            display: true
          }
        };
        var lineChart = new Chart(lineChart, {
          type: 'line',
          options: lineChartOptions
        });
        LabelingbytaxonomiesStatisticArguService.query(params, function (rows) {
          $('.display_line_chart').removeClass('hidden');
          $('.spinner-border').addClass('hidden');
          $('.card-body').addClass('hidden');
          $('#lineChartMonth').css('display', 'block');
          var labels = [];
          var data = [0];
          var count = 0;
          vm.percentGroup = [];
          labels.push(months[startMonthFormat.getMonth()]);
          for (let i = 1; i <= diffMonth; i++) {
            labels.push(months[startMonthFormat.getMonth() + i]);
            data.push(0);
          }
          let datasets = [];
          let countByNewsDaily = [];
          let percentGroup = [];
          let oldData = [];
          for (var i = 0; i < rows.length; i++) {
            let key = rows[i].name[0];
            if (new Date(rows[i]._id.posted[0].split('T')[0]).getTime() < new Date(vm.filtergroupstartdate).getTime()) {
              if (!(key in oldData)) {
                oldData[key] = rows[i].count;
              } else {
                oldData[key] = oldData[key] + rows[i].count;
              }
            }
            if (!(key in countByNewsDaily)) {
              countByNewsDaily[key] = rows[i].count;
            } else {
              countByNewsDaily[key] = countByNewsDaily[key] + rows[i].count;
            }
          }
          vm.oldData = oldData;
          for (var i = 0; i < rows.length; i++) {
            if (vm.isRole === 2 && rows[i]._id.name.length === 0) {
              continue;
            }
            let found = datasets.some(el => el.label === rows[i].name[0]);
            if (vm.argumentMin > countByNewsDaily[rows[i].name[0]] || countByNewsDaily[rows[i].name[0]] > vm.argumentMax) {
              continue;
            }
            if (new Date(rows[i]._id.posted[0]).getTime() < new Date(startMonth).getTime()) {
              continue;
            }
            if (!found) {
              data.fill(0);
              let date = months[new Date(rows[i]._id.posted).getMonth()];
              let index = labels.indexOf(date, 0);
              data[index] = rows[i].count;
              datasets.push({
                label: rows[i].name[0],
                data: [...data],
                fill: false,
                borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                backgroundColor: '#' + Math.floor(Math.random() * 16777200).toString(16)
              });
            } else {
              let indexMap = datasets.findIndex((el) => el.label === rows[i].name[0]);
              let date = months[new Date(rows[i]._id.posted).getMonth()];
              let index = labels.indexOf(date, 0);
              datasets[indexMap].data[index] = rows[i].count;
            }
            count = count + rows[i].count;
          }
          datasets.forEach(function (item) {
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
            if (sum - vm.oldData[item.label] === 0) {
              type = 0;
            }
            percentGroup.push({
              label: item.label ? item.label : "Không xác định",
              type: type,
              compare_percent: Math.abs(Math.round((sum - (vm.oldData[item.label] ? vm.oldData[item.label] : 0)) * 100 / denominator)),
              percent: Math.round(sum * 100 / count),
              sum: sum
            });
          });
          vm.percentGroup = percentGroup;
          lineChart.data.labels = labels;
          lineChart.data.datasets = datasets;
          lineChart.update();
        });
      }
    }

  }
}());
