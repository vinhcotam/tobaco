(function () {
  'use strict';

  angular
    .module('newsgroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Newsgroups',
      state: 'newsgroups',
      type: 'dropdown',
      //roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'newsgroups', {
      title: 'List Newsgroups',
      state: 'newsgroups.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'newsgroups', {
      title: 'Create Newsgroup',
      state: 'newsgroups.create',
      roles: ['user']
    });
  }
}());
