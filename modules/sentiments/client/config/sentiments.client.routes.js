(function () {
    'use strict';
  
    angular
      .module('sentiments')
      .config(routeConfig);
  
    routeConfig.$inject = ['$stateProvider'];
  
    function routeConfig($stateProvider) {
      $stateProvider
        .state('sentiments', {
          abstract: true,
          url: '/sentiments',
          template: '<ui-view/>'
        })
        .state('sentiments.list', {
          url: '',
          templateUrl: '/modules/sentiments/client/views/list-sentiments.client.view.html',
          controller: 'SentimentsListController',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Sentiments List'
          }
        })
        .state('sentiments.create', {
          url: '/create',
          templateUrl: '/modules/sentiments/client/views/form-sentiment.client.view.html',
          controller: 'SentimentsController',
          controllerAs: 'vm',
          resolve: {
            sentimentResolve: newSentiment
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Sentiments Create'
          }
        })
        .state('sentiments.edit', {
          url: '/:sentimentId/edit',
          templateUrl: '/modules/sentiments/client/views/form-sentiment.client.view.html',
          controller: 'SentimentsController',
          controllerAs: 'vm',
          resolve: {
            sentimentResolve: getSentiment
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Edit Sentiment {{ sentimentResolve.name }}'
          }
        })
        .state('sentiments.view', {
          url: '/:languagevariableId',
          templateUrl: '/modules/sentiments/client/views/view-sentiment.client.view.html',
          controller: 'SentimentsController',
          controllerAs: 'vm',
          resolve: {
            sentimentResolve: getSentiment
          },
          data: {
            pageTitle: 'Sentiment {{ sentimentResolve.name }}'
          }
        });
    }
  
    getSentiment.$inject = ['$stateParams', 'LanguagevariablesService'];
  
    function getSentiment($stateParams, SentimentsService) {
      return SentimentsService.get({
        sentimentId: $stateParams.sentimentId
      }).$promise;
    }
  
    newSentiment.$inject = ['SentimentsService'];
  
    function newSentiment(SentimentsService) {
      return new SentimentsService();
    }
  }());
  