(function () {
  'use strict';

  angular
    .module('objectprofiles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Object profiles',
      state: 'objectprofiles',
      type: 'dropdown',
      icon: '	fas fa-user-circle',
      position: 5,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'objectprofiles', {
      title: 'List Object profiles',
      state: 'objectprofiles.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'objectprofiles', {
      title: 'Create Object profile',
      state: 'objectprofiles.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
