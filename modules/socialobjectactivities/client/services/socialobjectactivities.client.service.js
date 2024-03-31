// Socialobjectactivities service used to communicate Socialobjectactivities REST endpoints
(function () {
  'use strict';

  angular
    .module('socialobjectactivities')
    .factory('SocialobjectactivitiesService', SocialobjectactivitiesService);


  SocialobjectactivitiesService.$inject = ['$resource', '$log'];

  function SocialobjectactivitiesService($resource, $log) {
    var Socialobjectactivity = $resource('/api/socialobjectactivities/:socialobjectactivityId', {
      socialobjectactivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/socialobjectactivities/numberrow',
        isArray: true
      }
    });
    angular.extend(Socialobjectactivity.prototype, {
      createOrUpdate: function () {
        var socialobjectactivity = this;
        return createOrUpdate(socialobjectactivity);
      }
    });

    return Socialobjectactivity;

    function createOrUpdate(socialobjectactivity) {
      if (socialobjectactivity._id) {
        return socialobjectactivity.$update(onSuccess, onError);
      } else {
        return socialobjectactivity.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(socialobjectactivity) {
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
