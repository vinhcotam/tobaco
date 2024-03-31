// Newsprivates service used to communicate Newsprivates REST endpoints
(function () {
  'use strict';

  angular
    .module('newsprivates')
    .factory('NewsprivatesService', NewsprivatesService);

  NewsprivatesService.$inject = ['$resource', '$log'];

  function NewsprivatesService($resource, $log) {
    var Newsprivate = $resource('/api/newsprivates/:newsprivateId', {
      newsprivateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/newsprivates/numberrow',
        isArray: true
      }
    });
    angular.extend(Newsprivate.prototype, {
      createOrUpdate: function () {
        var newsprivate = this;
        return createOrUpdate(newsprivate);
      }
    });

    return Newsprivate;

    function createOrUpdate(newsprivate) {
      if (newsprivate._id) {
        return newsprivate.$update(onSuccess, onError);
      } else {
        return newsprivate.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(newsprivate) {
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
