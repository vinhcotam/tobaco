// Socialcrawlerconfigs service used to communicate Socialcrawlerconfigs REST endpoints
(function () {
  'use strict';

  angular
    .module('socialcrawlerconfigs')
    .factory('SocialcrawlerconfigsService', SocialcrawlerconfigsService);

  SocialcrawlerconfigsService.$inject = ['$resource', '$log'];

  function SocialcrawlerconfigsService($resource, $log) {
    var Socialcrawlerconfig = $resource('/api/socialcrawlerconfigs/:socialcrawlerconfigId', {
      socialcrawlerconfigId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/socialcrawlerconfigs/numberrow',
        isArray: true
      }
    });
    angular.extend(Socialcrawlerconfig.prototype, {
      createOrUpdate: function () {
        var socialcrawlerconfig = this;
        return createOrUpdate(socialcrawlerconfig);
      }
    });

    return Socialcrawlerconfig;

    function createOrUpdate(socialcrawlerconfig) {
      if (socialcrawlerconfig._id) {
        return socialcrawlerconfig.$update(onSuccess, onError);
      } else {
        return socialcrawlerconfig.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(socialcrawlerconfig) {
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
