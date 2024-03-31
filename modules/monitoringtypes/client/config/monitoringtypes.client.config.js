(function () {
  'use strict';

  angular
    .module('monitoringtypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Monitoring types',
      state: 'monitoringtypes',
      type: 'dropdown',
      // roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'monitoringtypes', {
      title: 'List Monitoringtypes',
      state: 'monitoringtypes.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'monitoringtypes', {
      title: 'Create Monitoringtype',
      state: 'monitoringtypes.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
