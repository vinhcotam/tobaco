(function () {
  'use strict';

  angular
    .module('keywords')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Keywords',
      state: 'keywords',
      type: 'dropdown',
      icon: 'fas fa-key',
      // roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'keywords', {
      title: 'List Keywords',
      state: 'keywords.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'keywords', {
      title: 'Create Keyword',
      state: 'keywords.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
