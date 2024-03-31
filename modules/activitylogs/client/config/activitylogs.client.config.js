(function () {
  'use strict';

  angular
    .module('activitylogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Activity logs',
      state: 'activitylogs',
      type: 'dropdown',
      roles: ['admin']
      // roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'activitylogs', {
      title: 'List activity logs',
      state: 'activitylogs.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'activitylogs', {
      title: 'Create Activity log',
      state: 'activitylogs.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
