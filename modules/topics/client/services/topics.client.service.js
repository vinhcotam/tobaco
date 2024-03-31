// Topics service used to communicate Topics REST endpoints
(function () {
  'use strict';

  angular
    .module('topics')
    .factory('TopicsService', TopicsService);

  TopicsService.$inject = ['$resource', '$log'];

  function TopicsService($resource) {
    // note resource - need add 
    /* var Topic =  $resource('api/topics/:topicId', {
      topicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });*/
    var Topic = $resource('/api/topics/:topicId', {
      topicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      gettopicbyrole: {
        method: 'GET',
        url: '/api/topics/gettopicbyrole',
        isArray: true
      }
    });
    angular.extend(Topic.prototype, {
      createOrUpdate: function () {
        var topic = this;
        return createOrUpdate(topic);
      }
    });

    return Topic;
    function createOrUpdate(topic) {
      if (topic._id) {
        return topic.$update(onSuccess, onError);
      } else {
        return topic.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(topic) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    // function handleError(error) {
    //   // Log error
    //   log.error(error);
    // }
  }
}());
