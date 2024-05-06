(function () {
    'use strict';
  
    angular
      .module('labelingbysentiments')
      .config(routeConfig);
  
    routeConfig.$inject = ['$stateProvider'];
  
    function routeConfig($stateProvider) {
      $stateProvider
        .state('labelingbysentiments', {
          abstract: true,
          url: '/labelingbysentiments',
          template: '<ui-view/>'
        })
        .state('labelingbysentiments.statisticbygroupnews', {
          url: '/labelingbysentiments/statistic/argument',
          templateUrl: '/modules/labelingbysentiments/client/views/statisticargu-labelingbysentiments.client.view.html',
          controller: 'LabelingbysentimentsStatisticArguController',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Statistic by Sentiment'
          }
        })
        .state('labelingbysentiments.list', {
          url: '',
          templateUrl: '/modules/labelingbysentiments/client/views/list-labelingbysentiments.client.view.html',
          controller: 'LabelingbysentimentsListController',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Labelingbysentiments List'
          }
        })
        .state('labelingbysentiments.create', {
          url: '/create',
          templateUrl: '/modules/labelingbysentiments/client/views/form-labelingbysentiment.client.view.html',
          controller: 'LabelingbysentimentsController',
          controllerAs: 'vm',
          resolve: {
            labelingbysentimentResolve: newLabelingbysentiment
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Labelingbysentiments Create'
          }
        })
        .state('labelingbysentiments.edit', {
          url: '/:labelingbysentimentId/edit',
          templateUrl: '/modules/labelingbysentiments/client/views/form-labelingbysentiment.client.view.html',
          controller: 'LabelingbysentimentsController',
          controllerAs: 'vm',
          resolve: {
            labelingbysentimentResolve: getLabelingbysentiment
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Edit Labelingbysentiment {{ labelingbysentimentResolve.name }}'
          }
        })
        .state('labelingbysentiments.view', {
          url: '/:labelingbysentimentId',
          templateUrl: '/modules/labelingbysentiments/client/views/view-labelingbysentiment.client.view.html',
          controller: 'LabelingbysentimentsController',
          controllerAs: 'vm',
          resolve: {
            labelingbysentimentResolve: getLabelingbysentiment
          },
          data: {
            pageTitle: 'Labelingbysentiment {{ labelingbysentimentResolve.name }}'
          }
        });
    }
  
    getLabelingbysentiment.$inject = ['$stateParams', 'LabelingbysentimentsService'];
  
    function getLabelingbysentiment($stateParams, LabelingbysentimentsService) {
      return LabelingbysentimentsService.get({
        labelingbysentimentId: $stateParams.labelingbysentimentId
      }).$promise;
    }
  
    newLabelingbysentiment.$inject = ['LabelingbysentimentsService'];
  
    function newLabelingbysentiment(LabelingbysentimentsService) {
      return new LabelingbysentimentsService();
    }
  }());
  