(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams', 'SentimentsService', 'NewsdailiesService', 'LabelingbysentimentsStatisticService', 'NewsgroupsService'];

  function CommentsListController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, SentimentsService, NewsdailiesService, LabelingbysentimentsStatisticService, NewsgroupsService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    var newsId = $stateParams.newsId;
    vm.newsId = newsId
    NewsdailiesService.get({ newsdailyId: vm.newsId }, function (data) {
      vm.newsTitle = data.news_title
      vm.newsSummary = data.news_summary
    });
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.buildPager();
    vm.goToLabel = function (newsId) {
      $state.go('comments.labeling', { newsId: vm.newsId });

    };
    CommentsService.getTotal({ newsId: vm.newsId }).$promise.then(function (number) {
      vm.filterLength = number[0];
      vm.total = vm.filterLength;
      vm.totalPages = Math.ceil(vm.filterLength / vm.itemsPerPage);
    });
    vm.goToLabeling = function (newsId) {
      $state.go('comments.labeling_v2', { newsId: vm.newsId });

    };
    vm.goToNews = function () {
      $state.go('newsdailies.view', { newsdailyId: vm.newsId });
    }
    vm.goToReport = function () {
      $state.go('comments.statisticbysentimentsbyNews', { newsId: vm.newsId })
    }
    vm.openReportModal = function () {
      vm.reportInfo = "Thông tin báo cáo của bạn";
      vm.chartType == "pie"
      $('#reportModal').on('shown.bs.modal', function (e) {

        if (vm.chartType == "line") {
          vm.displayLineChart(vm.comments);
        } else {
          vm.displayPieChart(vm.comments);
        }
      });

      $('#reportModal').modal('show');

    };
    vm.filterArgumentByDate = function () {
      if (vm.startfilterdate != undefined || vm.endfilterdate != undefined) {
        document.getElementById("error-container").style.display = "none";
        var startDate = new Date(vm.startfilterdate);
        var endDate = new Date(vm.endfilterdate);
        endDate.setHours(23, 59, 59, 999);
        vm.filteredComments = vm.comments.filter(function (comment) {
          var commentDate = new Date(comment.date_comment);
          return commentDate >= startDate && commentDate <= endDate;
        });
        if (vm.chartType == "line") {
          vm.displayLineChart(vm.filteredComments);
        } else {
          vm.displayPieChart(vm.filteredComments);
        }
        console.log(vm.filteredComments)
      } else {
        console.log("zo")
        document.getElementById("error-container").style.display = "block";
        return;
      }

    }
    
    vm.displayPieChart = function (comments) {
      var donutData = {};
      console.log("displayPieChart function called");
      comments = comments || vm.filteredComments;
      vm.total = comments.length
      if(vm.total ==0){
        document.getElementById("no_data").style.display = "block";

      }else{
        document.getElementById("no_data").style.display = "none";

      }
      // Check and destroy the existing chart instance if it exists
      if (vm.pieChart) {
        console.log("Destroying existing pie chart instance");
        vm.pieChart.destroy();
      }
      var labels = [];
      var data = [];
      var colors = [];
      var sentimentMap = {};
      for (var i = 0; i < comments.length; i++) {
        var sentimentValue = comments[i].sentiment_researcher || comments[i].sentiment_ai;
        var sentimentName = '';
        for (var k = 0; k < vm.sentiments.length; k++) {
          if (vm.sentiments[k]._id === sentimentValue) {
            sentimentName = vm.sentiments[k].name;
            break;
          }
        }
        if (sentimentMap[sentimentName]) {
          sentimentMap[sentimentName].push(comments[i]);
        } else {
          sentimentMap[sentimentName] = [comments[i]];
        }
      }
      for (var sentimentName in sentimentMap) {
        var sentimentCount = sentimentMap[sentimentName].length;

        if (vm.isRole === 2 && sentimentName === "") {
          continue;
        }
        labels.push(sentimentName);
        data.push(sentimentCount);
        var sentiment = vm.sentiments.find(s => s.name === sentimentName);
        colors.push(sentiment ? sentiment.color : '#' + Math.floor(Math.random() * 16777215).toString(16));
      }
      for (var k = 0; k < vm.sentiments.length; k++) {
        var sentimentName = vm.sentiments[k].name;
        if (!sentimentMap[sentimentName]) {
          labels.push(sentimentName);
          data.push(0);
          colors.push(vm.sentiments[k].color);
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
      $("#pieChart").show();
      $("#lineChartt").hide();
      $(".default").addClass("active");
      $(".line-chart").removeClass("active");
      console.log("Creating new pie chart instance");
      vm.pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: pieData,
        options: pieOptions
      });
    }
    vm.displayLineChart = function (comments) {
      var sentimentMap = {};
      comments = comments || vm.filteredComments;
      vm.total = comments.length;
      if(vm.total ==0){
        document.getElementById("no_data").style.display = "block";

      }else{
        document.getElementById("no_data").style.display = "none";

      }
      console.log("displayLineChart function called");
      $("#pieChart").hide();
      $("#lineChartt").show();
      $(".line-chart").addClass("active");
      $(".default").removeClass("active");
      if (vm.lineChart) {
        console.log("Destroying existing line chart instance");
        vm.lineChart.destroy();
      }

      // Prepare colors and labels for each sentiment
      var sentimentColors = {};
      var sentimentLabels = {};
      for (var i = 0; i < vm.sentiments.length; i++) {
        var sentiment = vm.sentiments[i];
        sentimentColors[sentiment._id] = sentiment.color;
        sentimentLabels[sentiment._id] = sentiment.name;
      }

      // Populate sentimentMap with sentiment data by date
      for (var i = 0; i < comments.length; i++) {
        var sentimentValue = comments[i].sentiment_researcher || comments[i].sentiment_ai;
        var sentimentName = '';
        for (var k = 0; k < vm.sentiments.length; k++) {
          if (vm.sentiments[k]._id === sentimentValue) {
            sentimentName = vm.sentiments[k].name;
            break;
          }
        }
        var date = new Date(comments[i].date_comment).toISOString().split('T')[0]; // Extracting the date part
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

      // Collect all dates
      for (var sentimentName in sentimentMap) {
        var dates = Object.keys(sentimentMap[sentimentName]);
        for (var j = 0; j < dates.length; j++) {
          if (!labels.includes(dates[j])) {
            labels.push(dates[j]);
          }
        }
      }

      // Initialize data array for each sentiment with cumulative counts for consecutive days
      for (var sentimentId in sentimentColors) {
        var sentimentName = sentimentLabels[sentimentId];
        var cumulativeData = [];
        var cumulativeCount = 0;

        for (var j = 0; j < labels.length; j++) {
          var date = labels[j];
          if (sentimentMap[sentimentName] && sentimentMap[sentimentName][date]) {
            cumulativeCount += sentimentMap[sentimentName][date];
          }
          cumulativeData.push(cumulativeCount);
        }
        data.push(cumulativeData);
      }

      var lineData = {
        labels: labels,
        datasets: []
      };

      // Assign color and label to each sentiment based on sentiment's id
      for (var i = 0; i < vm.sentiments.length; i++) {
        var sentiment = vm.sentiments[i];
        var color = sentimentColors[sentiment._id];
        var label = sentimentLabels[sentiment._id];

        lineData.datasets.push({
          label: label,
          data: data[i] || [],
          fill: false,
          borderColor: color,
          lineTension: 0.1
        });
      }

      var lineChartCanvas = $('#lineChartt').get(0).getContext('2d');
      var lineOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          position: 'right',
          display: false
        }
      };

      console.log("Creating new line chart instance");
      vm.lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: lineData,
        options: lineOptions
      });
    }

    
    $('#datetimefilter').daterangepicker({
      opens: 'left'
    }, function (start, end, label) {
      vm.startfilterdate = start.format('YYYY-MM-DD');
      vm.endfilterdate = end.format('YYYY-MM-DD');
      figureOutItemsToDisplay();
    });


    vm.checkDateEmpty = function () {
      vm.isDateEmpty = !vm.startfilterdate || !vm.endfilterdate;
    };



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
        CommentsService.getTotal(params).$promise.then(function (number) {
          vm.filterLength = number[0];
          vm.totalPages = Math.ceil(vm.filterLength / vm.itemsPerPage);
        });
      }
      if (angular.isDefined(newsId)) {
        params.newsId = newsId;
      }

      LabelingbysentimentsStatisticService.query(params, function (data) {
        vm.comments = data;
        
      });
      CommentsService.query(params, function (data) {
        vm.filteredItems = data;
        vm.pagedItems = data;
        // vm.comments = data;
        // console.log("vmm", data)
        SentimentsService.query(function (sentiments) {
          vm.sentiments = sentiments;
          data.forEach(function (element) {
            if (!element.hasOwnProperty('sentiment_researcher')) {
              element.sentiment_researcher = element.sentiment_ai;
            }
          });

          vm.getSentimentName = function (sentimentId) {
            for (var i = 0; i < vm.sentiments.length; i++) {
              if (vm.sentiments[i]._id === sentimentId) {
                return vm.sentiments[i].name;
              }
            }
            return '';
          };
          vm.getSentimentBackgroundColor = function (sentimentId) {
            for (var i = 0; i < vm.sentiments.length; i++) {
              if (vm.sentiments[i]._id === sentimentId) {
                return vm.sentiments[i].color;
              }
            }
            return '';
          };
        });
      });


    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());