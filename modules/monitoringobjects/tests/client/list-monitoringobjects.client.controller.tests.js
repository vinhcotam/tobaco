(function () {
  'use strict';

  describe('Monitoringobjects List Controller Tests', function () {
    // Initialize global variables
    var MonitoringobjectsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      MonitoringobjectsService,
      mockMonitoringobject;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MonitoringobjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      MonitoringobjectsService = _MonitoringobjectsService_;

      // create mock article
      mockMonitoringobject = new MonitoringobjectsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Monitoringobject Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Monitoringobjects List controller.
      MonitoringobjectsListController = $controller('MonitoringobjectsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockMonitoringobjectList;

      beforeEach(function () {
        mockMonitoringobjectList = [mockMonitoringobject, mockMonitoringobject];
      });

      it('should send a GET request and return all Monitoringobjects', inject(function (MonitoringobjectsService) {
        // Set POST response
        $httpBackend.expectGET('api/monitoringobjects').respond(mockMonitoringobjectList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.monitoringobjects.length).toEqual(2);
        expect($scope.vm.monitoringobjects[0]).toEqual(mockMonitoringobject);
        expect($scope.vm.monitoringobjects[1]).toEqual(mockMonitoringobject);

      }));
    });
  });
}());
