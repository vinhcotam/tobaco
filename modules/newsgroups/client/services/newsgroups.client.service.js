// Newsgroups service used to communicate Newsgroups REST endpoints
(function () {
  'use strict';

  angular
    .module('newsgroups')
    .factory('NewsgroupsService', NewsgroupsService);

  NewsgroupsService.$inject = ['$resource'];

  function NewsgroupsService($resource) {
    return $resource('/api/newsgroups/:newsgroupId', {
      newsgroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/newsgroups/numberrow',
        isArray: true
      }
    });
  }
}());
