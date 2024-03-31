(function () {
  'use strict';

  describe('Crawlerconfigs Route Tests', function () {
    // Initialize global variables
    var $scope,
      CrawlerconfigsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CrawlerconfigsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CrawlerconfigsService = _CrawlerconfigsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crawlerconfigs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crawlerconfigs');
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
          CrawlerconfigsController,
          mockCrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crawlerconfigs.view');
          $templateCache.put('modules/crawlerconfigs/client/views/view-crawlerconfig.client.view.html', '');

          // create mock Crawlerconfig
          mockCrawlerconfig = new CrawlerconfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerconfig Name'
          });

          // Initialize Controller
          CrawlerconfigsController = $controller('CrawlerconfigsController as vm', {
            $scope: $scope,
            crawlerconfigResolve: mockCrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:crawlerconfigId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.crawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            crawlerconfigId: 1
          })).toEqual('/crawlerconfigs/1');
        }));

        it('should attach an Crawlerconfig to the controller scope', function () {
          expect($scope.vm.crawlerconfig._id).toBe(mockCrawlerconfig._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crawlerconfigs/client/views/view-crawlerconfig.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CrawlerconfigsController,
          mockCrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crawlerconfigs.create');
          $templateCache.put('modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html', '');

          // create mock Crawlerconfig
          mockCrawlerconfig = new CrawlerconfigsService();

          // Initialize Controller
          CrawlerconfigsController = $controller('CrawlerconfigsController as vm', {
            $scope: $scope,
            crawlerconfigResolve: mockCrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.crawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/crawlerconfigs/create');
        }));

        it('should attach an Crawlerconfig to the controller scope', function () {
          expect($scope.vm.crawlerconfig._id).toBe(mockCrawlerconfig._id);
          expect($scope.vm.crawlerconfig._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CrawlerconfigsController,
          mockCrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crawlerconfigs.edit');
          $templateCache.put('modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html', '');

          // create mock Crawlerconfig
          mockCrawlerconfig = new CrawlerconfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerconfig Name'
          });

          // Initialize Controller
          CrawlerconfigsController = $controller('CrawlerconfigsController as vm', {
            $scope: $scope,
            crawlerconfigResolve: mockCrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:crawlerconfigId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.crawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            crawlerconfigId: 1
          })).toEqual('/crawlerconfigs/1/edit');
        }));

        it('should attach an Crawlerconfig to the controller scope', function () {
          expect($scope.vm.crawlerconfig._id).toBe(mockCrawlerconfig._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
