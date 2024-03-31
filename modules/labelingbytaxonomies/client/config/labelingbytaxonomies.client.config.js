(function () {
  'use strict';

  angular
    .module('labelingbytaxonomies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Identified Arguments',
      state: 'labelingbytaxonomies',
      type: 'dropdown',
      icon: 'fas fa-tags',
      position: 1,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'labelingbytaxonomies', {
      title: 'List Identified Arguments',
      state: 'labelingbytaxonomies.list'
    });

    // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'labelingbytaxonomies', {
    // title: 'Create Labelingbytaxonomy',
    // state: 'labelingbytaxonomies.create',
    // roles: ['user']
    // });
  }
}());
