(function () {
  'use strict';

  angular
    .module('topics')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Topics',
      state: 'topics',
      type: 'dropdown',
      icon: 'fas fa-smoking',
      // roles: ['*']
      // roles: ['admin', 'manager']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'topics', {
      title: 'List Topics',
      state: 'topics.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'topics', {
      title: 'Create Topic',
      state: 'topics.create',
      icon: 'fas fa-plus-square',
      // roles: ['user']
      roles: ['admin', 'manager']
    });
  }
}());
