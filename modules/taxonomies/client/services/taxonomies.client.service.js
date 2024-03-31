// Taxonomies service used to communicate Taxonomies REST endpoints
(function () {
  'use strict';

  angular
    .module('taxonomies')
    .factory('TaxonomiesService', TaxonomiesService)
    .factory('TaxonomiesTreeService', TaxonomiesTreeService);

  TaxonomiesService.$inject = ['$resource'];
  TaxonomiesTreeService.$inject = ['$resource'];

  function TaxonomiesService($resource) {
    return $resource('/api/taxonomies/:taxonomyId', {
      taxonomyId: '@_id'
    }, {
      saveleaf: {
        method: 'PUT'
      },
      update: {
        method: 'PUT'
      },
      gettreebytopic: {
        method: 'GET',
        url: '/api/taxonomies/treebytopic'
        // isArray: true
      },
      insertMany: {
        method: 'POST',
        url: '/api/newsbytaxonomies/insertMany',
        isArray: true
      }
    });
  }

  function TaxonomiesTreeService($resource) {
    return $resource('/api/taxonomies/:taxonomyId/treeview', {
      taxonomyId: '@_id'
    });
  }

}());
