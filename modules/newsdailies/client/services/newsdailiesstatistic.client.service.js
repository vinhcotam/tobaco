// Newsdailies service used to communicate Newsdailies REST endpoints
(function () {
  'use strict';

  angular
    .module('newsdailies')
    .factory('NewsdailiesStatisticService', NewsdailiesStatisticService)
    .factory('NewsdailiesStatisticGroupNewsService', NewsdailiesStatisticGroupNewsService)
    .factory('NewsdailiesExportService', NewsdailiesExportService);

  NewsdailiesStatisticService.$inject = ['$resource'];
  NewsdailiesStatisticGroupNewsService.$inject = ['$resource'];
  NewsdailiesExportService.$inject = ['$resource'];
  function NewsdailiesStatisticService($resource) {
    return $resource('/api/newsdailies/statistic', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function NewsdailiesStatisticGroupNewsService($resource) {
    return $resource('/api/newsdailies/statistic/groupnews', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function NewsdailiesExportService($resource) {
    return $resource('/api/newsdailies/export', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
