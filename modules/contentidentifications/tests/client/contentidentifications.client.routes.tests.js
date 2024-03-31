(function () {
  'use strict';

  describe('Contentidentifications Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContentidentificationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContentidentificationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContentidentificationsService = _ContentidentificationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contentidentifications');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contentidentifications');
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
          ContentidentificationsController,
          mockContentidentification;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contentidentifications.view');
          $templateCache.put('modules/contentidentifications/client/views/view-contentidentification.client.view.html', '');

          // create mock Contentidentification
          mockContentidentification = new ContentidentificationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contentidentification Name'
          });

          // Initialize Controller
          ContentidentificationsController = $controller('ContentidentificationsController as vm', {
            $scope: $scope,
            contentidentificationResolve: mockContentidentification
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contentidentificationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contentidentificationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contentidentificationId: 1
          })).toEqual('/contentidentifications/1');
        }));

        it('should attach an Contentidentification to the controller scope', function () {
          expect($scope.vm.contentidentification._id).toBe(mockContentidentification._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contentidentifications/client/views/view-contentidentification.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContentidentificationsController,
          mockContentidentification;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contentidentifications.create');
          $templateCache.put('modules/contentidentifications/client/views/form-contentidentification.client.view.html', '');

          // create mock Contentidentification
          mockContentidentification = new ContentidentificationsService();

          // Initialize Controller
          ContentidentificationsController = $controller('ContentidentificationsController as vm', {
            $scope: $scope,
            contentidentificationResolve: mockContentidentification
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contentidentificationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contentidentifications/create');
        }));

        it('should attach an Contentidentification to the controller scope', function () {
          expect($scope.vm.contentidentification._id).toBe(mockContentidentification._id);
          expect($scope.vm.contentidentification._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contentidentifications/client/views/form-contentidentification.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContentidentificationsController,
          mockContentidentification;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contentidentifications.edit');
          $templateCache.put('modules/contentidentifications/client/views/form-contentidentification.client.view.html', '');

          // create mock Contentidentification
          mockContentidentification = new ContentidentificationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contentidentification Name'
          });

          // Initialize Controller
          ContentidentificationsController = $controller('ContentidentificationsController as vm', {
            $scope: $scope,
            contentidentificationResolve: mockContentidentification
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contentidentificationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contentidentificationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contentidentificationId: 1
          })).toEqual('/contentidentifications/1/edit');
        }));

        it('should attach an Contentidentification to the controller scope', function () {
          expect($scope.vm.contentidentification._id).toBe(mockContentidentification._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contentidentifications/client/views/form-contentidentification.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
