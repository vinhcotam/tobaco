(function () {
  'use strict';

  // Newsprivates controller
  angular
    .module('newsprivates')
    .controller('NewsprivatesController', NewsprivatesController);

  NewsprivatesController.$inject = ['$scope', '$state', '$window', 'Upload', 'Authentication', 'newsprivateResolve', 'TopicsService', 'KeyinformantsService', 'TaxonomiesService'];

  function NewsprivatesController($scope, $state, $window, Upload, Authentication, newsprivate, TopicsService, KeyinformantsService, TaxonomiesService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.user.roles.forEach(role => {
      if (role === "manager" || role === "admin") {
        vm.manager = true;
        vm.admin = true;
      }
    });
    vm.authentication = Authentication;
    vm.newsprivate = newsprivate;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.topics = vm.authentication.user.topics;
    vm.keyinformants = KeyinformantsService.query();
    vm.fileError = null;
    vm.configConfidentiality = [
      {
        "id": 1,
        "value": "High",
      },
      {
        "id": 2,
        "value": "Medium",
      },
      {
        "id": 3,
        "value": "Low",
      },
    ];
    //{ topic: vm.user.topics[0]._id }
    vm.taxonomies = TaxonomiesService.gettreebytopic({ topic: vm.user.topics[0]._id });

    // Remove existing Newsprivate
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.newsprivate.$remove($state.go('newsprivates.list'));
      }
    }
    // Save Newsprivate
    function save(isValid, file) {
      if (file === undefined && !vm.newsprivate._id) {
        vm.fileError = 'The upload file must required!'
        return false;
      }
      if (file !== undefined) {
        let pdfExtension = ['pdf'];
        let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (pdfExtension.indexOf(ext) === -1) {
          vm.fileError = 'The upload file must not is PDF format'
          return false;
        }
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsprivateForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.newsprivate._id) {
        Upload.upload({
          url: '/api/newsprivates/' + vm.newsprivate._id,
          method: 'PUT',
          data: {
            targeted_issue: vm.newsprivate.targeted_issue,
            topic: vm.newsprivate.topic,
            taxonomy: vm.newsprivate.taxonomy,
            keyinformant: vm.newsprivate.keyinformant,
            description: vm.newsprivate.description,
            confidentiality: vm.newsprivate.confidentiality,
            fileupload: file
          },
        }).then(function (res) {
          successCallback(res.data);
        });
      } else {
        Upload.upload({
          url: '/api/newsprivates',
          data: {
            targeted_issue: vm.newsprivate.targeted_issue,
            topic: vm.newsprivate.topic,
            taxonomy: vm.newsprivate.taxonomy,
            keyinformant: vm.newsprivate.keyinformant,
            description: vm.newsprivate.description,
            confidentiality: vm.newsprivate.confidentiality,
            fileupload: file
          },
        }).then(function (res) {
          successCallback(res.data);
        });
      }

      function successCallback(res) {
        console.log(res);
        $state.go('newsprivates.view', {
          newsprivateId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
    //======>
    $(".custom-file-input").change(function () {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //======>
    vm.loadapi = "/api/newsprivates/" + vm.newsprivate._id + "/readnews";
  }
}());
