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
        vm.remove = remove;

        vm.socialobjectactivities = SocialobjectactivitiesService.query(function (data) {
            vm.socialobjectactivities = data;
            vm.buildPager();
        });

        //   vm.chooseType = function(){

        //   }
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
        vm.typeFilter = 'week'
        $('.choose_container input[value="week"]').prop('checked', true);
        $('.choose_container input[type="radio"]').change(function () {
            var selectedValue = $(this).val();
            vm.typeFilter = selectedValue
            // Thực hiện các thao tác khác dựa trên giá trị đã chọn
        });
        vm.isDateEmpty = false;
        vm.checkDateEmpty = function () {
            if (!vm.startfilterdate || !vm.endfilterdate) {
                vm.isDateEmpty = true;
            } else {
                vm.isDateEmpty = false;
            }
        };

        //get image from api
        vm.analysisSocial = function () {
            vm.checkDateEmpty();
            if (vm.isDateEmpty) {
                document.getElementById("error-container").style.display = "block";
                return;
            }
            var apiUrl = 'http://localhost:5000/wordscloud_v1';
            var type = encodeURIComponent(vm.typeFilter);
            var startDate = encodeURIComponent(vm.startfilterdate);
            var endDate = encodeURIComponent(vm.endfilterdate);
            ;
            document.getElementById("loading-container").style.display = "block";
            var url = apiUrl + '?type=' + type + '&start_date=' + startDate + '&end_date=' + endDate;
            $http.post(url)
                .then(function (response) {
                    console.log(response.data);
                    var base64DataArray = response.data.img_array;
                    if (Array.isArray(base64DataArray) && base64DataArray.length > 0) {
                        document.getElementById("loading-container").style.display = "none"
                        displayImageSlider(base64DataArray);

                    } else {
                        document.getElementById("no_data").style.display = "block";
                        document.getElementById("loading-container").style.display = "none"
                    }
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {

                });

            // display image into slider
            function displayImageSlider(base64DataArray) {
                var imageWrapper = document.getElementById('imageWrapper');
                if (imageWrapper) {
                    imageWrapper.innerHTML = '';

                    base64DataArray.forEach(function (base64Data, index) {
                        var image = new Image();
                        image.onload = function () {
                            var slide = document.createElement('div');
                            slide.classList.add('carousel-item');
                            if (index === 0) {
                                slide.classList.add('active');
                            }
                            //fix width, height of image
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

                    var mySwiper = new Swiper('.swiper-container', {
                        loop: true,
                        speed: 500,
                        autoplay: {
                            delay: 3000,
                            disableOnInteraction: false
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                    });
                } else {
                    console.error('Image wrapper not found.');
                }
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

            if (vm.search != undefined) {
                params.search = vm.search;
                SocialobjectactivitiesService.getTotal(params).$promise.then(function (number) {
                    vm.filterLength = number[0];
                });

            }

            SocialobjectactivitiesService.query(params, function (data) {
                //vm.filterLength = data[0].count;
                vm.filteredItems = data[0].data;
                vm.pagedItems = data[0].data;
            });
        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }

        //
        function remove(id) {
            if ($window.confirm('Are you sure you want to delete?')) {
                var socialobjectactivity = SocialobjectactivitiesService.delete({
                    socialobjectactivityId: id
                });
                window.location.reload();
            }
        }
    }
}());
