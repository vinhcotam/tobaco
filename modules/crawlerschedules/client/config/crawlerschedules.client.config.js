(function () {
  'use strict';

  angular
    .module('crawlerschedules')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Crawlerschedules',
      state: 'crawlerschedules',
      type: 'dropdown',
      icon: 'fas fa-calendar-alt',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crawlerschedules', {
      title: 'List Crawlerschedules',
      state: 'crawlerschedules.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crawlerschedules', {
      title: 'Create Crawlerschedule',
      state: 'crawlerschedules.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
