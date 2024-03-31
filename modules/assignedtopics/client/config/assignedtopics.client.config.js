(function () {
  'use strict';

  angular
    .module('assignedtopics')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Research Topics',
      state: 'assignedtopics',
      type: 'dropdown',
      icon: 'fas fa-smoking',
      // roles: ['*']
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'assignedtopics', {
      title: 'List Research topics',
      state: 'assignedtopics.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'assignedtopics', {
      title: 'Create Research topics',
      state: 'assignedtopics.create',
      // roles: ['user']
      roles: ['admin', 'manager']
    });
  }
}());
