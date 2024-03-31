// Keywords service used to communicate Keywords REST endpoints
(function () {
  'use strict';

  angular
    .module('keywords')
    .factory('KeywordsService', KeywordsService);

  KeywordsService.$inject = ['$resource'];

  function KeywordsService($resource) {
    // added "/" to resource
    return $resource('/api/keywords/:keywordId', {
      keywordId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/keywords/numberrow',
        isArray: true
      }
    });
  }
}());
