(function () {
    'use strict';
  
    angular
      .module('labelingbysentiments')
      .run(menuConfig);
  
    menuConfig.$inject = ['menuService'];
  
    function menuConfig(menuService) {
      // Set top bar menu items
      menuService.addMenuItem('topbar', {
        title: 'Identified Sentiments',
        state: 'labelingbysentiments',
        type: 'dropdown',
        icon: 'fas fa-tags',
        position: 1,
        roles: ['*']
      });
  
      menuService.addSubMenuItem('topbar', 'labelingbysentiments', {
        title: 'List Identified Sentiments',
        state: 'labelingbysentiments.list'
      });
  

    }
  }());
  