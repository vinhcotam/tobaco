(function () {
  'use strict';

  describe('Newsdailies Route Tests', function () {
    // Initialize global variables
    var $scope,
      NewsdailiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NewsdailiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NewsdailiesService = _NewsdailiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('newsdailies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/newsdailies');
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
          NewsdailiesController,
          mockNewsdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('newsdailies.view');
          $templateCache.put('modules/newsdailies/client/views/view-newsdaily.client.view.html', '');

          // create mock Newsdaily
          mockNewsdaily = new NewsdailiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsdaily Name'
          });

          // Initialize Controller
          NewsdailiesController = $controller('NewsdailiesController as vm', {
            $scope: $scope,
            newsdailyResolve: mockNewsdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:newsdailyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.newsdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            newsdailyId: 1
          })).toEqual('/newsdailies/1');
        }));

        it('should attach an Newsdaily to the controller scope', function () {
          expect($scope.vm.newsdaily._id).toBe(mockNewsdaily._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/newsdailies/client/views/view-newsdaily.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NewsdailiesController,
          mockNewsdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('newsdailies.create');
          $templateCache.put('modules/newsdailies/client/views/form-newsdaily.client.view.html', '');

          // create mock Newsdaily
          mockNewsdaily = new NewsdailiesService();

          // Initialize Controller
          NewsdailiesController = $controller('NewsdailiesController as vm', {
            $scope: $scope,
            newsdailyResolve: mockNewsdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.newsdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/newsdailies/create');
        }));

        it('should attach an Newsdaily to the controller scope', function () {
          expect($scope.vm.newsdaily._id).toBe(mockNewsdaily._id);
          expect($scope.vm.newsdaily._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/newsdailies/client/views/form-newsdaily.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NewsdailiesController,
          mockNewsdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('newsdailies.edit');
          $templateCache.put('modules/newsdailies/client/views/form-newsdaily.client.view.html', '');

          // create mock Newsdaily
          mockNewsdaily = new NewsdailiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsdaily Name'
          });

          // Initialize Controller
          NewsdailiesController = $controller('NewsdailiesController as vm', {
            $scope: $scope,
            newsdailyResolve: mockNewsdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:newsdailyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.newsdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            newsdailyId: 1
          })).toEqual('/newsdailies/1/edit');
        }));

        it('should attach an Newsdaily to the controller scope', function () {
          expect($scope.vm.newsdaily._id).toBe(mockNewsdaily._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/newsdailies/client/views/form-newsdaily.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
