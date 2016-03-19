var app = angular.module('wsssGalleryApp', ['ui.bootstrap', 'ui.bootstrap.tpls', 'ui.router', 'ui.sortable', 'ngLodash', 'ui.bootstrap.contextMenu']).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('gallery', {
        url: "/",
        template: '<slick ng-if="dataLoaded" init-onload="false" data="dataLoaded" settings="slickConfig"><div carouseler class="carouseler face two enabled" ng-repeat="image in images" ng-if="image.showIt"><div class="img_holder swapped_{{image.swapState}}"><span class="helper"></span><img src="imgs/{{image.source}}" class="omg_img img_num_{{$index}}" data-img_num="{{$index}}" data-img_name="{{image.img_name}}" data-swapState="{{image.swapState}}" data-img_type="{{image.img_type}}"  data-img_source="{{image.source}}" /></div></div></slick>',
        controller: 'imageController',
        data: {}
    }).state('cms', {
        url: "/cms",
        template: '<div ui-view></div>',
        controller: 'cmsController',
        data: {}
    }).state('cms.hud', {
        url: '/hud',
        template: '  <ul cms id="cms" class="face cms three disabled" ui-sortable="sortableOptions" ng-model="images"><li ng-repeat="image in images" class="cms-item nav_img_holder ui-state-default data-swapped_{{image.swapState}}" data-swapped={{image.swapState}}  data-showState={{image.showIt}}><span class="flyOffTheHandle nav_helper ui-icon ui-icon-arrowthick-2-n-s"></span><img src="tn/imgs/{{image.source}}" class="omg_img img_num_{{$index}}" data-img_num="{{$index}}" data-img_name="{{image.img_name}}" data-img_type="{{image.img_type}}" data-swapState="{{image.swapState}}" data-img_source="{{image.source}}" context-menu="menuOptions"/></li></ul>',
        controller: 'cmsController',
        data: {}
    }).state('cms.upload', {
        url: "/upload",
        template: '<iframe src="uploadz.html" id="uploadframe"></iframe>',
        controller: 'uploadController',
        data: {}
    });
}).controller('imageController', ['$scope', '$stateParams', '$state', '$timeout', '$http', function($scope, $stateParams, $state, $timeout, $http, ldash) {
    window.$scope = $scope;
    $scope.uri = document.URL;
    window.$http = $http;
    $http.get('order.json').success(function(data, status, headers, config) {
        $scope.images = data;
        $scope.awesomeThings = data;
        $scope.dataLoaded = true;
        console.log("{-o-}{-o-}", $scope.goToSlideNum, _.findIndex($scope.images, function(o) {
            return o.active;
        }));
        $scope.goToSlideNum = _.findIndex($scope.images, function(o) {
            return o.active;
        }) > -1 ? _.findIndex($scope.images, function(o) {
            return o.active;
        }) : 1;
        //        console.log("|-o-| success", $scope.awesomeThings, $scope.images);
    }).
    error(function(data, status, headers, config) {
        console.log("{-x-} error", data, status, headers, config);
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
                    $state.go("gallery", {
                        location: true,
                        notify: false,
                        reload: false
                    });
                    $scope.data2post = {
                        "data": JSON.stringify($scope.images)
                    }
                    $scope.data2post = "data=" + JSON.stringify($scope.images);
                    $.post("post.py/get_info", $scope.data2post, function(response, status) { // Required Callback Function
                        //"response" receives - whatever written in echo of above PHP script.
                        console.log("*----Received Data----*\n\n", $scope.data2post, "Response : " + response + "\n\nStatus : ", status);
                    });
                    break;
                case "w":
                case "2":
                    $state.go("cms.hud", {
                        location: true,
                        notify: false,
                        reload: false
                    });
                    break;
                default:
                    break;
            }
        }
    }); /* */
}]).controller('cmsController', ['$scope', '$stateParams', '$state', '$timeout', '$http', function($scope, $stateParams, $state, $timeout, $http) {
    $("#cms").disableSelection();
    $scope.sortableOptions = {
        //        handle: ".flyOffTheHandle",
        update: function(e, ui) {
            console.log("WEEEE!!");
        },
    };
    console.log("HEADS UP!!", $scope.goToSlideNum);
    $scope.menuOptions = [
        ['Go To Item', function($itemScope, $event) {
            $("#cms .current_slide").removeClass("current_slide");
            window.$itemScope = $itemScope;
            window.$event = $event;
            var img = _.filter($("#cms img"), function(item) {
                return item.dataset.img_name === $itemScope.image.img_name;
            });
            $scope.goToSlideNum = parseInt($itemScope.image.img_name);
            console.log("~~~~~~~~~~~~~ $scope.goToSlideNum is:", $scope.goToSlideNum, " ::: $itemScope.image.img_name is: ", parseInt($itemScope.image.img_name));
            $(img).parent().addClass("current_slide");
            _.findIndex($scope.images, function(o) {
                return o.active, o.active = false;
            });
            var arctive = _.find($scope.images, function(o) {
                return parseInt(o.img_name) == parseInt($scope.goToSlideNum)
            });
            arctive.active = true;
            console.log("arctive|arctive|arctive", arctive);
            console.log("{-o-}{-o-} $scope.goToSlideNum is now: ", $scope.goToSlideNum, "active item is: ", _.findIndex($scope.images, function(o) {
                return o.active;
            }));
            console.log("|-o-|", $scope.goToSlideNum, img, $scope.images[$scope.goToSlideNum], arctive);
        }],
        null, ['Swap tags...', [
            ['Swapped', function($itemScope, $event) {
                var swappy = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                swappy.swapState = "swapped";
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                $(img).parent().attr("data-swapped", "swapped");
                console.log("swappy|swappy|swappy", swappy);
                console.log("|-o-| S", $itemScope.image);
            }],
            ['Haunted', function($itemScope, $event) {
                var swappy = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                swappy.swapState = "haunted";
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                $(img).parent().attr("data-swapped", "haunted");
                console.log("swappy|swappy|swappy", swappy);
                console.log("|-o-| H", $itemScope.image);
            }],
            ['Potential', function($itemScope, $event) {
                var swappy = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                swappy.swapState = "potential";
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                $(img).parent().attr("data-swapped", "potential");
                console.log("swappy|swappy|swappy", swappy);
                console.log("|-o-| P", $itemScope.image);
            }],
            ['Remove Tag', function($itemScope, $event) {
                var swappy = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                swappy.swapState = "none";
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                $(img).parent().remove("data-swapped");
                console.log("swappy|swappy|swappy", swappy);
                console.log("|-o-| P", $itemScope.image);
            }]
        ]],
        null, ['Deactivate/Reactivate...', [
            ['Deactivate item', function($itemScope, $event) {
                var showMe = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                showMe.showIt = false;
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                //                $(img).parent().addClass("hideMe");
                $(img).parent().attr("data-showState", false);
                console.log("showIt|showIt|showIt", showMe);
                console.log("{-o-}{-o-} ", _.findIndex($scope.images, function(o) {
                    return o.showIt;
                }));
                console.log("|-o-| S", $itemScope.image);
            }],
            ['Reactivate item', function($itemScope, $event) {
                var showMe = _.find($scope.images, function(o) {
                    return parseInt(o.img_name) == parseInt($itemScope.image.img_name)
                });
                showMe.showIt = true;
                var img = _.filter($("#cms img"), function(item) {
                    return item.dataset.img_name === $itemScope.image.img_name;
                });
                //                $(img).parent().removeClass("hideMe");
                $(img).parent().attr("data-showState", true);
                console.log("showIt|showIt|showIt", showMe);
                console.log("{-o-}{-o-} ", _.findIndex($scope.images, function(o) {
                    return o.showIt;
                }));
                console.log("|-o-| S", $itemScope.image);
            }]
        ]]
    ];
}]).controller('uploadController', ['$scope', '$stateParams', '$state', '$timeout', '$http', function($scope, $stateParams, $state, $timeout, $http) {
}]).directive('slick', function($timeout, $state) {
    //}).directive('carouseler', function($timeout) {
    return function(scope, el, attrs) {
        $timeout((function() {
            /* */
            $scope.slickElement = el;
            window._el = el;
            console.log("|-o-| $scope.slickElement", $scope.slickElement);
            el.slick({
                enabled: true,
                centerMode: false,
                centerPadding: 0,
                infinite: true,
                slidesToScroll: 1,
                slidesToShow: 1,
                speed: 4000,
                touchMove: true,
                touchThreshold: 8,
                variableWidth: true
            }).css({
                "height": $(document).height()
            });
            $("slick").slick("slickGoTo", $scope.goToSlideNum -1, false);
            $scope.slickElement.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
                //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
                //var i = (currentSlide ? currentSlide : 0) + 1;
                $scope.goToSlideNum = (currentSlide ? currentSlide : 0) + 1;
                //$status.text(i + '/' + slick.slideCount);
                console.log("|-o-||-o-| ", $scope.goToSlideNum);
            });
        }), 500)
    }
}).directive('cms', function($timeout, $state) {
    return function(scope, el, attrs) {
        $timeout((function() {
            if ($("#cms .current_slide").length > 0) {
                $("#cms .current_slide").removeClass("current_slide");
            }
            $('#cms img[data-img_num=' + ($scope.goToSlideNum) + ']').parent().addClass("current_slide");
        }), 500)
    }
}).filter('orderObjectBy', function() {
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function(a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});