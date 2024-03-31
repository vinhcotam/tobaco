// Statistics service used to communicate Statistics REST endpoints
(function () {
  'use strict';

  angular
    .module('statistics')
    .factory('StatisticsService', StatisticsService);

  StatisticsService.$inject = ['$resource'];

  function StatisticsService($resource) {
    return $resource('api/statistics/:statisticId', {
      statisticId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
