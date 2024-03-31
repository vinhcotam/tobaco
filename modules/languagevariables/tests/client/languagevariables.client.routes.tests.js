(function () {
  'use strict';

  describe('Languagevariables Route Tests', function () {
    // Initialize global variables
    var $scope,
      LanguagevariablesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LanguagevariablesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LanguagevariablesService = _LanguagevariablesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('languagevariables');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/languagevariables');
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
          LanguagevariablesController,
          mockLanguagevariable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('languagevariables.view');
          $templateCache.put('modules/languagevariables/client/views/view-languagevariable.client.view.html', '');

          // create mock Languagevariable
          mockLanguagevariable = new LanguagevariablesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Languagevariable Name'
          });

          // Initialize Controller
          LanguagevariablesController = $controller('LanguagevariablesController as vm', {
            $scope: $scope,
            languagevariableResolve: mockLanguagevariable
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:languagevariableId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.languagevariableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            languagevariableId: 1
          })).toEqual('/languagevariables/1');
        }));

        it('should attach an Languagevariable to the controller scope', function () {
          expect($scope.vm.languagevariable._id).toBe(mockLanguagevariable._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/languagevariables/client/views/view-languagevariable.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LanguagevariablesController,
          mockLanguagevariable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('languagevariables.create');
          $templateCache.put('modules/languagevariables/client/views/form-languagevariable.client.view.html', '');

          // create mock Languagevariable
          mockLanguagevariable = new LanguagevariablesService();

          // Initialize Controller
          LanguagevariablesController = $controller('LanguagevariablesController as vm', {
            $scope: $scope,
            languagevariableResolve: mockLanguagevariable
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.languagevariableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/languagevariables/create');
        }));

        it('should attach an Languagevariable to the controller scope', function () {
          expect($scope.vm.languagevariable._id).toBe(mockLanguagevariable._id);
          expect($scope.vm.languagevariable._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/languagevariables/client/views/form-languagevariable.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LanguagevariablesController,
          mockLanguagevariable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('languagevariables.edit');
          $templateCache.put('modules/languagevariables/client/views/form-languagevariable.client.view.html', '');

          // create mock Languagevariable
          mockLanguagevariable = new LanguagevariablesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Languagevariable Name'
          });

          // Initialize Controller
          LanguagevariablesController = $controller('LanguagevariablesController as vm', {
            $scope: $scope,
            languagevariableResolve: mockLanguagevariable
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:languagevariableId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.languagevariableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            languagevariableId: 1
          })).toEqual('/languagevariables/1/edit');
        }));

        it('should attach an Languagevariable to the controller scope', function () {
          expect($scope.vm.languagevariable._id).toBe(mockLanguagevariable._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/languagevariables/client/views/form-languagevariable.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
