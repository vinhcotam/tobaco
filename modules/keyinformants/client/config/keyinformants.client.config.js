(function () {
  'use strict';

  angular
    .module('keyinformants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Key informants',
      state: 'keyinformants',
      type: 'dropdown',
      icon: 'fas fa-id-card',
      position: 8,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'keyinformants', {
      title: 'List Keyinformants',
      state: 'keyinformants.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'keyinformants', {
      title: 'Create Keyinformant',
      state: 'keyinformants.create',
      roles: ['user']
    });
  }
}());
