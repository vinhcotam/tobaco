// Sentiments service used to communicate Sentiments REST endpoints
(function () {
    'use strict';
  
    angular
      .module('sentiments')
      .factory('SentimentsService', LanguagevariablesService);
  
    SentimentsService.$inject = ['$resource'];
  
    function SentimentsService($resource) {
      return $resource('/api/sentiments/:sentimentId', {
        sentimentId: '@_id'
      }, {
        update: {
          method: 'PUT'
        },
        getTotal: {
          method: 'GET',
          url: '/api/sentiments/numberrow',
          isArray: true
        }
        // ,
        // getbyTopic: {
        //   method: 'GET',
        //   url: '/api/languagevariables/getbytopic',
        //   isArray: true
        // }
      });
    }
  }());
  