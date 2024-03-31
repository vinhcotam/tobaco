(function () {
  'use strict';

  describe('Objectpackages Route Tests', function () {
    // Initialize global variables
    var $scope,
      ObjectpackagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ObjectpackagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ObjectpackagesService = _ObjectpackagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('objectpackages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/objectpackages');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ObjectpackagesController,
          mockObjectpackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('objectpackages.view');
          $templateCache.put('modules/objectpackages/client/views/view-objectpackage.client.view.html', '');

          // create mock Objectpackage
          mockObjectpackage = new ObjectpackagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Objectpackage Name'
          });

          // Initialize Controller
          ObjectpackagesController = $controller('ObjectpackagesController as vm', {
            $scope: $scope,
            objectpackageResolve: mockObjectpackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:objectpackageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.objectpackageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            objectpackageId: 1
          })).toEqual('/objectpackages/1');
        }));

        it('should attach an Objectpackage to the controller scope', function () {
          expect($scope.vm.objectpackage._id).toBe(mockObjectpackage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/objectpackages/client/views/view-objectpackage.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ObjectpackagesController,
          mockObjectpackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('objectpackages.create');
          $templateCache.put('modules/objectpackages/client/views/form-objectpackage.client.view.html', '');

          // create mock Objectpackage
          mockObjectpackage = new ObjectpackagesService();

          // Initialize Controller
          ObjectpackagesController = $controller('ObjectpackagesController as vm', {
            $scope: $scope,
            objectpackageResolve: mockObjectpackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.objectpackageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/objectpackages/create');
        }));

        it('should attach an Objectpackage to the controller scope', function () {
          expect($scope.vm.objectpackage._id).toBe(mockObjectpackage._id);
          expect($scope.vm.objectpackage._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/objectpackages/client/views/form-objectpackage.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ObjectpackagesController,
          mockObjectpackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('objectpackages.edit');
          $templateCache.put('modules/objectpackages/client/views/form-objectpackage.client.view.html', '');

          // create mock Objectpackage
          mockObjectpackage = new ObjectpackagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Objectpackage Name'
          });

          // Initialize Controller
          ObjectpackagesController = $controller('ObjectpackagesController as vm', {
            $scope: $scope,
            objectpackageResolve: mockObjectpackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:objectpackageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.objectpackageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            objectpackageId: 1
          })).toEqual('/objectpackages/1/edit');
        }));

        it('should attach an Objectpackage to the controller scope', function () {
          expect($scope.vm.objectpackage._id).toBe(mockObjectpackage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/objectpackages/client/views/form-objectpackage.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
