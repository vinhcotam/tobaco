(function () {
  'use strict';

  angular
    .module('labelingbylabelstudios')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Labelingbylabelstudios',
      state: 'labelingbylabelstudios',
      type: 'dropdown',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'labelingbylabelstudios', {
      title: 'List Labelingbylabelstudios',
      state: 'labelingbylabelstudios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'labelingbylabelstudios', {
      title: 'Create Labelingbylabelstudio',
      state: 'labelingbylabelstudios.create',
      roles: ['user']
    });
  }
}());
