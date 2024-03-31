(function () {
  'use strict';

  describe('Newsgroups Route Tests', function () {
    // Initialize global variables
    var $scope,
      NewsgroupsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NewsgroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NewsgroupsService = _NewsgroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('newsgroups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/newsgroups');
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
          NewsgroupsController,
          mockNewsgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('newsgroups.view');
          $templateCache.put('modules/newsgroups/client/views/view-newsgroup.client.view.html', '');

          // create mock Newsgroup
          mockNewsgroup = new NewsgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsgroup Name'
          });

          // Initialize Controller
          NewsgroupsController = $controller('NewsgroupsController as vm', {
            $scope: $scope,
            newsgroupResolve: mockNewsgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:newsgroupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.newsgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            newsgroupId: 1
          })).toEqual('/newsgroups/1');
        }));

        it('should attach an Newsgroup to the controller scope', function () {
          expect($scope.vm.newsgroup._id).toBe(mockNewsgroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/newsgroups/client/views/view-newsgroup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NewsgroupsController,
          mockNewsgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('newsgroups.create');
          $templateCache.put('modules/newsgroups/client/views/form-newsgroup.client.view.html', '');

          // create mock Newsgroup
          mockNewsgroup = new NewsgroupsService();

          // Initialize Controller
          NewsgroupsController = $controller('NewsgroupsController as vm', {
            $scope: $scope,
            newsgroupResolve: mockNewsgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.newsgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/newsgroups/create');
        }));

        it('should attach an Newsgroup to the controller scope', function () {
          expect($scope.vm.newsgroup._id).toBe(mockNewsgroup._id);
          expect($scope.vm.newsgroup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/newsgroups/client/views/form-newsgroup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NewsgroupsController,
          mockNewsgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('newsgroups.edit');
          $templateCache.put('modules/newsgroups/client/views/form-newsgroup.client.view.html', '');

          // create mock Newsgroup
          mockNewsgroup = new NewsgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newsgroup Name'
          });

          // Initialize Controller
          NewsgroupsController = $controller('NewsgroupsController as vm', {
            $scope: $scope,
            newsgroupResolve: mockNewsgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:newsgroupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.newsgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            newsgroupId: 1
          })).toEqual('/newsgroups/1/edit');
        }));

        it('should attach an Newsgroup to the controller scope', function () {
          expect($scope.vm.newsgroup._id).toBe(mockNewsgroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/newsgroups/client/views/form-newsgroup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
