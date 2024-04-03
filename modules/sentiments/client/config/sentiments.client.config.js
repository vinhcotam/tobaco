(function () {
  'use strict';

  angular
    .module('sentiments')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sentiments',
      state: 'sentiments',
      type: 'dropdown',
      icon: 'fas fa-globe',
      // roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sentiments', {
      title: 'List Sentiments',
      state: 'sentiments.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sentiments', {
      title: 'Create Sentiment',
      state: 'sentiments.create',
      roles: ['user']
    });
  }
}());
