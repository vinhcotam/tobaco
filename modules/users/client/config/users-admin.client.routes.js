(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm'
      })
      .state('admin.user-create', { // new add
        url: '/users/create',
        templateUrl: '/modules/users/client/views/admin/create-user.client.view.html',
        controller: 'CreateUserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: newUser
        },
        data: {
          pageTitle: 'Create User'
        }
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }

    newUser.$inject = ['AdminService'];
    function newUser(AdminService) {
      // console.log("aaaaaaa")
      return new AdminService();
    }
  }
}());
