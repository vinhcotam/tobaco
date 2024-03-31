(function () {
  'use strict';

  angular
    .module('newsdailies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'News',
      state: 'newsdailies',
      type: 'dropdown',
      //icon: 'far fa-newspaper',
      icon: 'far fa-bookmark',
      position: 0,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'newsdailies', {
      title: 'List News',
      state: 'newsdailies.list',
      icon: 'fa fa-list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'newsdailies', {
      title: 'Create News',
      state: 'newsdailies.create',
      icon: 'fas fa-plus-square',
      roles: ['user']
    });
    // Add the dropdown create item
    /*menuService.addSubMenuItem('topbar', 'newsdailies', {
      title: 'Statistic by Websites',
      icon: 'fas fa-chart-pie',
      state: 'newsdailies.statistic',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'newsdailies', {
      title: 'Statistic by GroupNews',
      icon: 'fas fa-chart-pie',
      state: 'newsdailies.statisticbygroupnews',
      roles: ['user']
    });*/
    // Add the dropdown create item
    /*menuService.addSubMenuItem('topbar', 'newsdailies', {
      title: 'Labeling',
      icon: 'fas fa-tags',
      state: 'newsdailies.labeling',
      roles: ['user']
    });*/
  }
}());
