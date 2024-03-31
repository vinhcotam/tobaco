(function () {
  'use strict';

  angular
    .module('taxonomies')
    .controller('StatisticTaxoTreeviewController', StatisticTaxoTreeviewController);

  StatisticTaxoTreeviewController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'TaxonomiesService', 'TaxonomiesTreeService', 'NewsbytaxonomiesStatisticTaxoService'];

  function StatisticTaxoTreeviewController($scope, $filter, $state, $window, Authentication, TaxonomiesService, TaxonomiesTreeService, NewsbytaxonomiesStatisticTaxoService) {
    var vm = this;
    NewsbytaxonomiesStatisticTaxoService.query({}, function (data) {
      vm.statisticbytaxo = data;
      TaxonomiesService.gettreebytopic({}, function (tree) {
        console.log(vm.statisticbytaxo);
        var data = BFS(tree, vm.statisticbytaxo);

        var treePlugin = new d3.mitchTree.boxedTree()
          .setData(data)
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
            console.log('The event object:')
            console.log(event);
            vm.id = event.data._id;
            console.log("Click event was triggered!");

            // Note for 'collapse' or 'expand' event type
            // to trigger, you'll need to disable focus mode.
            // You can do this by passing in false for the
            // allowFocus setting.
            if (event.type == 'focus')
              console.log("Node is being focused");
            else if (event.type == 'collapse')
              console.log("Node is collapsing");
            else if (event.type == 'expand')
              console.log("Node is expanding");
            // You use the below line to cancel the
            // focus/expand/collapse event
            //   event.preventDefault();
          })
          .getNodeSettings()
          .setSizingMode('nodesize')
          .setVerticalSpacing(30)
          //.setHorizontalSpacing(100)
          .back()
          .initialize();
        // Expand all nodes
        var nodes = treePlugin.getNodes();
        nodes.forEach(function (node, index, arr) {
          treePlugin.expand(node);
        });
        treePlugin.update(treePlugin.getRoot());
      })
    });
    
    /*TaxonomiesService.query({}, function (taxonomy) {
      vm.taxonomy = taxonomy;
      vm.id = taxonomy[0]._id;
      TaxonomiesTreeService.get({
        taxonomyId: taxonomy[0]._id
      }, function (tree) {
          console.log(vm.statisticbytaxo);
          var data = BFS(tree, vm.statisticbytaxo);

          var treePlugin = new d3.mitchTree.boxedTree()
            .setData(data)
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
              console.log('The event object:')
              console.log(event);
              vm.id = event.data._id;
              console.log("Click event was triggered!");

              // Note for 'collapse' or 'expand' event type
              // to trigger, you'll need to disable focus mode.
              // You can do this by passing in false for the
              // allowFocus setting.
              if (event.type == 'focus')
                console.log("Node is being focused");
              else if (event.type == 'collapse')
                console.log("Node is collapsing");
              else if (event.type == 'expand')
                console.log("Node is expanding");
              // You use the below line to cancel the
              // focus/expand/collapse event
              //   event.preventDefault();
            })
            .initialize();
          // Expand all nodes
          var nodes = treePlugin.getNodes();
          nodes.forEach(function (node, index, arr) {
            treePlugin.expand(node);
          });
          treePlugin.update(treePlugin.getRoot());
      });
    })*/
 
    function BFS(tree, statisticdata) {
      var  visited = [];
      var queue = [];
      var current = tree;
      queue.push(current);
      while (queue.length) {
        current = queue.shift();
        console.log(current);
        var data = statisticdata.find(x => x.taxonomy == current._id);
        var count = data != undefined ? data.count : 0;
        console.log(count);
        current.name = current.taxonomy_name;
        if (current.parentId == null) {
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
          current.children.sort(function(a, b) {
            var nameA = a.taxonomy_name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.taxonomy_name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          }).forEach(function (element) {
            queue.push(element);
          });
        }
        //if (current.left) queue.push(current.left);
        //if (current.right) queue.push(current.right);
      };

      //return visited;
      return tree;
    }
  }
}());
