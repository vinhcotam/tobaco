
(function () {
  'use strict';

  angular
    .module('comments')
    .controller('Labelingv2commentsController', Labelingv2commentsController);

  Labelingv2commentsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams',
    '$http', 'SentimentsService', 'Notification', 'NewsdailiesService', 'LabelingbysentimentsStatisticService'
  ];

  function Labelingv2commentsController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, $http, SentimentsService, Notification, NewsdailiesService, LabelingbysentimentsStatisticService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    var newsId = $stateParams.newsId;
    var newsTitle = $stateParams.newsTitle
    var newsSummary = $stateParams.newsSummary

    vm.newsId = newsId
    NewsdailiesService.get({ newsdailyId: vm.newsId }, function (data) {
      vm.newsTitle = data.news_title
      vm.newsSummary = data.news_summary
    });
    vm.newsTitle = newsTitle
    vm.newsSummary = newsSummary
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.buildPager();
    vm.goToLabel = function (newsId) {
      $state.go('comments.labeling', { newsId: vm.newsId });
    };
    vm.goToLabeling = function (newsId) {
      $state.go('comments.labeling_v2', { newsId: vm.newsId });
    };
    var source = new EventSource('/sse');
    source.addEventListener('message', function (event) {
      var updatedComment = JSON.parse(event.data);
      vm.comments = []
      vm.comments.push(updatedComment);
      figureOutItemsToDisplay()
    });
    $scope.updateResearcherScore = function (comment) {
      var selectedSentiment = vm.sentiments.find(function (sentiment) {
        return sentiment._id === comment.sentiment_researcher;
      });
    
      if (selectedSentiment) {
        comment.researcher_score = selectedSentiment.sentiment_score;
      } else {
        comment.researcher_score = null;
      }
    };
    

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

    vm.displayLineChart = function(comments) {
      var sentimentMap = {};
      comments = comments || vm.filteredComments;
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
        maintainAspectRatio: false,
        responsive: true
      };
    
      console.log("Creating new line chart instance");
      vm.lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: lineData,
        options: lineOptions
      });
    }
    
    
    
    
    
    
    
    // vm.displayLineChart = function (comments) {
    //   var sentimentMap = {};
    //   comments = comments || vm.filteredComments;
    //   console.log("displayLineChart function called");
    //   $("#pieChart").hide();
    //   $("#lineChartt").show();
    //   $(".line-chart").addClass("active");
    //   $(".default").removeClass("active");
    //   if (vm.lineChart) {
    //     console.log("Destroying existing line chart instance");
    //     vm.lineChart.destroy();
    //   }

    //   // Populate sentimentMap with sentiment data by date
    //   for (var i = 0; i < comments.length; i++) {
    //     var sentimentValue = comments[i].sentiment_researcher || comments[i].sentiment_ai;
    //     var sentimentName = '';
    //     for (var k = 0; k < vm.sentiments.length; k++) {
    //       if (vm.sentiments[k]._id === sentimentValue) {
    //         sentimentName = vm.sentiments[k].name;
    //         break;
    //       }
    //     }
    //     var date = new Date(comments[i].date_comment).toISOString().split('T')[0]; // Extracting the date part
    //     if (!sentimentMap[sentimentName]) {
    //       sentimentMap[sentimentName] = {};
    //     }
    //     if (!sentimentMap[sentimentName][date]) {
    //       sentimentMap[sentimentName][date] = 1;
    //     } else {
    //       sentimentMap[sentimentName][date]++;
    //     }
    //   }

    //   var labels = [];
    //   var data = [];

    //   // Collect all dates and sort them
    //   for (var sentimentName in sentimentMap) {
    //     var dates = Object.keys(sentimentMap[sentimentName]);
    //     dates.sort();
    //     for (var j = 0; j < dates.length; j++) {
    //       if (!labels.includes(dates[j])) {
    //         labels.push(dates[j]);
    //       }
    //     }
    //   }

    //   // Initialize data array for each sentiment with cumulative counts for consecutive days
    //   for (var sentimentName in sentimentMap) {
    //     var cumulativeData = [];
    //     var cumulativeCount = 0;
    //     var prevDate = null;
    //     for (var j = 0; j < labels.length; j++) {
    //       var date = labels[j];
    //       if (prevDate && (new Date(date) - new Date(prevDate)) / (1000 * 60 * 60 * 24) === 1) {
    //         cumulativeCount += sentimentMap[sentimentName][date] || 0;
    //       } else {
    //         cumulativeCount = sentimentMap[sentimentName][date] || 0;
    //       }
    //       cumulativeData.push(cumulativeCount);
    //       prevDate = date;
    //     }
    //     data.push(cumulativeData);
    //   }

    //   var lineData = {
    //     labels: labels,
    //     datasets: []
    //   };

    //   for (var i = 0; i < vm.sentiments.length; i++) {
    //     var sentiment = vm.sentiments[i];
    //     var color = sentiment.color;

    //     lineData.datasets.push({
    //       label: sentiment.name,
    //       data: data[i] || [],
    //       fill: false,
    //       borderColor: color,
    //       lineTension: 0.1
    //     });
    //   }

    //   var lineChartCanvas = $('#lineChartt').get(0).getContext('2d');
    //   var lineOptions = {
    //     maintainAspectRatio: false,
    //     responsive: true
    //   };

    //   console.log("Creating new line chart instance");
    //   vm.lineChart = new Chart(lineChartCanvas, {
    //     type: 'line',
    //     data: lineData,
    //     options: lineOptions
    //   });
    // }

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
    vm.confirmLabeling = function () {
      if (confirm("Confirm labels ?")) {
        var updatePromises = [];
        console.log("vmmm", vm.comments)
        vm.comments.forEach(function (element) {
          updatePromises.push(CommentsService.update(element).$promise);
        });

        Promise.all(updatePromises)
          .then(function (results) {
            console.log("All comments have been updated:", results);
            Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Labeling Updated!' });
          })
          .catch(function (error) {
            console.error("Error updating comments:", error);
            Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling Not Updated!' });
          });
      } else {
        console.log("Update canceled!");
      }
    };

    vm.newsId = $stateParams.newsId;
    vm.autoLabeling = function () {
      console.log("print", vm.newsId)
      var apiUrl = 'http://localhost:5000/sentiment';
      var url = apiUrl + '?newsId=' + vm.newsId;
      console.log("print_url", url)
      $http.post(url)
        .then(function (response) {
          console.log(response);
          Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>AutoLabeling Updated!' });
          vm.figureOutItemsToDisplay();
        })
        .catch(function (error) {
          console.error(error);
          Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>AutoLabeling Fail!' });

        })
    }

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