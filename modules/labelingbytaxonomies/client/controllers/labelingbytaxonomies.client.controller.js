(function () {
  'use strict';

  // Labelingbytaxonomies controller
  angular
    .module('labelingbytaxonomies')
    .controller('LabelingbytaxonomiesController', LabelingbytaxonomiesController);

  LabelingbytaxonomiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'labelingbytaxonomyResolve'];

  function LabelingbytaxonomiesController($scope, $state, $window, Authentication, labelingbytaxonomy) {
    var vm = this;

    vm.authentication = Authentication;
    vm.labelingbytaxonomy = labelingbytaxonomy;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Labelingbytaxonomy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.labelingbytaxonomy.$remove($state.go('labelingbytaxonomies.list'));
      }
    }

    // Save Labelingbytaxonomy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.labelingbytaxonomyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.labelingbytaxonomy._id) {
        vm.labelingbytaxonomy.$update(successCallback, errorCallback);
      } else {
        vm.labelingbytaxonomy.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('labelingbytaxonomies.view', {
          labelingbytaxonomyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
