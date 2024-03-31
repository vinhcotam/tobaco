(function () {
  'use strict';

  describe('Keywords Route Tests', function () {
    // Initialize global variables
    var $scope,
      KeywordsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KeywordsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KeywordsService = _KeywordsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('keywords');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/keywords');
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
          KeywordsController,
          mockKeyword;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('keywords.view');
          $templateCache.put('modules/keywords/client/views/view-keyword.client.view.html', '');

          // create mock Keyword
          mockKeyword = new KeywordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Keyword Name'
          });

          // Initialize Controller
          KeywordsController = $controller('KeywordsController as vm', {
            $scope: $scope,
            keywordResolve: mockKeyword
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:keywordId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.keywordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            keywordId: 1
          })).toEqual('/keywords/1');
        }));

        it('should attach an Keyword to the controller scope', function () {
          expect($scope.vm.keyword._id).toBe(mockKeyword._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/keywords/client/views/view-keyword.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KeywordsController,
          mockKeyword;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('keywords.create');
          $templateCache.put('modules/keywords/client/views/form-keyword.client.view.html', '');

          // create mock Keyword
          mockKeyword = new KeywordsService();

          // Initialize Controller
          KeywordsController = $controller('KeywordsController as vm', {
            $scope: $scope,
            keywordResolve: mockKeyword
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.keywordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/keywords/create');
        }));

        it('should attach an Keyword to the controller scope', function () {
          expect($scope.vm.keyword._id).toBe(mockKeyword._id);
          expect($scope.vm.keyword._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/keywords/client/views/form-keyword.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KeywordsController,
          mockKeyword;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('keywords.edit');
          $templateCache.put('modules/keywords/client/views/form-keyword.client.view.html', '');

          // create mock Keyword
          mockKeyword = new KeywordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Keyword Name'
          });

          // Initialize Controller
          KeywordsController = $controller('KeywordsController as vm', {
            $scope: $scope,
            keywordResolve: mockKeyword
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:keywordId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.keywordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            keywordId: 1
          })).toEqual('/keywords/1/edit');
        }));

        it('should attach an Keyword to the controller scope', function () {
          expect($scope.vm.keyword._id).toBe(mockKeyword._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/keywords/client/views/form-keyword.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
