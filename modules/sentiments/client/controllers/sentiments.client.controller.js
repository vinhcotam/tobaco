(function () {
  'use strict';

  angular
      .module('sentiments')
      .controller('SentimentsController', SentimentsController);

  SentimentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sentimentResolve'];

  function SentimentsController($scope, $state, $window, Authentication, sentiment) {
      var vm = this;
      vm.authentication = Authentication;
      vm.sentiment = sentiment;
      console.log("vm.sentiment,",vm.sentiment.sentiment_score);
      
      vm.error = null;
      vm.form = {};
      vm.remove = remove;
      vm.save = save;

      // Remove existing Sentiment
      function remove() {
          if ($window.confirm('Are you sure you want to delete?')) {
              vm.sentiment.$remove($state.go('sentiments.list'));
          }
      }

      // Save sentiment
      function save(isValid) {
          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'vm.form.sentimentForm');
              return false;
          }

          console.log("Sentiment before save:", vm.sentiment);

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
