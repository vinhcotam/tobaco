// Newsbytaxonomies service used to communicate Newsbytaxonomies REST endpoints
(function () {
  'use strict';

  angular
    .module('newsbytaxonomies')
    .factory('NewsbytaxonomiesService', NewsbytaxonomiesService)
    .factory('NewsbytaxonomiesStatisticTaxoService', NewsbytaxonomiesStatisticTaxoService);

  NewsbytaxonomiesService.$inject = ['$resource'];
  NewsbytaxonomiesStatisticTaxoService.$inject = ['$resource'];

  function NewsbytaxonomiesService($resource) {
    return $resource('/api/newsbytaxonomies/:newsbytaxonomyId', {
      newsbytaxonomyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      insertMany: {
        method: 'POST',
        url: '/api/newsbytaxonomies/insertMany', 
        isArray: true
      },
      getTotal: {
        method: 'GET',
        url: '/api/newsbytaxonomies/numberrow',
        isArray: true
      }
    });
  }
  function NewsbytaxonomiesStatisticTaxoService($resource) {
    return $resource('/api/newsbytaxonomies/statistic/taxonomy', {
      newsbytaxonomyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
