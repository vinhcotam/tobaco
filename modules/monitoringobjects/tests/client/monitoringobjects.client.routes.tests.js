(function () {
  'use strict';

  describe('Monitoringobjects Route Tests', function () {
    // Initialize global variables
    var $scope,
      MonitoringobjectsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MonitoringobjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MonitoringobjectsService = _MonitoringobjectsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('monitoringobjects');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/monitoringobjects');
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
          MonitoringobjectsController,
          mockMonitoringobject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('monitoringobjects.view');
          $templateCache.put('modules/monitoringobjects/client/views/view-monitoringobject.client.view.html', '');

          // create mock Monitoringobject
          mockMonitoringobject = new MonitoringobjectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Monitoringobject Name'
          });

          // Initialize Controller
          MonitoringobjectsController = $controller('MonitoringobjectsController as vm', {
            $scope: $scope,
            monitoringobjectResolve: mockMonitoringobject
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:monitoringobjectId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.monitoringobjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            monitoringobjectId: 1
          })).toEqual('/monitoringobjects/1');
        }));

        it('should attach an Monitoringobject to the controller scope', function () {
          expect($scope.vm.monitoringobject._id).toBe(mockMonitoringobject._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/monitoringobjects/client/views/view-monitoringobject.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MonitoringobjectsController,
          mockMonitoringobject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('monitoringobjects.create');
          $templateCache.put('modules/monitoringobjects/client/views/form-monitoringobject.client.view.html', '');

          // create mock Monitoringobject
          mockMonitoringobject = new MonitoringobjectsService();

          // Initialize Controller
          MonitoringobjectsController = $controller('MonitoringobjectsController as vm', {
            $scope: $scope,
            monitoringobjectResolve: mockMonitoringobject
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.monitoringobjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/monitoringobjects/create');
        }));

        it('should attach an Monitoringobject to the controller scope', function () {
          expect($scope.vm.monitoringobject._id).toBe(mockMonitoringobject._id);
          expect($scope.vm.monitoringobject._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/monitoringobjects/client/views/form-monitoringobject.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MonitoringobjectsController,
          mockMonitoringobject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('monitoringobjects.edit');
          $templateCache.put('modules/monitoringobjects/client/views/form-monitoringobject.client.view.html', '');

          // create mock Monitoringobject
          mockMonitoringobject = new MonitoringobjectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Monitoringobject Name'
          });

          // Initialize Controller
          MonitoringobjectsController = $controller('MonitoringobjectsController as vm', {
            $scope: $scope,
            monitoringobjectResolve: mockMonitoringobject
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:monitoringobjectId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.monitoringobjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            monitoringobjectId: 1
          })).toEqual('/monitoringobjects/1/edit');
        }));

        it('should attach an Monitoringobject to the controller scope', function () {
          expect($scope.vm.monitoringobject._id).toBe(mockMonitoringobject._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/monitoringobjects/client/views/form-monitoringobject.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
