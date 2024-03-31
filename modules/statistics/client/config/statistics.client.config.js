(function () {
  'use strict';

  angular
    .module('statistics')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Statistics',
      state: 'statistics',
      icon: 'fas fa-chart-pie',
      type: 'dropdown',
      position: 3,
      roles: ['*']
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'List Statistics',
      state: 'statistics.list'
    });*/

    // Add the dropdown create item
    /*menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'Create Statistic',
      state: 'statistics.create',
      roles: ['user']
    });*/
    menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'Websites',
      icon: 'fas fa-chart-line',
      state: 'newsdailies.statistic',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'News Group',
      icon: 'fas fa-chart-pie',
      state: 'newsdailies.statisticbygroupnews',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'Agruments',
      icon: 'fas fa-chart-pie',
      state: 'labelingbytaxonomies.statisticbygroupnews',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'statistics', {
      title: 'TI Tactic',
      icon: 'fas fa fa-tree',
      state: 'newsbytaxonomies.statistictaxo',
      roles: ['user']
    });
  }
}());
