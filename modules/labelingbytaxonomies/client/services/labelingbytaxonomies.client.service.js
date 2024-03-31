// Labelingbytaxonomies service used to communicate Labelingbytaxonomies REST endpoints
(function () {
  'use strict';

  angular
    .module('labelingbytaxonomies')
    .factory('LabelingbytaxonomiesService', LabelingbytaxonomiesService)
    .factory('LabelingbytaxonomiesStatisticArguService', LabelingbytaxonomiesStatisticArguService)
    .factory('LabelingbytaxonomiesExportService', LabelingbytaxonomiesExportService);

  LabelingbytaxonomiesService.$inject = ['$resource'];
  LabelingbytaxonomiesStatisticArguService.$inject = ['$resource'];
  LabelingbytaxonomiesExportService.$inject = ['$resource'];

  function LabelingbytaxonomiesService($resource) {
    return $resource('/api/labelingbytaxonomies/:labelingbytaxonomyId', {
      labelingbytaxonomyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      checkingEditOrRemove: {
        method: 'GET',
        url: '/api/labelingbytaxonomies/checkingEditOrRemove',
        isArray: true
      },
      insertOrUpdate: {
        method: 'POST',
        url: '/api/labelingbytaxonomies/insertOrUpdate',
        isArray: true
      },
      removeMany: {
        method: 'POST',
        url: '/api/labelingbytaxonomies/removeMany',
        isArray: true
      },
      getTotal: {
        method: 'GET',
        url: '/api/labelingbytaxonomies/numberrow',
        isArray: true
      }
    });
  }
  function LabelingbytaxonomiesStatisticArguService($resource) {
    return $resource('/api/labelingbytaxonomies/statisticbyargument', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  function LabelingbytaxonomiesExportService($resource) {
    return $resource('/api/labelingbytaxonomies/export', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
