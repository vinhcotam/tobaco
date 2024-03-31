(function () {
  'use strict';

  angular
    .module('crawlerdrivers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Crawlerdrivers',
      state: 'crawlerdrivers',
      type: 'dropdown',
      icon: 'fas fa-screwdriver',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crawlerdrivers', {
      title: 'List Crawlerdrivers',
      state: 'crawlerdrivers.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crawlerdrivers', {
      title: 'Create Crawlerdriver',
      state: 'crawlerdrivers.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
