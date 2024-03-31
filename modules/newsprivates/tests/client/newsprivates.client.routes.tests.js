(function () {
  'use strict';

  describe('Newsprivates Route Tests', function () {
    // Initialize global variables
    var $scope,
      NewsprivatesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NewsprivatesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NewsprivatesService = _NewsprivatesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('newsprivates');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/newsprivates');
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
          NewsprivatesController,
          mockNewsprivate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('newsprivates.view');
          $templateCache.put('modules/newsprivates/client/views/view-newsprivate.client.view.html', '');

          // create mock Newsprivate
          mockNewsprivate = new NewsprivatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsprivate Name'
          });

          // Initialize Controller
          NewsprivatesController = $controller('NewsprivatesController as vm', {
            $scope: $scope,
            newsprivateResolve: mockNewsprivate
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:newsprivateId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.newsprivateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            newsprivateId: 1
          })).toEqual('/newsprivates/1');
        }));

        it('should attach an Newsprivate to the controller scope', function () {
          expect($scope.vm.newsprivate._id).toBe(mockNewsprivate._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/newsprivates/client/views/view-newsprivate.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NewsprivatesController,
          mockNewsprivate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('newsprivates.create');
          $templateCache.put('modules/newsprivates/client/views/form-newsprivate.client.view.html', '');

          // create mock Newsprivate
          mockNewsprivate = new NewsprivatesService();

          // Initialize Controller
          NewsprivatesController = $controller('NewsprivatesController as vm', {
            $scope: $scope,
            newsprivateResolve: mockNewsprivate
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.newsprivateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/newsprivates/create');
        }));

        it('should attach an Newsprivate to the controller scope', function () {
          expect($scope.vm.newsprivate._id).toBe(mockNewsprivate._id);
          expect($scope.vm.newsprivate._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/newsprivates/client/views/form-newsprivate.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NewsprivatesController,
          mockNewsprivate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('newsprivates.edit');
          $templateCache.put('modules/newsprivates/client/views/form-newsprivate.client.view.html', '');

          // create mock Newsprivate
          mockNewsprivate = new NewsprivatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsprivate Name'
          });

          // Initialize Controller
          NewsprivatesController = $controller('NewsprivatesController as vm', {
            $scope: $scope,
            newsprivateResolve: mockNewsprivate
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:newsprivateId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.newsprivateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            newsprivateId: 1
          })).toEqual('/newsprivates/1/edit');
        }));

        it('should attach an Newsprivate to the controller scope', function () {
          expect($scope.vm.newsprivate._id).toBe(mockNewsprivate._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/newsprivates/client/views/form-newsprivate.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
