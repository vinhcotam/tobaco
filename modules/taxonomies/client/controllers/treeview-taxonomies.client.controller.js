(function () {
  'use strict';

  angular
    .module('taxonomies')
    .controller('TaxonomiesTreeviewController', TaxonomiesTreeviewController);

  TaxonomiesTreeviewController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'taxonomyResolve', 'treeResolve', 'TaxonomiesService'];

  function TaxonomiesTreeviewController($scope, $filter, $state, $window, Authentication, taxonomy, tree, TaxonomiesService) {
    var vm = this;
    vm.id = taxonomy._id;

    $('#btn_add').click(function () {
      $state.go('taxonomies.createleaf', {
        taxonomyId: vm.id //  taxonomy._id
      });
    });

    $('#btn_edit').click(function () {
      $state.go('taxonomies.edit', {
        taxonomyId: vm.id
      });
    });

    $('#btn_delete').click(function () {
      alert("coming soon");
    });

    function BFS(tree) {
      let visited = [],
        queue = [],
        current = tree;
      queue.push(current);
      while (queue.length) {
        current = queue.shift();
        current.name = current.taxonomy_name;
        current.description = current.taxonomy_description;
        visited.push({
          id: current._id,
          name: current.taxonomy_name,
          description: current.taxonomy_description
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

            // names must be equal
            return 0;
          }).forEach(function (element) {
            queue.push(element);
          });
        }
        // if (current.left) queue.push(current.left);
        // if (current.right) queue.push(current.right);
      }
      // return visited;
      return tree;
    }
    console.log(BFS(tree));
    var data = BFS(tree);

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
        if (event.type === 'focus')
          console.log("Node is being focused");
        else if (event.type === 'collapse')
          console.log("Node is collapsing");
        else if (event.type === 'expand')
          console.log("Node is expanding");
        // You use the below line to cancel the
        // focus/expand/collapse event
        //   event.preventDefault();
      })
      .getNodeSettings()
      .setSizingMode('nodesize')
      .setVerticalSpacing(30)
      // .setHorizontalSpacing(100)
      .back()
      .initialize();
    // Expand all nodes
    var nodes = treePlugin.getNodes();
    nodes.forEach(function (node, index, arr) {
      treePlugin.expand(node);
    });
    treePlugin.update(treePlugin.getRoot());
    // console.log(treePlugin.getSvg());
    // treePlugin.getZoomListener().scaleTo(treePlugin.getSvg(), 0.5);
    // treePlugin.getZoomListener().translateTo(treePlugin.getSvg(), treePlugin.getWidthWithoutMargins(), treePlugin.getHeightWithoutMargins() / 2);
  /* Alternative Options Object Syntax, opposed to the Fluent Interface Above
    var options = {
      data: data,
      allowPan: false
      element: document.getElementById("visualisation"),
      getId: function (data) {
        return data.id;
      },
      getChildren: function (data) {
        return data.children;
      },
      getBodyDisplayText: function (data) {
        return data.description;
      },
      getTitleDisplayText: function (data) {
        return data.name;
      },
      events: {
        nodeClick: function(data, index, arr){
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
        }
      }
    };
    var treePlugin = new d3.mitchTree.boxedTree(options).initialize();
  */
  }
}());
