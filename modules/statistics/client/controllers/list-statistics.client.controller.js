(function () {
  'use strict';

  angular
    .module('statistics')
    .controller('StatisticsListController', StatisticsListController);

  StatisticsListController.$inject = ['StatisticsService', 'Authentication'];

  function StatisticsListController(StatisticsService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    if (vm.authentication.user == null) {
      window.location.href = '/authentication/signin';
    }

    vm.statistics = StatisticsService.query();
  }
}());
