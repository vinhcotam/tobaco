(function () {
  'use strict';

  angular
    .module('webcategories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Webcategories',
      state: 'webcategories',
      type: 'dropdown',
      icon: 'fas fa-sitemap',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'webcategories', {
      title: 'List Webcategories',
      state: 'webcategories.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'webcategories', {
      title: 'Create Webcategory',
      state: 'webcategories.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
