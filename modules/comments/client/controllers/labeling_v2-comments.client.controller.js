
(function () {
    'use strict';

    angular
        .module('comments')
        .controller('Labelingv2commentsController', Labelingv2commentsController);

    Labelingv2commentsController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'CommentsService', '$stateParams',
        '$http', 'SentimentsService', 'Notification', 'NewsdailiesService'
    ];

    function Labelingv2commentsController($scope, $filter, $state, $window, Authentication, CommentsService, $stateParams, $http, SentimentsService, Notification, NewsdailiesService) {
        var vm = this;
        vm.authentication = Authentication;
        if (vm.authentication.user == null) {
            window.location.href = '/authentication/signin';
        }
        var newsId = $stateParams.newsId;
        var newsTitle = $stateParams.newsTitle
        var newsSummary = $stateParams.newsSummary

        vm.newsId = newsId
        NewsdailiesService.get({ newsdailyId: vm.newsId }, function (data) {
            vm.newsTitle = data.news_title
            vm.newsSummary = data.news_summary
        });
        vm.newsTitle = newsTitle
        vm.newsSummary = newsSummary
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        vm.buildPager();
        vm.goToLabel = function (newsId) {
            $state.go('comments.labeling', { newsId: vm.newsId });
        };
        vm.goToLabeling = function (newsId) {
            $state.go('comments.labeling_v2', { newsId: vm.newsId });
        };
        var source = new EventSource('/sse');
        source.addEventListener('message', function (event) {
            var updatedComment = JSON.parse(event.data);
            vm.comments = []
            vm.comments.push(updatedComment);
            figureOutItemsToDisplay()
        });
        $scope.updateResearcherScore = function(comment) {
            var selectedSentiment = vm.sentiments.find(function(sentiment) {
                return sentiment._id === comment.sentiment_researcher;
            });
        
            switch (selectedSentiment.name) {
                case 'positive':
                    comment.researcher_score = 1;
                    break;
                case 'negative':
                    comment.researcher_score = -1;
                    break;
                case 'neutral':
                    comment.researcher_score = 0;
                    break;
                default:
                    comment.researcher_score = null;
                    break;
            }
        };
        
        
        vm.confirmLabeling = function () {
            if (confirm("Confirm labels ?")) {
                var updatePromises = [];
                vm.comments.forEach(function (element) {
                    updatePromises.push(CommentsService.update(element).$promise);
                });
        
                Promise.all(updatePromises)
                    .then(function (results) {
                        console.log("All comments have been updated:", results);
                        Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>Labeling Updated!' });
                    })
                    .catch(function (error) {
                        console.error("Error updating comments:", error);
                        Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>Labeling Not Updated!' });
                    });
            } else {
                console.log("Update canceled!");
            }
        };
        




        vm.newsId = $stateParams.newsId;
        vm.autoLabeling = function () {
            console.log("print", vm.newsId)
            var apiUrl = 'http://localhost:5000/sentiment';
            var url = apiUrl + '?newsId=' + vm.newsId;
            console.log("print_url", url)
            $http.post(url)
                .then(function (response) {
                    console.log(response);
                    Notification.success({ message: '<i class="fa fa-check" style="color: white;"></i>AutoLabeling Updated!' });
                    vm.figureOutItemsToDisplay();
                })
                .catch(function (error) {
                    console.error(error);
                    Notification.error({ message: '<i class="fa fa-bug" style="color: red;"></i>AutoLabeling Fail!' });

                })
        }

        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }
        
        function figureOutItemsToDisplay() {
            var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
            var end = begin + vm.itemsPerPage;
            var params = { currentPage: vm.currentPage };

            if (vm.search !== undefined) {
                params.search = vm.search;
                CommentsService.getTotal(params).$promise.then(function (number) {
                    vm.filterLength = number[0];
                    vm.totalPages = Math.ceil(vm.filterLength / vm.itemsPerPage);
                });
            }
            if (angular.isDefined(newsId)) {
                params.newsId = newsId;
            }


            CommentsService.query(params, function (data) {
                vm.filteredItems = data;
                vm.pagedItems = data;
                vm.comments = data
                SentimentsService.query(function (sentiments) {
                    vm.sentiments = sentiments;
                    data.forEach(function (element) {
                        if (!element.hasOwnProperty('sentiment_researcher')) {
                            element.sentiment_researcher = element.sentiment_ai;
                            element.researcher_score = element.score_ai
                        }
                        var sentiment = vm.sentiments.find(function(sentiment) {
                            return sentiment._id === element.sentiment_researcher;
                        });
                        if (sentiment && sentiment.name === 'positive') {
                            element.researcher_score = 1;
                        }else if(sentiment && sentiment.name === 'negative'){
                            element.researcher_score = -1;
                        }else{
                            element.researcher_score = 0;
                        }
                    });

                    vm.getSentimentName = function (sentimentId) {
                        for (var i = 0; i < vm.sentiments.length; i++) {
                            if (vm.sentiments[i]._id === sentimentId) {
                                return vm.sentiments[i].name;
                            }
                        }
                        return '';
                    };
                });


            });


        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }

    }
}());