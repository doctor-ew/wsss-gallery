var goToSlideNum = 0;
var $slickElement = $('.carouseler');

function calcRotation(rot) {
    switch (rot) {
        case 0:
            // q hit
            // turns to gallery
            if ($(".carouseler").css("display") == "none") {
                $(".carouseler").fadeIn("slow", function() {});
            }
            if ($(".cms").css("display") == "block") {
                $(".cms").fadeOut("slow", function() {});
            }
            break;
        case 90:
            // w hit
            // turns to cms
            if ($(".cms").css("display") == "none") {
                $(".cms").fadeIn("slow", function() {});
            }
            if ($(".carouseler").css("display") == "block") {
                $(".carouseler").fadeOut("slow", function() {});
            }
            break;
        default:
            break;
    }
    $("#cube").css("transform", "rotateY(-" + rot + "deg)");
}

function theCurrator(arr_images) {
    window.arr_images = arr_images;
    doArrayStuff(arr_images);
    slider = $('.carouseler').slick({
//        autoplay: false,
//        autoplaySpeed: 0,
//        cssEase: 'linear',
centerMode:false,
centerPadding:0,
infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        speed: 4000,
touchMove:true,
touchThreshold:8,
        variableWidth: true
/*
centerMode:false,
centerPadding:0,
infinite: true,
slidesToShow: 1, 
speed:4000
touchMove:true,
touchThreshold:8,
variableWidth:true,
*/

    }).css({
        "height": $(document).height()
    });
}

function doArrayStuff(arr_images) {
    $.each(arr_images, function(index, filename) {
        /*
                        jQuery.each(arr_images, function(i,arr_images) { 
                            jQuery.get(arr_images[i]);
                        });

        */
        console.log(filename, jQuery.get(filename));
        $(".three").append($("<li class=\"cms-item nav_img_holder ui-state-default\"><span class=\"flyOffTheHandle nav_helper ui-icon ui-icon-arrowthick-2-n-s\"></span><img src=\"tn/" + filename + "\" data-img_num=\"" + index + "\"></img></li>"));
        $(".carouseler").append($("<div class=\"img_holder\"><span class=\"helper\"></span><img class=\"omg_img img_num_" + index + "\" src=" + filename + " data-img_num=\"" + index + "\" ></img></div>"));
        $('.carouseler .img_holder').css({
            "height": $(document).height()
        });
    });
    $('#cms img[data-img_num=' + goToSlideNum + ']').parent().addClass("current_slide");
    $("#cms img").click(function() {
        goToSlideNum = $(this).attr("data-img_num");
        $("#cms .current_slide").removeClass("current_slide");
        $(this).parent().addClass("current_slide");
        console.log("|-o-|", goToSlideNum, $(this).attr("data-img_num"), $(this));
    });
    window.arr_images = arr_images;
};
$(function() {
    var arr_images = [];
    $.get("gallery.txt", function(data) {
            arr_images = JSON.parse(data);
            theCurrator(arr_images);
        }).fail(function(a, b, c) {
            console.log("#### FAIL  Error 0:", a, b, c, dir);
            var dir = "imgs/";
            var arr_images = [];
            $.ajax({
                url: dir,
                success: function(data) {
                    console.log("##### SUCCESS  |-o-||-o-||-o-|", data);
                    window._data = data;
                    $(data).find("a:contains('.jpg'),a:contains('.png')").each(function() {
                        var filename = dir + $(this).attr("href"); // + "?cb=01";
                        arr_images.push(filename);
                    });
                    theCurrator(arr_images);
                },
                error: function(a, b, c) {
                    console.log("#### error 1:", a, b, c);
                }
            });
        })
        /* .done(function(){
            });*/
    $slickElement.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
        //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
        //var i = (currentSlide ? currentSlide : 0) + 1;
        goToSlideNum = (currentSlide ? currentSlide : 0) + 1;
        //$status.text(i + '/' + slick.slideCount);
        console.log("|-o-||-o-| ", goToSlideNum);
    });
    $(document).keypress(function(e) {
        var s = String.fromCharCode(e.which);
        if (s.match(/[a-zA-Z0-9\.]/)) {
            //console.log(s + ' is a match!');
            switch (s) {
                case "a":
                case "z":
                    $(".slick-next").click();
                    break;
                case "s":
                case "d":
                case "x":
                    $(".slick-prev").click()
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
                    /*
                                        $.ajax({
                                            url: document.URL + "savelist.php",
                                            type: 'POST',
                                            data: JSON.stringify(window.arr_images),
                                            success: function(s) {
                                                console.log('success',s);
                                            },
                                            error: function(a,b,c) {
                                                console.log('failure',a,b,c);
                                            }
                                        });
                    */
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
    });
    $("#cms").sortable({
        handle: ".flyOffTheHandle",
        update: function(event, ui) {
            arr_images = [];
            $("#cms").find("img").each(function() {
                arr_images.push($(this).attr("src"));
            });
            /* */
            $(".img_holder").not(".slick-cloned").find("img").each(function(i) {
                console.log(i, $(this).attr("src"), arr_images[i]);
                $(this).attr("src", arr_images[i]);
            });
            $(".slick-cloned").eq(0).find("img").attr("src", $(arr_images).last()[0]);
            $(".slick-cloned").eq(1).find("img").attr("src", arr_images[0]);
            window.arr_images = arr_images;
            /* */
        }
    });
    $("#cms").disableSelection();
});