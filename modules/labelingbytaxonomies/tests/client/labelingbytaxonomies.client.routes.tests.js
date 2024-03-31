(function () {
  'use strict';

  describe('Labelingbytaxonomies Route Tests', function () {
    // Initialize global variables
    var $scope,
      LabelingbytaxonomiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LabelingbytaxonomiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LabelingbytaxonomiesService = _LabelingbytaxonomiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('labelingbytaxonomies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/labelingbytaxonomies');
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
          LabelingbytaxonomiesController,
          mockLabelingbytaxonomy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('labelingbytaxonomies.view');
          $templateCache.put('modules/labelingbytaxonomies/client/views/view-labelingbytaxonomy.client.view.html', '');

          // create mock Labelingbytaxonomy
          mockLabelingbytaxonomy = new LabelingbytaxonomiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Labelingbytaxonomy Name'
          });

          // Initialize Controller
          LabelingbytaxonomiesController = $controller('LabelingbytaxonomiesController as vm', {
            $scope: $scope,
            labelingbytaxonomyResolve: mockLabelingbytaxonomy
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:labelingbytaxonomyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.labelingbytaxonomyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            labelingbytaxonomyId: 1
          })).toEqual('/labelingbytaxonomies/1');
        }));

        it('should attach an Labelingbytaxonomy to the controller scope', function () {
          expect($scope.vm.labelingbytaxonomy._id).toBe(mockLabelingbytaxonomy._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/labelingbytaxonomies/client/views/view-labelingbytaxonomy.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LabelingbytaxonomiesController,
          mockLabelingbytaxonomy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('labelingbytaxonomies.create');
          $templateCache.put('modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html', '');

          // create mock Labelingbytaxonomy
          mockLabelingbytaxonomy = new LabelingbytaxonomiesService();

          // Initialize Controller
          LabelingbytaxonomiesController = $controller('LabelingbytaxonomiesController as vm', {
            $scope: $scope,
            labelingbytaxonomyResolve: mockLabelingbytaxonomy
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.labelingbytaxonomyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/labelingbytaxonomies/create');
        }));

        it('should attach an Labelingbytaxonomy to the controller scope', function () {
          expect($scope.vm.labelingbytaxonomy._id).toBe(mockLabelingbytaxonomy._id);
          expect($scope.vm.labelingbytaxonomy._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LabelingbytaxonomiesController,
          mockLabelingbytaxonomy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('labelingbytaxonomies.edit');
          $templateCache.put('modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html', '');

          // create mock Labelingbytaxonomy
          mockLabelingbytaxonomy = new LabelingbytaxonomiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Labelingbytaxonomy Name'
          });

          // Initialize Controller
          LabelingbytaxonomiesController = $controller('LabelingbytaxonomiesController as vm', {
            $scope: $scope,
            labelingbytaxonomyResolve: mockLabelingbytaxonomy
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:labelingbytaxonomyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.labelingbytaxonomyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            labelingbytaxonomyId: 1
          })).toEqual('/labelingbytaxonomies/1/edit');
        }));

        it('should attach an Labelingbytaxonomy to the controller scope', function () {
          expect($scope.vm.labelingbytaxonomy._id).toBe(mockLabelingbytaxonomy._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
