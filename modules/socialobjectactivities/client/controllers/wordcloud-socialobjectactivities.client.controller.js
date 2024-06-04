(function () {
    'use strict';

    angular
        .module('socialobjectactivities')
        .controller('WordCloudController', WordCloudController);

    WordCloudController.$inject = ['$scope', '$filter', '$state', '$window', 'Authentication', 'SocialobjectactivitiesService', '$http'];

    function WordCloudController($scope, $filter, $state, $window, Authentication, SocialobjectactivitiesService, $http) {
        var vm = this;
        vm.authentication = Authentication;
        if (vm.authentication.user == null) {
            window.location.href = '/authentication/signin';
        }
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        // vm.remove = remove;

        vm.socialobjectactivities = SocialobjectactivitiesService.query(function (data) {
            vm.socialobjectactivities = data;
            vm.buildPager();
        });

        SocialobjectactivitiesService.getTotal().$promise.then(function (number) {
            vm.filterLength = number[0];
        });

        $('#datetimefilter').daterangepicker({
            opens: 'left'
        }, function (start, end, label) {
            vm.startfilterdate = start.format('YYYY-MM-DD');
            vm.endfilterdate = end.format('YYYY-MM-DD');
            figureOutItemsToDisplay();
        });

        vm.chooseType = 'week';
        vm.displayType = 'image';
        vm.isDateEmpty = false;

        vm.checkDateEmpty = function () {
            vm.isDateEmpty = !vm.startfilterdate || !vm.endfilterdate;
        };
        if (vm.displayType === 'chart') {
            console.log("zooo")
            vm.initBarChart(vm.text_list);
        }
        vm.analysisSocial = function () {
            vm.checkDateEmpty();
            if (vm.isDateEmpty) {
                document.getElementById("error-container").style.display = "block";
                return;
            }
            var apiUrl = 'http://localhost:5000/wordscloud_v1';
            var type = encodeURIComponent(vm.chooseType);
            var startDate = encodeURIComponent(vm.startfilterdate);
            var endDate = encodeURIComponent(vm.endfilterdate);
            document.getElementById("loading-container").style.display = "block";
            var url = apiUrl + '?type=' + type + '&start_date=' + startDate + '&end_date=' + endDate;
            $http.post(url)
                .then(function (response) {
                    var base64DataArray = response.data.img_array;
                    vm.base64DataArray = base64DataArray;
                    vm.text_list = response.data.text_list;

                    if (Array.isArray(base64DataArray) && base64DataArray.length > 0) {
                        document.getElementById("loading-container").style.display = "none";
                        if (vm.displayType === 'chart') {
                            console.log("zooo")
                            vm.initBarChart();
                        } else {
                            vm.displayImageSlider();

                        }
                        document.getElementById("demo").style.display = "block";
                        document.querySelector("#demo .carousel-indicators").style.display = "flex !important";
                    } else {
                        document.getElementById("no_data").style.display = "block";
                        document.getElementById("loading-container").style.display = "none";
                        document.querySelector("#demo .carousel-indicators").style.display = "none";
                    }


                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    document.getElementById("demo").style.display = "block";
                });


        };
        vm.displayImageSlider = function displayImageSlider() {
            var imageWrapper = document.getElementById('imageWrapper');
            if (imageWrapper) {
                imageWrapper.innerHTML = '';
                vm.base64DataArray.forEach(function (base64Data, index) {
                    var image = new Image();
                    image.onload = function () {
                        var slide = document.createElement('div');
                        slide.classList.add('carousel-item');
                        if (index === 0) {
                            slide.classList.add('active');
                        }
                        var maxWidth = 720;
                        var maxHeight = 1920;
                        var width = image.width;
                        var height = image.height;
                        var aspectRatio = width / height;
                        if (width > maxWidth) {
                            width = maxWidth;
                            height = width / aspectRatio;
                        }
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = height * aspectRatio;
                        }

                        var imgElement = document.createElement('img');
                        imgElement.src = image.src;
                        imgElement.classList.add('d-block');
                        imgElement.classList.add('mx-auto');
                        imgElement.width = width;
                        imgElement.height = height;
                        slide.appendChild(imgElement);
                        imageWrapper.appendChild(slide);
                    };
                    image.onerror = function () {
                        console.error('Error loading image:', image.src);
                    };
                    image.src = 'data:image/png;base64,' + base64Data;
                });
            } else {
                console.error('Image wrapper not found.');
            }
        }
        vm.initBarChart = function () {
            var labels = Object.keys(vm.text_list);
            var data = Object.values(vm.text_list);
            var ctx = document.getElementById('barChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Frequency',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {

                        },
                        y: {
                            stacked: true,
                            ticks: {
                                align: 'start'
                            },
                            gridLines: {
                                display: false
                            }
                        }
                    },
                    legend: {
                        display: true
                    }
                }
            });
        };
        vm.downloadAsImage = function () {
            console.log("checkkk", vm.displayType);
            if(vm.displayType == "chart"){
                vm.downloadBarChartAsImage();
            }else{
                vm.downloadCurrentCarouselImage();
            }
        }
        vm.downloadBarChartAsImage = function () {
            var canvas = document.getElementById('barChart');
            var image = canvas.toDataURL('image/png');
            var link = document.createElement('a');
            link.href = image;
            link.download = 'bar_chart.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        vm.downloadCurrentCarouselImage = function () {
            var activeItem = document.querySelector('#demo .carousel-item.active img');
            if (activeItem) {
                var imageSrc = activeItem.getAttribute('ng-src') || activeItem.src;
                
                var link = document.createElement('a');
                link.href = imageSrc;
                link.download = 'carousel-image.png';
        
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('No active image found in the carousel.');
            }
        };
        
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
                SocialobjectactivitiesService.getTotal(params).$promise.then(function (number) {
                    vm.filterLength = number[0];
                });
            }

            SocialobjectactivitiesService.query(params, function (data) {
                vm.filteredItems = data[0].data;
                vm.pagedItems = data[0].data;
            });
        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }
    }
}());
