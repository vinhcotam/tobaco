(function () {
  'use strict';

  describe('Crawlerhistories Route Tests', function () {
    // Initialize global variables
    var $scope,
      CrawlerhistoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CrawlerhistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CrawlerhistoriesService = _CrawlerhistoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crawlerhistories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crawlerhistories');
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
          CrawlerhistoriesController,
          mockCrawlerhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crawlerhistories.view');
          $templateCache.put('modules/crawlerhistories/client/views/view-crawlerhistory.client.view.html', '');

          // create mock Crawlerhistory
          mockCrawlerhistory = new CrawlerhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerhistory Name'
          });

          // Initialize Controller
          CrawlerhistoriesController = $controller('CrawlerhistoriesController as vm', {
            $scope: $scope,
            crawlerhistoryResolve: mockCrawlerhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:crawlerhistoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.crawlerhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            crawlerhistoryId: 1
          })).toEqual('/crawlerhistories/1');
        }));

        it('should attach an Crawlerhistory to the controller scope', function () {
          expect($scope.vm.crawlerhistory._id).toBe(mockCrawlerhistory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crawlerhistories/client/views/view-crawlerhistory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CrawlerhistoriesController,
          mockCrawlerhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crawlerhistories.create');
          $templateCache.put('modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html', '');

          // create mock Crawlerhistory
          mockCrawlerhistory = new CrawlerhistoriesService();

          // Initialize Controller
          CrawlerhistoriesController = $controller('CrawlerhistoriesController as vm', {
            $scope: $scope,
            crawlerhistoryResolve: mockCrawlerhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.crawlerhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/crawlerhistories/create');
        }));

        it('should attach an Crawlerhistory to the controller scope', function () {
          expect($scope.vm.crawlerhistory._id).toBe(mockCrawlerhistory._id);
          expect($scope.vm.crawlerhistory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CrawlerhistoriesController,
          mockCrawlerhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crawlerhistories.edit');
          $templateCache.put('modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html', '');

          // create mock Crawlerhistory
          mockCrawlerhistory = new CrawlerhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerhistory Name'
          });

          // Initialize Controller
          CrawlerhistoriesController = $controller('CrawlerhistoriesController as vm', {
            $scope: $scope,
            crawlerhistoryResolve: mockCrawlerhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:crawlerhistoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.crawlerhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            crawlerhistoryId: 1
          })).toEqual('/crawlerhistories/1/edit');
        }));

        it('should attach an Crawlerhistory to the controller scope', function () {
          expect($scope.vm.crawlerhistory._id).toBe(mockCrawlerhistory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
