(function () {
  'use strict';

  describe('Assignedtopics Route Tests', function () {
    // Initialize global variables
    var $scope,
      AssignedtopicsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AssignedtopicsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AssignedtopicsService = _AssignedtopicsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('assignedtopics');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/assignedtopics');
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
          AssignedtopicsController,
          mockAssignedtopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('assignedtopics.view');
          $templateCache.put('modules/assignedtopics/client/views/view-assignedtopic.client.view.html', '');

          // create mock Assignedtopic
          mockAssignedtopic = new AssignedtopicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assignedtopic Name'
          });

          // Initialize Controller
          AssignedtopicsController = $controller('AssignedtopicsController as vm', {
            $scope: $scope,
            assignedtopicResolve: mockAssignedtopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:assignedtopicId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.assignedtopicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            assignedtopicId: 1
          })).toEqual('/assignedtopics/1');
        }));

        it('should attach an Assignedtopic to the controller scope', function () {
          expect($scope.vm.assignedtopic._id).toBe(mockAssignedtopic._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/assignedtopics/client/views/view-assignedtopic.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AssignedtopicsController,
          mockAssignedtopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('assignedtopics.create');
          $templateCache.put('modules/assignedtopics/client/views/form-assignedtopic.client.view.html', '');

          // create mock Assignedtopic
          mockAssignedtopic = new AssignedtopicsService();

          // Initialize Controller
          AssignedtopicsController = $controller('AssignedtopicsController as vm', {
            $scope: $scope,
            assignedtopicResolve: mockAssignedtopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.assignedtopicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/assignedtopics/create');
        }));

        it('should attach an Assignedtopic to the controller scope', function () {
          expect($scope.vm.assignedtopic._id).toBe(mockAssignedtopic._id);
          expect($scope.vm.assignedtopic._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/assignedtopics/client/views/form-assignedtopic.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AssignedtopicsController,
          mockAssignedtopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('assignedtopics.edit');
          $templateCache.put('modules/assignedtopics/client/views/form-assignedtopic.client.view.html', '');

          // create mock Assignedtopic
          mockAssignedtopic = new AssignedtopicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assignedtopic Name'
          });

          // Initialize Controller
          AssignedtopicsController = $controller('AssignedtopicsController as vm', {
            $scope: $scope,
            assignedtopicResolve: mockAssignedtopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:assignedtopicId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.assignedtopicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            assignedtopicId: 1
          })).toEqual('/assignedtopics/1/edit');
        }));

        it('should attach an Assignedtopic to the controller scope', function () {
          expect($scope.vm.assignedtopic._id).toBe(mockAssignedtopic._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/assignedtopics/client/views/form-assignedtopic.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
