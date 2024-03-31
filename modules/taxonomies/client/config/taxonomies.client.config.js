(function () {
  'use strict';

  angular
    .module('taxonomies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Taxonomies',
      state: 'taxonomies',
      type: 'dropdown',
      //roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'taxonomies', {
      title: 'List Taxonomies',
      icon: 'fa fa-list',
      state: 'taxonomies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'taxonomies', {
      title: 'Create Taxonomy',
      state: 'taxonomies.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
