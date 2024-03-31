(function () {
  'use strict';

  angular
    .module('objectpackages')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Object Packages',
      state: 'objectpackages',
      type: 'dropdown',
      position: 4,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'objectpackages', {
      title: 'List Object Packages',
      state: 'objectpackages.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'objectpackages', {
      title: 'Create Objectpackage',
      state: 'objectpackages.create',
      roles: ['user']
    });
  }
}());
