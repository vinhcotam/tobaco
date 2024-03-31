(function () {
  'use strict';

  angular
    .module('socialobjectactivities')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Social object activities',
      state: 'socialobjectactivities',
      type: 'dropdown',
      icon: 'fas fa-clipboard',
      position: 6,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'socialobjectactivities', {
      title: 'List Socialobjectactivities',
      state: 'socialobjectactivities.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'socialobjectactivities', {
      title: 'Create Socialobjectactivity',
      state: 'socialobjectactivities.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
