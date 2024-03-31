(function () {
  'use strict';

  angular
    .module('newsbytaxonomies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'News by taxonomies',
      state: 'newsbytaxonomies',
      type: 'dropdown',
      icon: 'fas fa-layer-group',
      position: 2,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'newsbytaxonomies', {
      title: 'List labeled news',
      state: 'newsbytaxonomies.list'
    });

    // Add the dropdown create item
    //menuService.addSubMenuItem('topbar', 'newsbytaxonomies', {
    //  title: 'Create Newsbytaxonomy',
    //  state: 'newsbytaxonomies.create',
    //  roles: ['user']
    //});
  }
}());
