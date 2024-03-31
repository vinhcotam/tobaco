(function () {
  'use strict';

  angular
    .module('monitoringobjects')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Monitoring objects',
      state: 'monitoringobjects',
      type: 'dropdown',
      icon: 'fas fa-wallet',
      // roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'monitoringobjects', {
      title: 'List Monitoringobjects',
      state: 'monitoringobjects.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'monitoringobjects', {
      title: 'Create Monitoringobject',
      state: 'monitoringobjects.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
