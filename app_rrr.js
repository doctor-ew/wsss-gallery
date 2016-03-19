'use strict';
angular.module('wsssGalleryApp', ['slickCarousel', 'ui.router'])/*.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'SlickController'
    }).when('/cms/', {
        templateUrl: 'views/cms.html',
        controller: 'CMSController'
    }).otherwise({
        redirectTo: '/'
    });
}])*/
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('state1', {
          url: "/",
          template: 'Hello from the first Tab!',
          controller: 'FirstCtrl',
          data:{}
        })
        .state('state2', {
          url: "/route2",
          template: 'Hello from the 2nd Tab!<br>' +
                    '<a ui-sref="state2.list">Show List</a><div ui-view></div>',
          controller: 'SecondCtrl',
          data: {}
        })
          .state('state2.list', {
            url: '/list',
            template: '  <ul id ="cms" class="face cms three disabled" ng-repeat="value in images"><li class="cms-item nav_img_holder ui-state-default"><span class="flyOffTheHandle nav_helper ui-icon ui-icon-arrowthick-2-n-s"></span><img src="{{value.source}}" class="omg_img {{value}} img_num_{{$index}}" data-img_num="{{$index}}" /></li></ul>',
            controller: 'SecondCtrl',
            data: {}
          });
});

/*
.config(function($stateProvider) {
        $stateProvider
            .state('gallery', {
                mode: 'default',
                url: '/',
                views: {
                    'chrome@': {
                        templateUrl: 'components/auth/authenticated.html',
                        controller: 'AuthController as auth',
                        resolve: {
                            scheduleData: getScheduleData
                        }
                    }
                }
            })
*/
/*
       // Define base states: authenticated and unauthenticated
        $stateProvider
            .state('authenticated', {
                mode: 'default',
                url: '/',
                views: {
                    'chrome@': {
                        templateUrl: 'components/auth/authenticated.html',
                        controller: 'AuthController as auth',
                        resolve: {
                            scheduleData: getScheduleData
                        }
                    }
                }
            })
            .state('unauthenticated', {
                url: '/logout',
                views: {
                    'chrome@': {
                        templateUrl: 'components/auth/unauthenticated.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

*/

/*
  $stateProvider
    .state('index', {
      url: "",
      views: {
        "gallery": { template: "views/home.html" },
        "cms": { template: "" }
      }
    })
    .state('route1', {
      url: "/gallery",
      views: {
        "gallery": { template: "views/home.html" },
        "cms": { template: "" }
      }
    })
    .state('route2', {
      url: "/cms",
      views: {
        "gallery": { template: "" },
        "cms": { template: "views/cms.html" }
      }
    })
})
*/
.config(['slickCarouselConfig', function(slickCarouselConfig) {
    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = true;
}]).controller('imageController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    $scope.things = ["A", "Set", "Of", "Things"];
    $http.get('order.json').success(function(data, status, headers, config) {
        $scope.images = data;
        $scope.awesomeThings = data;
        $scope.dataLoaded = true;
        console.log("|-o-| success", $scope.awesomeThings, $scope.images);
    }).
    error(function(data, status, headers, config) {
        console.log("{-x-} error", data, status, headers, config);
    });
}]).controller('SlickController', function($scope, $timeout, $http) {
    window._scope = $scope;
    // $timeout(function() {
    $http.get('order.json').success(function(data, status, headers, config) {
        $scope.images = data;
        $scope.awesomeThings = data;
        $scope.dataLoaded = true;
        console.log("|-o-| success", $scope.awesomeThings, $scope.images);
    }).
    error(function(data, status, headers, config) {
        console.log("{-x-} error", data, status, headers, config);
    });
    // }, 500);
    $scope.slickConfig = {
        enabled: true,
        centerMode: false,
        centerPadding: 0,
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        speed: 4000,
        touchMove: true,
        touchThreshold: 8,
        variableWidth: true,
        method: {},
        event: {
            beforeChange: function(event, slick, currentSlide, nextSlide) {},
            afterChange: function(event, slick, currentSlide, nextSlide) {}
        }
    };
}).controller('CMSController', function($scope) {

}).directive('slick', function($timeout) {
    //}).directive('carouseler', function($timeout) {
    return function(scope, el, attrs) {
        $timeout((function() {
            /* */
            window._el = el;
            console.log("|-o-| el", el);
            el.css({
                "height": $(document).height()
            });
            $(document).keypress(function(e) {
                var s = String.fromCharCode(e.which);
                if (s.match(/[a-zA-Z0-9\.]/)) {
                    //console.log(s + ' is a match!');
                    switch (s) {
                        case "a":
                        case "z":
                            $(".slick-prev").click()
                            break;
                        case "s":
                        case "d":
                        case "x":
                            $(".slick-next").click();
                            break;
                        case "q":
                        case "1":
                            calcRotation(0);
                            $(".carouseler").slick("slickGoTo", goToSlideNum, true);
                            var data = {
                                "data": JSON.stringify(window.arr_images)
                            }
                            $.post("savelist.php", data, function(response, status) { // Required Callback Function
                                //"response" receives - whatever written in echo of above PHP script.
                                console.log("*----Received Data----*\n\n", data, "Response : " + response + "\n\nStatus : ", status);
                            });
                            break;
                        case "w":
                        case "2":
                            calcRotation(90);
                            $("#cms .current_slide").removeClass("current_slide");
                            $('#cms img[data-img_num=' + (goToSlideNum - 1) + ']').parent().addClass("current_slide");;
                            break;
                        default:
                            break;
                    }
                }
            }); /* */
        }), 500)
    }
})