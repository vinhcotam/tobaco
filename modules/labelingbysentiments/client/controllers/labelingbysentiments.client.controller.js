(function () {
    'use strict';
  
    // Labelingbysentiments controller
    angular
      .module('labelingbysentiments')
      .controller('LabelingbysentimentsController', LabelingbysentimentsController);
  
    LabelingbysentimentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'labelingbysentimentResolve'];
  
    function LabelingbysentimentsController($scope, $state, $window, Authentication, labelingbysentiment) {
      var vm = this;
  
      vm.authentication = Authentication;
      vm.labelingbysentiment = labelingbysentiment;
      vm.error = null;
      vm.form = {};
      vm.remove = remove;
      vm.save = save;
  
      // Remove existing Labelingbysentiment
      function remove() {
        if ($window.confirm('Are you sure you want to delete?')) {
          vm.labelingbysentiment.$remove($state.go('labelingbysentiments.list'));
        }
      }
  
      // Save Labelingbysentiment
      function save(isValid) {
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.labelingbysentimentForm');
          return false;
        }
  
        // TODO: move create/update logic to service
        if (vm.labelingbysentiment._id) {
          vm.labelingbysentiment.$update(successCallback, errorCallback);
        } else {
          vm.labelingbysentiment.$save(successCallback, errorCallback);
        }
  
        function successCallback(res) {
          $state.go('labelingbysentiments.view', {
            labelingbysentimentId: res._id
          });
        }
  
        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }
    }
  }());
  