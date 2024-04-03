(function () {
    'use strict';
  
    // Sentiments controller
    angular
      .module('sentiments')
      .controller('SentimentsController', SentimentsController);
  // , 'TopicsService'
      SentimentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sentimentResolve'];
  // , TopicsService
    function SentimentsController($scope, $state, $window, Authentication, sentiment) {
      var vm = this;
  
      vm.authentication = Authentication;
      vm.sentiment = sentiment;
      vm.error = null;
      vm.form = {};
      vm.remove = remove;
      vm.save = save;
      // vm.topics = vm.authentication.user.topics;
      // Remove existing Sentiment
      function remove() {
        if ($window.confirm('Are you sure you want to delete?')) {
          vm.sentiment.$remove($state.go('sentiments.list'));
        }
      }
  
      // Save sentiment
      function save(isValid) {
        console.log(vm.sentiment)
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.sentimentForm');
          return false;
        }
  
        // TODO: move create/update logic to service
        if (vm.sentiment._id) {
          vm.sentiment.$update(successCallback, errorCallback);
        } else {
          vm.sentiment.$save(successCallback, errorCallback);
        }
  
        function successCallback(res) {
          $state.go('sentiments.view', {
            sentimentId: res._id
          });
        }
  
        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }
    }
  }());
  