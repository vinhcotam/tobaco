(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'Authentication', 'TopicsService', 'NewsdailiesService',
    'WebsitesService', 'NewsdailiesStatisticService', 'NewsdailiesStatisticGroupNewsService',
    'TaxonomiesService', 'TaxonomiesTreeService', 'NewsbytaxonomiesStatisticTaxoService', 'LabelingbytaxonomiesStatisticArguService', 'AssignedtopicsService', 'UsersService'
  ];

  function HomeController($scope, $state, Authentication, TopicsService,
    NewsdailiesService, WebsitesService, NewsdailiesStatisticService, NewsdailiesStatisticGroupNewsService,
    TaxonomiesService, TaxonomiesTreeService, NewsbytaxonomiesStatisticTaxoService, LabelingbytaxonomiesStatisticArguService, AssignedtopicsService, UsersService
  ) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user === null) {
      window.location.href = '/authentication/signin';
    }

    var roles = vm.authentication.user.roles;
    var isRole = -1;
    roles.forEach(function (element, index) {
      if (element === 'admin') {
        isRole = 0;
      } else if (element === 'manager' && isRole === -1) {
        isRole = 1;
      } else if (element === 'user' && isRole === -1) {
        isRole = 2;
      }
    });

    //
    ActionPage(vm, NewsdailiesStatisticService, NewsdailiesStatisticGroupNewsService,
      TaxonomiesService, TaxonomiesTreeService, NewsbytaxonomiesStatisticTaxoService, LabelingbytaxonomiesStatisticArguService,
      UsersService, isRole
    );

    AssignedtopicsService.statByRole().$promise.then(function (number) {
      if (number.length > 0) {
        vm.topics = number[0];
      } else {
        vm.topics = 0;
      }
    });
    // Get topic
    if (isRole === 2 || isRole === 1) {
      let topicIds = [];
      vm.authentication.user.topics.forEach(function (element, index) {
        topicIds.push(element.topic._id);
        if (element.working_status === 1) {
          vm.topic_active = element;
        }
      });
      NewsdailiesService.getTotal4Topics().$promise.then(function (number) {
        if (number.length > 0) {
          vm.articles = number[0].totalCount;
        } else {
          vm.filterLength = 0;
        }
      });
    } else {
      TopicsService.query({}, function (data) {
        vm.topics = data.length;
      });
      // Get Article
      NewsdailiesService.query({}, function (data) {
        vm.articles = data[0].count;
      });
    }
  }
  //
  function ActionPage(vm, NewsdailiesStatisticService, NewsdailiesStatisticGroupNewsService,
    TaxonomiesService, TaxonomiesTreeService, NewsbytaxonomiesStatisticTaxoService, LabelingbytaxonomiesStatisticArguService,
    UsersService, isRole
  ) {
    $(function () {
      'use strict';
      // Make the dashboard widgets sortable Using jquery UI
      $('.connectedSortable').sortable({
        placeholder: 'sort-highlight',
        connectWith: '.connectedSortable',
        handle: '.card-header, .nav-tabs',
        forcePlaceholderSize: true,
        zIndex: 999999
      });
      $('.connectedSortable .card-header').css('cursor', 'move');

      // bootstrap WYSIHTML5 - text editor
      $('.textarea').summernote();

      /* jQueryKnob */
      $('.knob').knob();

      // SLIMSCROLL FOR CHAT WIDGET
      $('#chat-box').overlayScrollbars({
        height: '250px'
      });

      // Get data for Statistic by websites
      var websiteChartCanvas = $('#websiteChart').get(0).getContext('2d');
      var websiteChartOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          position: 'right',
          display: false
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
              enabled: true
            }
          }
        }
      };
      var websiteChart = new Chart(websiteChartCanvas, {
        type: 'line',
        options: websiteChartOptions
      });
      NewsdailiesStatisticService.query({}, function (rows) {
        var labels = [];
        var data = [];
        var colors = [];
        var count = 0;
        vm.websites = rows.length;
        for (var i = 0; i < rows.length; i++) {
          labels.push(rows[i]._id.source_address[0]);
          data.push(rows[i].count);
          colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          count = count + rows[i].count;
        }
        websiteChart.data.labels = labels;
        websiteChart.data.datasets = [{
          data: data,
          backgroundColor: colors
        }];
        websiteChart.update();
      });

      // Get data for chart by group
      NewsdailiesStatisticGroupNewsService.query({}, function (rows) {
        vm.newsGroup = rows.length;
        var labels = [];
        var data = [];
        var colors = [];
        for (var i = 0; i < rows.length; i++) {
          if (isRole === 2 && rows[i].group_name === "Không xác định") {
            continue;
          }
          labels.push(rows[i].group_name);
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
        var pieChartCanvas = $('#newsGroupChart').get(0).getContext('2d');
        var pieData = donutData;
        var pieOptions = {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'right'
          }
        };

        var pieChart = new Chart(pieChartCanvas, {
          type: 'pie',
          data: pieData,
          options: pieOptions
        });
      });

      // Get data for chart by argument
      LabelingbytaxonomiesStatisticArguService.query({}, function (rows) {
        var labels = [];
        var data = [];
        var colors = [];
        for (var i = 0; i < rows.length; i++) {
          if (isRole === 2 && rows[i]._id.name.length === 0) {
            continue;
          }
          labels.push(rows[i]._id.name[0]);
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
        var pieChartCanvas = $('#argumentChart').get(0).getContext('2d');
        var pieData = donutData;
        var pieOptions = {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'right'
          }
        };
        // Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        var pieChart = new Chart(pieChartCanvas, {
          type: 'pie',
          data: pieData,
          options: pieOptions
        });
      });

      // Get data for TI tactic
      NewsbytaxonomiesStatisticTaxoService.query({}, function (data) {
        vm.statisticbytaxo = data;
        TaxonomiesService.gettreebytopic({}, function (tree) {
          var data = BFS(tree, vm.statisticbytaxo);
          var treePlugin = new d3.mitchTree.boxedTree()
            .setData(data)
            .setAllowFocus(false)
            .setElement(document.getElementById("visualisation"))
            .setIdAccessor(function (data) {
              return data.id;
            })
            .setChildrenAccessor(function (data) {
              return data.children;
            })
            .setBodyDisplayTextAccessor(function (data) {
              return data.description;
            })
            .setTitleDisplayTextAccessor(function (data) {
              return data.name;
            })
            .on("nodeClick", function (event) {
              vm.id = event.data._id;
              if (event.type === 'focus')
                console.log("Node is being focused");
              else if (event.type === 'collapse')
                console.log("Node is collapsing");
              else if (event.type === 'expand')
                console.log("Node is expanding");
            })
            // .getNodeSettings()
            // .setSizingMode('nodesize')
            // .setVerticalSpacing(30)
            // .setHorizontalSpacing(100)
            // .back()
            .initialize();
          var nodes = treePlugin.getNodes();
          treePlugin.update(treePlugin.getRoot());
        });
      });
      function BFS(tree, statisticdata) {
        var visited = [];
        var queue = [];
        var current = tree;
        queue.push(current);
        while (queue.length) {
          current = queue.shift();
          var data = statisticdata.find(x => x.taxonomy === current._id);
          var count = data !== undefined ? data.count : 0;
          current.name = current.taxonomy_name;
          if (current.parentId === null) {
            current.description = current.taxonomy_description;
          } else {
            current.description = "Total news: " + count;
          }
          visited.push({
            id: current._id,
            name: current.taxonomy_name,
            description: "Total news: " + count
          });
          if (typeof current.children === 'object' && current.children.length > 0) {
            current.children.sort(function (a, b) {
              var nameA = a.taxonomy_name.toUpperCase(); // ignore upper and lowercase
              var nameB = b.taxonomy_name.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            }).forEach(function (element) {
              queue.push(element);
            });
          }
        }
        return tree;
      }
    });
  }
}());

