(function () {
    'use strict';
  
    angular
      .module('comments')
      .run(menuConfig);
  
    menuConfig.$inject = ['menuService'];
  
    function menuConfig(menuService) {
      // Set top bar menu items
      menuService.addMenuItem('topbar', {
        title: 'Comment',
        state: 'comments',
        icon: 'nav-icon fas fa-file-alt',
        type: 'dropdown',
        // roles: ['*']
        roles: ['admin']
      });
  
      // Add the dropdown list item
      menuService.addSubMenuItem('topbar', 'comments', {
        title: 'List Comment',
        state: 'comments.list'
      });

    }
  }());
  