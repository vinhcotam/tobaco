(function () {
  'use strict';

  angular
    .module('websites')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Data source Media',
      state: 'websites',
      type: 'dropdown',
      icon: 'fab fa-chrome',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'websites', {
      title: 'List Data source',
      state: 'websites.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'websites', {
      title: 'Insert Website',
      state: 'websites.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
