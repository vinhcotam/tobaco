// Objectprofiles service used to communicate Objectprofiles REST endpoints
(function () {
  'use strict';

  angular
    .module('objectprofiles')
    .factory('ObjectprofilesService', ObjectprofilesService);

  ObjectprofilesService.$inject = ['$resource', '$log'];

  function ObjectprofilesService($resource, $log) {
    var Objectprofile = $resource('/api/objectprofiles/:objectprofileId', {
      objectprofileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/objectprofiles/numberrow',
        isArray: true
      }
    });
    angular.extend(Objectprofile.prototype, {
      createOrUpdate: function () {
        var objectprofile = this;
        return createOrUpdate(objectprofile);
      }
    });

    return Objectprofile;

    function createOrUpdate(objectprofile) {
      if (objectprofile._id) {
        return objectprofile.$update(onSuccess, onError);
      } else {
        return objectprofile.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(objectprofile) {
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
