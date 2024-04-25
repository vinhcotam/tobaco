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
            console.log(vm.startfilterdate)
            console.log(vm.endfilterdate)

            figureOutItemsToDisplay();
        });
        vm.analysisSocial = function () {
            $http.post('http://localhost:5000/wordscloud_v1?type=week&start_date=2022-09-01&end_date=2022-9-22')
                .then(function (response) {
                    console.log(response.data);
                    var base64DataArray = response.data.img_array;
                    console.log("base64", base64DataArray);
                    displayImageSlider(base64DataArray);
                })
                .catch(function (error) {
                    console.error(error);
                });

            // function displayImageSlider(base64DataArray) {
            //     var imageWrapper = document.getElementById('imageWrapper');
            //     if (imageWrapper) {
            //         imageWrapper.innerHTML = '';

            //         base64DataArray.forEach(function (base64Data) {
            //             var image = new Image();
            //             image.onload = function () {
            //                 var slide = document.createElement('div');
            //                 slide.classList.add('swiper-slide');
            //                 var maxWidth = 500;
            //                 var maxHeight = 300;

            //                 var width = image.width;
            //                 var height = image.height;

            //                 if (width > maxWidth || height > maxHeight) {
            //                     var scaleFactor = Math.min(maxWidth / width, maxHeight / height);
            //                     width = width * scaleFactor;
            //                     height = height * scaleFactor;
            //                 }
            //                 image.width = width;
            //                 image.height = height;
            //                 slide.appendChild(image);
            //                 imageWrapper.appendChild(slide);
            //             };
            //             image.src = 'data:image/png;base64,' + base64Data;
            //         });
            //         new Swiper('.swiper-container', {
            //             spaceBetween: 0,
            //             pagination: {
            //                 el: '.swiper-pagination',
            //             },
            //         });
            //     }
            // }
            // function displayImageSlider(imageUrls) {
            //     var imageWrapper = document.getElementById('imageWrapper');


            //     imageUrls.forEach(function (imageUrl, index) {
            //         var slide = document.createElement('div');
            //         slide.classList.add('carousel-item');
            //         if (index === 0) {
            //             slide.classList.add('active');
            //         }

            //         var image = document.createElement('img');
            //         image.src = imageUrl;
            //         image.classList.add('d-block', 'w-100');

            //         slide.appendChild(image);
            //         imageWrapper.appendChild(slide);
            //     });

            // }
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


        function displayImagePopup(imageBlob) {
            var imageUrl = URL.createObjectURL(imageBlob);
            var popupImage = document.getElementById('popupImage');
            popupImage.src = imageUrl;

            $('#imageModal').modal('show');
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
