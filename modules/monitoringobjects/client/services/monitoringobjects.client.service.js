// Monitoringobjects service used to communicate Monitoringobjects REST endpoints
(function () {
  'use strict';

  angular
    .module('monitoringobjects')
    .factory('MonitoringobjectsService', MonitoringobjectsService);

  MonitoringobjectsService.$inject = ['$resource', '$log'];

  function MonitoringobjectsService($resource, $log) {
    var Monitoringobject = $resource('/api/monitoringobjects/:monitoringobjectId', {
      monitoringobjectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/monitoringobjects/numberrow',
        isArray: true
      }
    });
    angular.extend(Monitoringobject.prototype, {
      createOrUpdate: function () {
        var monitoringobject = this;
        return createOrUpdate(monitoringobject);
      }
    });

    return Monitoringobject;

    function createOrUpdate(monitoringobject) {
      if (monitoringobject._id) {
        return monitoringobject.$update(onSuccess, onError);
      } else {
        return monitoringobject.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(monitoringobject) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
