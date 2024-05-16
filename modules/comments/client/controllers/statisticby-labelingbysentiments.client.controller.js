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
        // for (var i = 0; i < rows.length; i++) {
        //   if (vm.isRole === 2 && rows[i]._id.name.length === 0) {
        //     continue;
        //   }
        //   labels.push(rows[i]._id.name[0]);
        //   data.push(rows[i].count);
        //   colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        // }
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
}());
