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
    vm.selectedNewsGroupId = 0;
    loadNewsGroups();

    function loadNewsGroups() {
      NewsgroupsService.query({}, function (data) {
        vm.newsGroups = data;
        vm.isLoaded = true;
        if (vm.selectedNewsGroupId == 0) {
          vm.filterByGroups()
        }
      });
    }
    var params ={};
    vm.filterByGroups = function () {
      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");
      
      if(vm.selectedNewsGroupId != undefined){
        params = {
          newsgroup: vm.selectedNewsGroupId
        }
        
      }
      console.log("vm.chartType", vm.chartType);
      if (vm.chartType == "line"){
        vm.displayLineChart(params);
      }else{
        vm.displayPieChart(params);
      }
      
    };
    //pie chart
    vm.displayPieChart = function displayPieChart(params) {
      // Debugging log to check function call
      console.log("displayPieChart function called");

      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");

      // Check and destroy the existing chart instance if it exists
      if (vm.pieChart) {
        console.log("Destroying existing pie chart instance");
        vm.pieChart.destroy();
      }

      var labels = [];
      var data = [];
      var colors = [];
      var sentimentMap = {};

      if(params == undefined){
        params = {
          newsgroup: vm.selectedNewsGroupId
        }
      }
      var donutData = {};
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        var sentimentColorMap = {};
        sentiments.forEach(function (sentiment) {
          sentimentColorMap[sentiment._id] = sentiment.color;
        });
        LabelingbysentimentsStatisticService.query(params, function (rows) {

          var roles = vm.authentication.user.roles;
          vm.isRole = -1;
          roles.forEach(function (element) {
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
            var sentiment = sentiments.find(s => s.name === sentimentName);
            colors.push(sentiment ? sentiment.color : '#' + Math.floor(Math.random() * 16777215).toString(16));
          }

          for (var k = 0; k < sentiments.length; k++) {
            var sentimentName = sentiments[k].name;
            if (!sentimentMap[sentimentName]) {
              labels.push(sentimentName);
              data.push(0);
              colors.push(sentiments[k].color);
            }
          }

          donutData = {
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

          console.log("Creating new pie chart instance");
          vm.pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: pieData,
            options: pieOptions
          });
        });
      });

    }

    //line chart
    vm.displayLineChart = function displayLineChart() {
      console.log("displayLineChart function called");

      $("#pieChart").hide();
      $("#lineChartt").show();
      $(".line-chart").addClass("active");
      $(".default").removeClass("active");
      if (vm.lineChart) {
        console.log("Destroying existing pie chart instance");
        vm.lineChart.destroy();
      }
      SentimentsService.query(function (sentiments) {
        vm.sentiments = sentiments;
        var sentimentColorMap = {};
        sentiments.forEach(function (sentiment) {
          sentimentColorMap[sentiment._id] = sentiment.color;
        });

        LabelingbysentimentsStatisticService.query({ newsgroup: vm.selectedNewsGroupId }, function (rows) {
          var sentimentMap = {};
          var roles = vm.authentication.user.roles;
          vm.isRole = -1;
          roles.forEach(function (element) {
            if (element === 'admin') {
              vm.isRole = 0;
            } else if (element === 'manager' && vm.isRole === -1) {
              vm.isRole = 1;
            } else if (element === 'user' && vm.isRole === -1) {
              vm.isRole = 2;
            }
          });

          vm.totals = rows.length;
          console.log("aaa", rows);
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
            if (date.includes('/')) {
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

          for (var sentimentName in sentimentMap) {
            var dates = Object.keys(sentimentMap[sentimentName]);
            dates.sort();
            for (var j = 0; j < dates.length; j++) {
              if (!labels.includes(dates[j])) {
                labels.push(dates[j]);
              }
            }
          }

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

          for (var i = 0; i < Object.keys(sentimentMap).length; i++) {
            var sentimentName = Object.keys(sentimentMap)[i];
            var sentimentId = sentiments.find(sentiment => sentiment.name === sentimentName)._id;
            var color = sentimentColorMap[sentimentId] || '#' + Math.floor(Math.random() * 16777215).toString(16);

            lineData.datasets.push({
              label: sentimentName,
              data: data[i],
              fill: false,
              borderColor: color,
              lineTension: 0.1
            });
          }

          var lineChartCanvas = $('#lineChartt').get(0).getContext('2d');
          var lineOptions = {
            maintainAspectRatio: false,
            responsive: true
          };

          console.log("Creating new pie chart instance");
          vm.lineChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineData,
            options: lineOptions
          });
        });
      });

      // SentimentsService.query(function (sentiments) {
      //   vm.sentiments = sentiments;
      //   LabelingbysentimentsStatisticService.query({ newsgroup: vm.selectedNewsGroupId }, function (rows) {
      //     var sentimentMap = {};
      //     var roles = vm.authentication.user.roles;
      //     vm.isRole = -1;
      //     roles.forEach(function (element, index) {
      //       if (element === 'admin') {
      //         vm.isRole = 0;
      //       } else if (element === 'manager' && vm.isRole === -1) {
      //         vm.isRole = 1;
      //       } else if (element === 'user' && vm.isRole === -1) {
      //         vm.isRole = 2;
      //       }
      //     });
      //     vm.totals = rows.length;
      //     console.log("aaa", rows);
      //     for (var i = 0; i < rows.length; i++) {
      //       var sentimentValue = rows[i].sentiment_researcher || rows[i].sentiment_ai;
      //       var sentimentName = '';
      //       for (var k = 0; k < sentiments.length; k++) {
      //         if (sentiments[k]._id === sentimentValue) {
      //           sentimentName = sentiments[k].name;
      //           break;
      //         }
      //       }
      //       var date = rows[i].date_comment;
      //       if (date.includes('/')) { 
      //         var parts = date.split('/');
      //         date = parts[2] + '-' + parts[1] + '-' + parts[0];
      //       }
      //       if (!sentimentMap[sentimentName]) {
      //         sentimentMap[sentimentName] = {};
      //       }
      //       if (!sentimentMap[sentimentName][date]) {
      //         sentimentMap[sentimentName][date] = 1;
      //       } else {
      //         sentimentMap[sentimentName][date]++;
      //       }
      //     }

      //     var labels = [];
      //     var data = [];

      //     for (var sentimentName in sentimentMap) {
      //       var dates = Object.keys(sentimentMap[sentimentName]);
      //       dates.sort();
      //       for (var j = 0; j < dates.length; j++) {
      //         if (!labels.includes(dates[j])) {
      //           labels.push(dates[j]);
      //         }
      //       }
      //     }

      //     for (var sentimentName in sentimentMap) {
      //       var sentimentData = [];
      //       for (var j = 0; j < labels.length; j++) {
      //         sentimentData.push(sentimentMap[sentimentName][labels[j]] || 0);
      //       }
      //       data.push(sentimentData);
      //     }

      //     var lineData = {
      //       labels: labels,
      //       datasets: []
      //     };

      //     for (var i = 0; i < Object.keys(sentimentMap).length; i++) {
      //       lineData.datasets.push({
      //         label: Object.keys(sentimentMap)[i],
      //         data: data[i],
      //         fill: false,
      //         borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      //         lineTension: 0.1
      //       });
      //     }

      //     var lineChartCanvas = $('#lineChartt').get(0).getContext('2d');
      //     var lineOptions = {
      //       maintainAspectRatio: false,
      //       responsive: true
      //     };
      //     var lineChart = new Chart(lineChartCanvas, {
      //       type: 'line',
      //       data: lineData,
      //       options: lineOptions,
      //     });
      //   });
      // });
    }

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
    vm.filterArgumentByDate = function () {
      vm.filtergroupstartdate = $('input#startdate').val();
      vm.filtergroupenddate = $('input#enddate').val();
      $('#lineChartMonth').css('display', 'none');
      if (vm.filtergroupstartdate !== '' && vm.filtergroupenddate !== '') {
        var params = {
          start: new Date(new Date(vm.filtergroupstartdate).setDate(new Date(vm.filtergroupstartdate).getDate() - 7)),
          end: vm.filtergroupenddate,
          newsgroup: vm.selectedNewsGroupId
        }
        if (vm.chartType == "line"){
          vm.displayLineChart(params);
        }else{
          vm.displayPieChart(params);
        }
      }
    }
    vm.filterArgumentByMonth = function () {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let startMonth = $('input#start-month').val();
      let endMonth = $('input#end-month').val();
      if (vm.pieChart) {
        console.log("Destroying existing pie chart instance");
        vm.pieChart.destroy();
      }
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
          end: new Date(endMonthFormat.setMonth(endMonthFormat.getMonth() + 1)),
          newsgroup: vm.selectedNewsGroupId

        };
        if (vm.chartType == "line"){
          vm.displayLineChart(params);
        }else{
          vm.displayPieChart(params);
        }
      }
    }
    vm.downloadCanvasAsImage = function() {
      var canvas = document.getElementById('pieChart');
      var image = canvas.toDataURL('image/png');
      
      var link = document.createElement('a');
      link.href = image;
      link.download = 'chart.png';
      
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
    }
    
  }
}());
