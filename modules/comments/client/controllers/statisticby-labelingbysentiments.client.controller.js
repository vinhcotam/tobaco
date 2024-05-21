(function () {
  'use strict';

  angular
    .module('comments')
    .controller('LabelingbysentimentsStatisticController', LabelingbysentimentsStatisticController);

  LabelingbysentimentsStatisticController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsAllService', 'Notification', 'CommentsService', 'SentimentsService'];

  function LabelingbysentimentsStatisticController($scope, $filter, $state, $window, Authentication, CommentsAllService, Notification, CommentsService, SentimentsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.argumentMin = 0;
    vm.argumentMax = 5;
    $(document).ready(function () {
      displayPieChart();

      $(".line-chart a").click(function (e) {
        e.preventDefault();
        displayLineChart();
      });

      $(".default a").click(function (e) {
        e.preventDefault();
        displayPieChart();
        
      });
    });

    //pie chart
    function displayPieChart() {
      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        CommentsAllService.getAllComments(function (rows) {
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

          console.log("rows:", rows)
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
            responsive: true
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
    function displayLineChart() {
      $("#pieChart").hide();
      $("#lineChartt").show();
      $(".line-chart").addClass("active");
      $(".default").removeClass("active");
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        CommentsAllService.getAllComments(function (rows) {
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
            options: lineOptions
          });
        });
      });
    }


  }
}());
