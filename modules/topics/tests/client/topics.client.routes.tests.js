(function () {
  'use strict';

  describe('Topics Route Tests', function () {
    // Initialize global variables
    var $scope,
      TopicsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TopicsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TopicsService = _TopicsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('topics');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/topics');
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
          TopicsController,
          mockTopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('topics.view');
          $templateCache.put('modules/topics/client/views/view-topic.client.view.html', '');

          // create mock Topic
          mockTopic = new TopicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Topic Name'
          });

          // Initialize Controller
          TopicsController = $controller('TopicsController as vm', {
            $scope: $scope,
            topicResolve: mockTopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:topicId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.topicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            topicId: 1
          })).toEqual('/topics/1');
        }));

        it('should attach an Topic to the controller scope', function () {
          expect($scope.vm.topic._id).toBe(mockTopic._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/topics/client/views/view-topic.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TopicsController,
          mockTopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('topics.create');
          $templateCache.put('modules/topics/client/views/form-topic.client.view.html', '');

          // create mock Topic
          mockTopic = new TopicsService();

          // Initialize Controller
          TopicsController = $controller('TopicsController as vm', {
            $scope: $scope,
            topicResolve: mockTopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.topicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/topics/create');
        }));

        it('should attach an Topic to the controller scope', function () {
          expect($scope.vm.topic._id).toBe(mockTopic._id);
          expect($scope.vm.topic._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/topics/client/views/form-topic.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TopicsController,
          mockTopic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('topics.edit');
          $templateCache.put('modules/topics/client/views/form-topic.client.view.html', '');

          // create mock Topic
          mockTopic = new TopicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Topic Name'
          });

          // Initialize Controller
          TopicsController = $controller('TopicsController as vm', {
            $scope: $scope,
            topicResolve: mockTopic
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:topicId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.topicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            topicId: 1
          })).toEqual('/topics/1/edit');
        }));

        it('should attach an Topic to the controller scope', function () {
          expect($scope.vm.topic._id).toBe(mockTopic._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/topics/client/views/form-topic.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
