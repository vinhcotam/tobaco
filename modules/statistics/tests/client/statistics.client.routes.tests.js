(function () {
  'use strict';

  describe('Statistics Route Tests', function () {
    // Initialize global variables
    var $scope,
      StatisticsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StatisticsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StatisticsService = _StatisticsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('statistics');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/statistics');
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
          StatisticsController,
          mockStatistic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('statistics.view');
          $templateCache.put('modules/statistics/client/views/view-statistic.client.view.html', '');

          // create mock Statistic
          mockStatistic = new StatisticsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Statistic Name'
          });

          // Initialize Controller
          StatisticsController = $controller('StatisticsController as vm', {
            $scope: $scope,
            statisticResolve: mockStatistic
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:statisticId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.statisticResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            statisticId: 1
          })).toEqual('/statistics/1');
        }));

        it('should attach an Statistic to the controller scope', function () {
          expect($scope.vm.statistic._id).toBe(mockStatistic._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/statistics/client/views/view-statistic.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StatisticsController,
          mockStatistic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('statistics.create');
          $templateCache.put('modules/statistics/client/views/form-statistic.client.view.html', '');

          // create mock Statistic
          mockStatistic = new StatisticsService();

          // Initialize Controller
          StatisticsController = $controller('StatisticsController as vm', {
            $scope: $scope,
            statisticResolve: mockStatistic
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.statisticResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/statistics/create');
        }));

        it('should attach an Statistic to the controller scope', function () {
          expect($scope.vm.statistic._id).toBe(mockStatistic._id);
          expect($scope.vm.statistic._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/statistics/client/views/form-statistic.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StatisticsController,
          mockStatistic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('statistics.edit');
          $templateCache.put('modules/statistics/client/views/form-statistic.client.view.html', '');

          // create mock Statistic
          mockStatistic = new StatisticsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Statistic Name'
          });

          // Initialize Controller
          StatisticsController = $controller('StatisticsController as vm', {
            $scope: $scope,
            statisticResolve: mockStatistic
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:statisticId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.statisticResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            statisticId: 1
          })).toEqual('/statistics/1/edit');
        }));

        it('should attach an Statistic to the controller scope', function () {
          expect($scope.vm.statistic._id).toBe(mockStatistic._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/statistics/client/views/form-statistic.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
