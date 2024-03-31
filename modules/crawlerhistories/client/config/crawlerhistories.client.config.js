(function () {
  'use strict';

  angular
    .module('crawlerhistories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Crawlerhistories',
      state: 'crawlerhistories',
      type: 'dropdown',
      icon: 'fas fa-history',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crawlerhistories', {
      title: 'List Crawlerhistories',
      state: 'crawlerhistories.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crawlerhistories', {
      title: 'Create Crawlerhistory',
      state: 'crawlerhistories.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
