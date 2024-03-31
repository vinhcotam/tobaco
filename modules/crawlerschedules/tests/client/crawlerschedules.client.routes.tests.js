(function () {
  'use strict';

  describe('Crawlerschedules Route Tests', function () {
    // Initialize global variables
    var $scope,
      CrawlerschedulesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CrawlerschedulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CrawlerschedulesService = _CrawlerschedulesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crawlerschedules');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crawlerschedules');
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
          CrawlerschedulesController,
          mockCrawlerschedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crawlerschedules.view');
          $templateCache.put('modules/crawlerschedules/client/views/view-crawlerschedule.client.view.html', '');

          // create mock Crawlerschedule
          mockCrawlerschedule = new CrawlerschedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerschedule Name'
          });

          // Initialize Controller
          CrawlerschedulesController = $controller('CrawlerschedulesController as vm', {
            $scope: $scope,
            crawlerscheduleResolve: mockCrawlerschedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:crawlerscheduleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.crawlerscheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            crawlerscheduleId: 1
          })).toEqual('/crawlerschedules/1');
        }));

        it('should attach an Crawlerschedule to the controller scope', function () {
          expect($scope.vm.crawlerschedule._id).toBe(mockCrawlerschedule._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crawlerschedules/client/views/view-crawlerschedule.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CrawlerschedulesController,
          mockCrawlerschedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crawlerschedules.create');
          $templateCache.put('modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html', '');

          // create mock Crawlerschedule
          mockCrawlerschedule = new CrawlerschedulesService();

          // Initialize Controller
          CrawlerschedulesController = $controller('CrawlerschedulesController as vm', {
            $scope: $scope,
            crawlerscheduleResolve: mockCrawlerschedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.crawlerscheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/crawlerschedules/create');
        }));

        it('should attach an Crawlerschedule to the controller scope', function () {
          expect($scope.vm.crawlerschedule._id).toBe(mockCrawlerschedule._id);
          expect($scope.vm.crawlerschedule._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CrawlerschedulesController,
          mockCrawlerschedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crawlerschedules.edit');
          $templateCache.put('modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html', '');

          // create mock Crawlerschedule
          mockCrawlerschedule = new CrawlerschedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crawlerschedule Name'
          });

          // Initialize Controller
          CrawlerschedulesController = $controller('CrawlerschedulesController as vm', {
            $scope: $scope,
            crawlerscheduleResolve: mockCrawlerschedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:crawlerscheduleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.crawlerscheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            crawlerscheduleId: 1
          })).toEqual('/crawlerschedules/1/edit');
        }));

        it('should attach an Crawlerschedule to the controller scope', function () {
          expect($scope.vm.crawlerschedule._id).toBe(mockCrawlerschedule._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
