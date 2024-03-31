(function () {
  'use strict';

  // Taxonomies controller
  angular
    .module('taxonomies')
    .controller('TaxonomiesController', TaxonomiesController);

  TaxonomiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'taxonomyResolve', 'TopicsService', 'TaxonomiesService'];

  function TaxonomiesController($scope, $state, $window, Authentication, taxonomy, TopicsService, TaxonomiesService) {
    var vm = this;
    vm.authentication = Authentication;   
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;
    // console.log($state);
    if ($state.current.name === 'taxonomies.createleaf') {
      // console.log(taxonomy._id);
      // TaxonomiesService.get({
      //  taxonomyId: taxonomy._id
      // }, function (data) {
      // });
      vm.taxonomy = new TaxonomiesService();
      vm.taxonomy.parentId = taxonomy._id;
    } else {
      vm.taxonomy = taxonomy;
    }

    $('#topic').change(function () {
      // console.log($(this));
    });


    // Remove existing Taxonomy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.taxonomy.$remove($state.go('taxonomies.list'));
      }
    }

    // Save Taxonomy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taxonomyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.taxonomy._id) {
        vm.taxonomy.$update(successCallback, errorCallback);
      } else {
        if ($state.current.name === 'taxonomies.createleaf') {
          vm.taxonomy.$saveleaf(successCallback, errorCallback);
        } else {
          vm.taxonomy.$save(successCallback, errorCallback);
        }
      }

      function successCallback(res) {
        $state.go('taxonomies.view', {
          taxonomyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
