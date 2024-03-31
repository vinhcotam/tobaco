(function () {
  'use strict';

  describe('Socialcrawlerconfigs Route Tests', function () {
    // Initialize global variables
    var $scope,
      SocialcrawlerconfigsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SocialcrawlerconfigsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SocialcrawlerconfigsService = _SocialcrawlerconfigsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('socialcrawlerconfigs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/socialcrawlerconfigs');
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
          SocialcrawlerconfigsController,
          mockSocialcrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('socialcrawlerconfigs.view');
          $templateCache.put('modules/socialcrawlerconfigs/client/views/view-socialcrawlerconfig.client.view.html', '');

          // create mock Socialcrawlerconfig
          mockSocialcrawlerconfig = new SocialcrawlerconfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Socialcrawlerconfig Name'
          });

          // Initialize Controller
          SocialcrawlerconfigsController = $controller('SocialcrawlerconfigsController as vm', {
            $scope: $scope,
            socialcrawlerconfigResolve: mockSocialcrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:socialcrawlerconfigId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.socialcrawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            socialcrawlerconfigId: 1
          })).toEqual('/socialcrawlerconfigs/1');
        }));

        it('should attach an Socialcrawlerconfig to the controller scope', function () {
          expect($scope.vm.socialcrawlerconfig._id).toBe(mockSocialcrawlerconfig._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/socialcrawlerconfigs/client/views/view-socialcrawlerconfig.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SocialcrawlerconfigsController,
          mockSocialcrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('socialcrawlerconfigs.create');
          $templateCache.put('modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html', '');

          // create mock Socialcrawlerconfig
          mockSocialcrawlerconfig = new SocialcrawlerconfigsService();

          // Initialize Controller
          SocialcrawlerconfigsController = $controller('SocialcrawlerconfigsController as vm', {
            $scope: $scope,
            socialcrawlerconfigResolve: mockSocialcrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.socialcrawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/socialcrawlerconfigs/create');
        }));

        it('should attach an Socialcrawlerconfig to the controller scope', function () {
          expect($scope.vm.socialcrawlerconfig._id).toBe(mockSocialcrawlerconfig._id);
          expect($scope.vm.socialcrawlerconfig._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SocialcrawlerconfigsController,
          mockSocialcrawlerconfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('socialcrawlerconfigs.edit');
          $templateCache.put('modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html', '');

          // create mock Socialcrawlerconfig
          mockSocialcrawlerconfig = new SocialcrawlerconfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Socialcrawlerconfig Name'
          });

          // Initialize Controller
          SocialcrawlerconfigsController = $controller('SocialcrawlerconfigsController as vm', {
            $scope: $scope,
            socialcrawlerconfigResolve: mockSocialcrawlerconfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:socialcrawlerconfigId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.socialcrawlerconfigResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            socialcrawlerconfigId: 1
          })).toEqual('/socialcrawlerconfigs/1/edit');
        }));

        it('should attach an Socialcrawlerconfig to the controller scope', function () {
          expect($scope.vm.socialcrawlerconfig._id).toBe(mockSocialcrawlerconfig._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
