// Labelingbylabelstudios service used to communicate Labelingbylabelstudios REST endpoints
(function () {
  'use strict';

  angular
    .module('labelingbylabelstudios')
    .factory('LabelingbylabelstudiosService', LabelingbylabelstudiosService);

  LabelingbylabelstudiosService.$inject = ['$resource'];

  function LabelingbylabelstudiosService($resource) {
    return $resource('/api/labelingbylabelstudios/:labelingbylabelstudioId', {
      labelingbylabelstudioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
