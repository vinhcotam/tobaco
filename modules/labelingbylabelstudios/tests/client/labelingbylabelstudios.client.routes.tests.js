(function () {
  'use strict';

  describe('Labelingbylabelstudios Route Tests', function () {
    // Initialize global variables
    var $scope,
      LabelingbylabelstudiosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LabelingbylabelstudiosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LabelingbylabelstudiosService = _LabelingbylabelstudiosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('labelingbylabelstudios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/labelingbylabelstudios');
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
          LabelingbylabelstudiosController,
          mockLabelingbylabelstudio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('labelingbylabelstudios.view');
          $templateCache.put('modules/labelingbylabelstudios/client/views/view-labelingbylabelstudio.client.view.html', '');

          // create mock Labelingbylabelstudio
          mockLabelingbylabelstudio = new LabelingbylabelstudiosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Labelingbylabelstudio Name'
          });

          // Initialize Controller
          LabelingbylabelstudiosController = $controller('LabelingbylabelstudiosController as vm', {
            $scope: $scope,
            labelingbylabelstudioResolve: mockLabelingbylabelstudio
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:labelingbylabelstudioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.labelingbylabelstudioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            labelingbylabelstudioId: 1
          })).toEqual('/labelingbylabelstudios/1');
        }));

        it('should attach an Labelingbylabelstudio to the controller scope', function () {
          expect($scope.vm.labelingbylabelstudio._id).toBe(mockLabelingbylabelstudio._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/labelingbylabelstudios/client/views/view-labelingbylabelstudio.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LabelingbylabelstudiosController,
          mockLabelingbylabelstudio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('labelingbylabelstudios.create');
          $templateCache.put('modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html', '');

          // create mock Labelingbylabelstudio
          mockLabelingbylabelstudio = new LabelingbylabelstudiosService();

          // Initialize Controller
          LabelingbylabelstudiosController = $controller('LabelingbylabelstudiosController as vm', {
            $scope: $scope,
            labelingbylabelstudioResolve: mockLabelingbylabelstudio
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.labelingbylabelstudioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/labelingbylabelstudios/create');
        }));

        it('should attach an Labelingbylabelstudio to the controller scope', function () {
          expect($scope.vm.labelingbylabelstudio._id).toBe(mockLabelingbylabelstudio._id);
          expect($scope.vm.labelingbylabelstudio._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LabelingbylabelstudiosController,
          mockLabelingbylabelstudio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('labelingbylabelstudios.edit');
          $templateCache.put('modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html', '');

          // create mock Labelingbylabelstudio
          mockLabelingbylabelstudio = new LabelingbylabelstudiosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Labelingbylabelstudio Name'
          });

          // Initialize Controller
          LabelingbylabelstudiosController = $controller('LabelingbylabelstudiosController as vm', {
            $scope: $scope,
            labelingbylabelstudioResolve: mockLabelingbylabelstudio
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:labelingbylabelstudioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.labelingbylabelstudioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            labelingbylabelstudioId: 1
          })).toEqual('/labelingbylabelstudios/1/edit');
        }));

        it('should attach an Labelingbylabelstudio to the controller scope', function () {
          expect($scope.vm.labelingbylabelstudio._id).toBe(mockLabelingbylabelstudio._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
