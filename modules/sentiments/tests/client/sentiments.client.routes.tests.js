(function () {
    'use strict';
  
    describe('Sentiments Route Tests', function () {
      // Initialize global variables
      var $scope,
        SentimentsService;
  
      // We can start by loading the main application module
      beforeEach(module(ApplicationConfiguration.applicationModuleName));
  
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($rootScope, _SentimentsService_) {
        // Set a new global scope
        $scope = $rootScope.$new();
        SentimentsService = _SentimentsService_;
      }));
  
      describe('Route Config', function () {
        describe('Main Route', function () {
          var mainstate;
          beforeEach(inject(function ($state) {
            mainstate = $state.get('sentiments');
          }));
  
          it('Should have the correct URL', function () {
            expect(mainstate.url).toEqual('/sentiments');
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
            SentimentsController,
            mockSentiment;
  
          beforeEach(inject(function ($controller, $state, $templateCache) {
            viewstate = $state.get('sentiments.view');
            $templateCache.put('modules/sentiments/client/views/view-sentiments.client.view.html', '');
  
            // create mock Sentiment
            mockSentiment = new SentimentsService({
              _id: '525a8422f6d0f87f0e407a33',
              name: 'Sentiment Name'
            });
  
            // Initialize Controller
            SentimentsController = $controller('SentimentsController as vm', {
              $scope: $scope,
              sentimentResolve: mockSentiment
            });
          }));
  
          it('Should have the correct URL', function () {
            expect(viewstate.url).toEqual('/:sentimentId');
          });
  
          it('Should have a resolve function', function () {
            expect(typeof viewstate.resolve).toEqual('object');
            expect(typeof viewstate.resolve.sentimentResolve).toEqual('function');
          });
  
          it('should respond to URL', inject(function ($state) {
            expect($state.href(viewstate, {
              sentimentId: 1
            })).toEqual('/sentiments/1');
          }));
  
          it('should attach an Sentiment to the controller scope', function () {
            expect($scope.vm.sentiment._id).toBe(mockSentiment._id);
          });
  
          it('Should not be abstract', function () {
            expect(viewstate.abstract).toBe(undefined);
          });
  
          it('Should have templateUrl', function () {
            expect(viewstate.templateUrl).toBe('modules/sentiments/client/views/view-sentiment.client.view.html');
          });
        });
  
        describe('Create Route', function () {
          var createstate,
            SentimentsController,
            mockSentiment;
  
          beforeEach(inject(function ($controller, $state, $templateCache) {
            createstate = $state.get('sentiments.create');
            $templateCache.put('modules/sentiments/client/views/form-sentiment.client.view.html', '');
  
            // create mock sentiment
            mockSentiment = new SentimentsService();
  
            // Initialize Controller
            SentimentsController = $controller('SentimentsController as vm', {
              $scope: $scope,
              sentimentResolve: mockSentiment
            });
          }));
  
          it('Should have the correct URL', function () {
            expect(createstate.url).toEqual('/create');
          });
  
          it('Should have a resolve function', function () {
            expect(typeof createstate.resolve).toEqual('object');
            expect(typeof createstate.resolve.sentimentResolve).toEqual('function');
          });
  
          it('should respond to URL', inject(function ($state) {
            expect($state.href(createstate)).toEqual('/sentiments/create');
          }));
  
          it('should attach an Sentiment to the controller scope', function () {
            expect($scope.vm.sentiment._id).toBe(mockSentiment._id);
            expect($scope.vm.sentiment._id).toBe(undefined);
          });
  
          it('Should not be abstract', function () {
            expect(createstate.abstract).toBe(undefined);
          });
  
          it('Should have templateUrl', function () {
            expect(createstate.templateUrl).toBe('modules/sentiments/client/views/form-sentiment.client.view.html');
          });
        });
  
        describe('Edit Route', function () {
          var editstate,
            SentimentsController,
            mockSentiment;
  
          beforeEach(inject(function ($controller, $state, $templateCache) {
            editstate = $state.get('sentiments.edit');
            $templateCache.put('modules/sentiments/client/views/form-sentiment.client.view.html', '');
  
            // create mock Sentiment
            mockSentiment = new SentimentsService({
              _id: '525a8422f6d0f87f0e407a33',
              name: 'Sentiment Name'
            });
  
            // Initialize Controller
            SentimentsController = $controller('SentimentsController as vm', {
              $scope: $scope,
              sentimentResolve: mockSentiment
            });
          }));
  
          it('Should have the correct URL', function () {
            expect(editstate.url).toEqual('/:sentimentId/edit');
          });
  
          it('Should have a resolve function', function () {
            expect(typeof editstate.resolve).toEqual('object');
            expect(typeof editstate.resolve.sentimentResolve).toEqual('function');
          });
  
          it('should respond to URL', inject(function ($state) {
            expect($state.href(editstate, {
              sentimentId: 1
            })).toEqual('/sentiments/1/edit');
          }));
  
          it('should attach an sentiment to the controller scope', function () {
            expect($scope.vm.sentiment._id).toBe(mockSentiment._id);
          });
  
          it('Should not be abstract', function () {
            expect(editstate.abstract).toBe(undefined);
          });
  
          it('Should have templateUrl', function () {
            expect(editstate.templateUrl).toBe('modules/sentiments/client/views/form-sentiment.client.view.html');
          });
  
          xit('Should go to unauthorized route', function () {
  
          });
        });
  
      });
    });
  }());
  