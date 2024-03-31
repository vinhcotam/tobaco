(function () {
  'use strict';

  // Contentidentifications controller
  angular
    .module('contentidentifications')
    .controller('ContentidentificationsController', ContentidentificationsController);

  ContentidentificationsController.$inject = ['$scope', '$sce', '$state', '$window', 'Authentication', 'contentidentificationResolve', 'WebsitesService'];

  function ContentidentificationsController($scope, $sce, $state, $window, Authentication, contentidentification, WebsitesService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }
    vm.contentidentification = contentidentification;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    WebsitesService.query({}, function (data) {
      vm.websites = data;
    });
    if (contentidentification.website !== undefined) {
      var url = $sce.trustAsResourceUrl(contentidentification.website.source_url);
      $('#inlineFrameWebsite').attr('src', url);
    }
    $('#website').change(function () {
      // console.log($(this).find(":selected").attr('source_url'));
      var url = $sce.trustAsResourceUrl($(this).find(":selected").attr('source_url'));
      $('#inlineFrameWebsite').attr('src', url);
    });
    // Remove existing Contentidentification
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contentidentification.$remove($state.go('contentidentifications.list'));
      }
    }

    // Save Contentidentification
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contentidentificationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contentidentification._id) {
        vm.contentidentification.$update(successCallback, errorCallback);
      } else {
        vm.contentidentification.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contentidentifications.view', {
          contentidentificationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
