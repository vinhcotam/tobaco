(function () {
  'use strict';

  // Newsbytaxonomies controller
  angular
    .module('newsbytaxonomies')
    .controller('NewsbytaxonomiesController', NewsbytaxonomiesController);

  NewsbytaxonomiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsbytaxonomyResolve'];

  function NewsbytaxonomiesController ($scope, $state, $window, Authentication, newsbytaxonomy) {
    var vm = this;

    vm.authentication = Authentication;
    vm.newsbytaxonomy = newsbytaxonomy;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Newsbytaxonomy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newsbytaxonomy.$remove($state.go('newsbytaxonomies.list'));
      }
    }

    // Save Newsbytaxonomy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsbytaxonomyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.newsbytaxonomy._id) {
        vm.newsbytaxonomy.$update(successCallback, errorCallback);
      } else {
        vm.newsbytaxonomy.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newsbytaxonomies.view', {
          newsbytaxonomyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
