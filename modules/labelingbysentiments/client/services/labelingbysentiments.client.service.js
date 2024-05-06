// Labelingbysentiments service used to communicate Labelingbysentiments REST endpoints
(function () {
    'use strict';
  
    angular
      .module('labelingbysentiments')
      .factory('LabelingbysentimentsService', LabelingbysentimentsService)
      .factory('LabelingbysentimentsStatisticArguService', LabelingbysentimentsStatisticArguService)
      .factory('LabelingbysentimentsExportService', LabelingbysentimentsExportService);
  
    LabelingbysentimentsService.$inject = ['$resource'];
    LabelingbysentimentsStatisticArguService.$inject = ['$resource'];
    LabelingbysentimentsExportService.$inject = ['$resource'];
  
    function LabelingbysentimentsService($resource) {
      return $resource('/api/labelingbysentiments/:labelingbysentimentId', {
        labelingbysentimentId: '@_id'
      }, {
        update: {
          method: 'PUT'
        },
        checkingEditOrRemove: {
          method: 'GET',
          url: '/api/labelingbysentiments/checkingEditOrRemove',
          isArray: true
        },
        insertOrUpdate: {
          method: 'POST',
          url: '/api/labelingbysentiments/insertOrUpdate',
          isArray: true
        },
        removeMany: {
          method: 'POST',
          url: '/api/labelingbysentiments/removeMany',
          isArray: true
        },
        getTotal: {
          method: 'GET',
          url: '/api/labelingbysentiments/numberrow',
          isArray: true
        }
      });
    }
    function LabelingbysentimentsStatisticArguService($resource) {
      return $resource('/api/labelingbysentiments/statisticbyargument', {
        newsdailyId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
    function LabelingbysentimentsExportService($resource) {
      return $resource('/api/labelingbysentiments/export', {
        newsdailyId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  }());
  