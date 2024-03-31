(function () {
  'use strict';

  describe('Webcategories Route Tests', function () {
    // Initialize global variables
    var $scope,
      WebcategoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _WebcategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      WebcategoriesService = _WebcategoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('webcategories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/webcategories');
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
          WebcategoriesController,
          mockWebcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('webcategories.view');
          $templateCache.put('modules/webcategories/client/views/view-webcategory.client.view.html', '');

          // create mock Webcategory
          mockWebcategory = new WebcategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Webcategory Name'
          });

          // Initialize Controller
          WebcategoriesController = $controller('WebcategoriesController as vm', {
            $scope: $scope,
            webcategoryResolve: mockWebcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:webcategoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.webcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            webcategoryId: 1
          })).toEqual('/webcategories/1');
        }));

        it('should attach an Webcategory to the controller scope', function () {
          expect($scope.vm.webcategory._id).toBe(mockWebcategory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/webcategories/client/views/view-webcategory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          WebcategoriesController,
          mockWebcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('webcategories.create');
          $templateCache.put('modules/webcategories/client/views/form-webcategory.client.view.html', '');

          // create mock Webcategory
          mockWebcategory = new WebcategoriesService();

          // Initialize Controller
          WebcategoriesController = $controller('WebcategoriesController as vm', {
            $scope: $scope,
            webcategoryResolve: mockWebcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.webcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/webcategories/create');
        }));

        it('should attach an Webcategory to the controller scope', function () {
          expect($scope.vm.webcategory._id).toBe(mockWebcategory._id);
          expect($scope.vm.webcategory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/webcategories/client/views/form-webcategory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          WebcategoriesController,
          mockWebcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('webcategories.edit');
          $templateCache.put('modules/webcategories/client/views/form-webcategory.client.view.html', '');

          // create mock Webcategory
          mockWebcategory = new WebcategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Webcategory Name'
          });

          // Initialize Controller
          WebcategoriesController = $controller('WebcategoriesController as vm', {
            $scope: $scope,
            webcategoryResolve: mockWebcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:webcategoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.webcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            webcategoryId: 1
          })).toEqual('/webcategories/1/edit');
        }));

        it('should attach an Webcategory to the controller scope', function () {
          expect($scope.vm.webcategory._id).toBe(mockWebcategory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/webcategories/client/views/form-webcategory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
