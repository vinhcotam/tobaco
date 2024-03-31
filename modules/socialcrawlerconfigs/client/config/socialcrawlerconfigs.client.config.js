(function () {
  'use strict';

  angular
    .module('socialcrawlerconfigs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Social crawler configs',
      state: 'socialcrawlerconfigs',
      type: 'dropdown',
      icon: 'fas fa-toolbox',
      //roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'socialcrawlerconfigs', {
      title: 'List Socialcrawlerconfigs',
      state: 'socialcrawlerconfigs.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'socialcrawlerconfigs', {
      title: 'Create Socialcrawlerconfig',
      state: 'socialcrawlerconfigs.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
