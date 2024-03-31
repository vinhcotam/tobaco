(function () {
  'use strict';

  describe('Objectprofiles Route Tests', function () {
    // Initialize global variables
    var $scope,
      ObjectprofilesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ObjectprofilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ObjectprofilesService = _ObjectprofilesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('objectprofiles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/objectprofiles');
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
          ObjectprofilesController,
          mockObjectprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('objectprofiles.view');
          $templateCache.put('modules/objectprofiles/client/views/view-objectprofile.client.view.html', '');

          // create mock Objectprofile
          mockObjectprofile = new ObjectprofilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Objectprofile Name'
          });

          // Initialize Controller
          ObjectprofilesController = $controller('ObjectprofilesController as vm', {
            $scope: $scope,
            objectprofileResolve: mockObjectprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:objectprofileId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.objectprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            objectprofileId: 1
          })).toEqual('/objectprofiles/1');
        }));

        it('should attach an Objectprofile to the controller scope', function () {
          expect($scope.vm.objectprofile._id).toBe(mockObjectprofile._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/objectprofiles/client/views/view-objectprofile.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ObjectprofilesController,
          mockObjectprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('objectprofiles.create');
          $templateCache.put('modules/objectprofiles/client/views/form-objectprofile.client.view.html', '');

          // create mock Objectprofile
          mockObjectprofile = new ObjectprofilesService();

          // Initialize Controller
          ObjectprofilesController = $controller('ObjectprofilesController as vm', {
            $scope: $scope,
            objectprofileResolve: mockObjectprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.objectprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/objectprofiles/create');
        }));

        it('should attach an Objectprofile to the controller scope', function () {
          expect($scope.vm.objectprofile._id).toBe(mockObjectprofile._id);
          expect($scope.vm.objectprofile._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/objectprofiles/client/views/form-objectprofile.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ObjectprofilesController,
          mockObjectprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('objectprofiles.edit');
          $templateCache.put('modules/objectprofiles/client/views/form-objectprofile.client.view.html', '');

          // create mock Objectprofile
          mockObjectprofile = new ObjectprofilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Objectprofile Name'
          });

          // Initialize Controller
          ObjectprofilesController = $controller('ObjectprofilesController as vm', {
            $scope: $scope,
            objectprofileResolve: mockObjectprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:objectprofileId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.objectprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            objectprofileId: 1
          })).toEqual('/objectprofiles/1/edit');
        }));

        it('should attach an Objectprofile to the controller scope', function () {
          expect($scope.vm.objectprofile._id).toBe(mockObjectprofile._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/objectprofiles/client/views/form-objectprofile.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
