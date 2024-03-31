(function () {
  'use strict';

  angular
    .module('crawlerconfigs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Crawlerconfigs',
      state: 'crawlerconfigs',
      type: 'dropdown',
      icon: 'fas fa-tools',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crawlerconfigs', {
      title: 'List Crawlerconfigs',
      state: 'crawlerconfigs.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crawlerconfigs', {
      title: 'Create Crawlerconfig',
      state: 'crawlerconfigs.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
