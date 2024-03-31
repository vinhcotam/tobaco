(function () {
  'use strict';

  angular
    .module('contentidentifications')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Identification',
      state: 'contentidentifications',
      icon: 'nav-icon fas fa-file-alt',
      type: 'dropdown',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'contentidentifications', {
      title: 'List Identification',
      state: 'contentidentifications.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'contentidentifications', {
      title: 'Create Identification',
      state: 'contentidentifications.create',
      roles: ['user']
    });
  }
}());
