(function () {
  'use strict';

  describe('Keyinformants Route Tests', function () {
    // Initialize global variables
    var $scope,
      KeyinformantsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KeyinformantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KeyinformantsService = _KeyinformantsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('keyinformants');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/keyinformants');
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
          KeyinformantsController,
          mockKeyinformant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('keyinformants.view');
          $templateCache.put('modules/keyinformants/client/views/view-keyinformant.client.view.html', '');

          // create mock Keyinformant
          mockKeyinformant = new KeyinformantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Keyinformant Name'
          });

          // Initialize Controller
          KeyinformantsController = $controller('KeyinformantsController as vm', {
            $scope: $scope,
            keyinformantResolve: mockKeyinformant
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:keyinformantId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.keyinformantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            keyinformantId: 1
          })).toEqual('/keyinformants/1');
        }));

        it('should attach an Keyinformant to the controller scope', function () {
          expect($scope.vm.keyinformant._id).toBe(mockKeyinformant._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/keyinformants/client/views/view-keyinformant.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KeyinformantsController,
          mockKeyinformant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('keyinformants.create');
          $templateCache.put('modules/keyinformants/client/views/form-keyinformant.client.view.html', '');

          // create mock Keyinformant
          mockKeyinformant = new KeyinformantsService();

          // Initialize Controller
          KeyinformantsController = $controller('KeyinformantsController as vm', {
            $scope: $scope,
            keyinformantResolve: mockKeyinformant
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.keyinformantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/keyinformants/create');
        }));

        it('should attach an Keyinformant to the controller scope', function () {
          expect($scope.vm.keyinformant._id).toBe(mockKeyinformant._id);
          expect($scope.vm.keyinformant._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/keyinformants/client/views/form-keyinformant.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KeyinformantsController,
          mockKeyinformant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('keyinformants.edit');
          $templateCache.put('modules/keyinformants/client/views/form-keyinformant.client.view.html', '');

          // create mock Keyinformant
          mockKeyinformant = new KeyinformantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Keyinformant Name'
          });

          // Initialize Controller
          KeyinformantsController = $controller('KeyinformantsController as vm', {
            $scope: $scope,
            keyinformantResolve: mockKeyinformant
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:keyinformantId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.keyinformantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            keyinformantId: 1
          })).toEqual('/keyinformants/1/edit');
        }));

        it('should attach an Keyinformant to the controller scope', function () {
          expect($scope.vm.keyinformant._id).toBe(mockKeyinformant._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/keyinformants/client/views/form-keyinformant.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
