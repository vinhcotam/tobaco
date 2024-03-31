(function () {
  'use strict';

  angular
    .module('newsprivates')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: "Key Informant's news",
      state: 'newsprivates',
      type: 'dropdown',
      icon: 'fas fa-newspaper',
      position: 9,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'newsprivates', {
      title: 'List Newsprivates',
      state: 'newsprivates.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'newsprivates', {
      title: 'Create Newsprivate',
      state: 'newsprivates.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
  }
}());
