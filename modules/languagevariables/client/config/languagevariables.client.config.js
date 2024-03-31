(function () {
  'use strict';

  angular
    .module('languagevariables')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Arguments',
      state: 'languagevariables',
      type: 'dropdown',
      icon: 'fas fa-globe',
      // roles: ['*']
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'languagevariables', {
      title: 'List Arguments',
      state: 'languagevariables.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'languagevariables', {
      title: 'Create Argument',
      state: 'languagevariables.create',
      roles: ['user']
    });
  }
}());
