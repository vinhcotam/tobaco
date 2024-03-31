(function () {
  'use strict';

  angular
    .module('labelingbylabelstudios')
    .controller('LabelingbylabelstudiosListController', LabelingbylabelstudiosListController);

  LabelingbylabelstudiosListController.$inject = ['LabelingbylabelstudiosService', 'Authentication'];

  function LabelingbylabelstudiosListController(LabelingbylabelstudiosService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    vm.labelingbylabelstudios = LabelingbylabelstudiosService.query();
  }
}());
