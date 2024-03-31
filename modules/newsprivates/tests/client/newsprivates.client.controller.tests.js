(function () {
  'use strict';

  describe('Newsprivates Controller Tests', function () {
    // Initialize global variables
    var NewsprivatesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      NewsprivatesService,
      mockNewsprivate;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _NewsprivatesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      NewsprivatesService = _NewsprivatesService_;

      // create mock Newsprivate
      mockNewsprivate = new NewsprivatesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Newsprivate Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Newsprivates controller.
      NewsprivatesController = $controller('NewsprivatesController as vm', {
        $scope: $scope,
        newsprivateResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleNewsprivatePostData;

      beforeEach(function () {
        // Create a sample Newsprivate object
        sampleNewsprivatePostData = new NewsprivatesService({
          name: 'Newsprivate Name'
        });

        $scope.vm.newsprivate = sampleNewsprivatePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (NewsprivatesService) {
        // Set POST response
        $httpBackend.expectPOST('api/newsprivates', sampleNewsprivatePostData).respond(mockNewsprivate);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Newsprivate was created
        expect($state.go).toHaveBeenCalledWith('newsprivates.view', {
          newsprivateId: mockNewsprivate._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/newsprivates', sampleNewsprivatePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Newsprivate in $scope
        $scope.vm.newsprivate = mockNewsprivate;
      });

      it('should update a valid Newsprivate', inject(function (NewsprivatesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/newsprivates\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('newsprivates.view', {
          newsprivateId: mockNewsprivate._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (NewsprivatesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/newsprivates\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Newsprivates
        $scope.vm.newsprivate = mockNewsprivate;
      });

      it('should delete the Newsprivate and redirect to Newsprivates', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/newsprivates\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('newsprivates.list');
      });

      it('should should not delete the Newsprivate and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
