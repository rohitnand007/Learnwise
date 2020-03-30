/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/content_control.js', function () {
    $.getScript('./js/controllers/toc_control.js', function () {

        /*$('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });*/

        var keywordsList = {};
        var keywords = [], keywordsExplanation = [];

        var topicId = localStorage.getItem("topicId");

        userControl.getUserDetails(function (data) {

            console.log("User Data::"+JSON.stringify(data));
            var userPreferences = data.user.profile_preferences;
            if(userPreferences && userPreferences.keywordsActivityModalHide && (userPreferences.keywordsActivityModalHide === true)){
                $("#activity-start-modal").modal('hide');
            }else{
                $("#activity-start-modal").modal('show');
            }
            localStorage.removeItem("demoContentAttempts");
            tocControl.unlockLearningPathContent(topicId, "content_4");

        }, function error(err) {
            $("#activity-start-modal").modal('show');

            tocControl.unlockDemoLearningPathContent(topicId, "content_4");
            // tocControl.unlockNextContent("content_4");

        });

        /*var url = window.location.protocol + '//' + window.location.hostname;

        if (window.location.port) {
            url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        }

        url = 'http://54.200.251.236';*/

        function parseHtmlEnteties(str) {

            return str.replace(/&#([0-9]{1,3});/gi, function (match, numStr) {

                var num = parseInt(numStr, 10); // read num as normal number

                return String.fromCharCode(num);

            });

        }

        var correctAnswer = false, showHint = false;

        var currentIndex;

        var explanation;

        function initKeywordOptionClick() {
            $('#preloader').hide();
            explanation = $("#keywords_explanation_carousel").find(".item.active p").text();

            $("#current-keyword-number").html($("#keywords_explanation_carousel").find(".item.active p").index() + 1);

            correctAnswer = false;

            showHint = false;

            var optionClickCount = 1;

            var optionStatusImage = '<div><img src="images/icn_letsStart.svg" width="123" height="52" alt="" /></div>';

            $('#option_click_status_text').text('Select the right keyword for the above description');

            $(".keywords_button").on("click", function () {

                var key = this.id;

                currentIndex = $("#keywords_explanation_carousel").find(".item.active").index();

                if ((keywordsList[key] === explanation) || (keywordsList[key] === keywordsExplanation[currentIndex])) {

                    correctAnswer = true;

                    optionClickCount = 0;

                    var correctAnswerStatusImage = '<div><img src="images/icn_correctAnswer.svg" width="123" height="52" alt="" /></div>';

                    $('#option_status_carousel').text('Awesome!').append(correctAnswerStatusImage);

                    $('#keywords_options').find('button.btn-wrong-option').removeClass('btn-wrong-option').addClass('btn-default-options');

                    $("#" + this.id).removeClass('btn-default-options').addClass('btn-correct-option');

                    var nextSlide = "";

                    if ($("#keywords_explanation_carousel").find(".item.active").index() < (keywords.length - 1)) {

                        nextSlide = "<a class='cursor-pointer'>Let's move ahead <img src='images/icn_arrow.svg' width='12' height='12'></a>";

                        $('#option_click_status_text').empty().append(nextSlide);

                    } else {

                        correctAnswer = false;

                        nextSlide = "<h4 class='m-bottom5'>You have successfully completed the activity...</h4>" +
                            "<a href='index.html' class='cursor-pointer'>Go to Home ></a>";

                        $('#option_click_status_text').empty().append(nextSlide);

                    }

                } else {

                    var wrongAnswerStatusImage = '<div><img src="images/icn_wrongAnswer.svg" width="123" height="52" alt="" /></div>';

                    if (optionClickCount === 1) {

                        $('#option_click_status_text').text('Try again....');

                        $('#option_status_carousel').text('Uh - Oh!').append(wrongAnswerStatusImage);

                    } else if (optionClickCount === 2) {

                        $('#option_click_status_text').text('One more time....');

                        $('#option_status_carousel').text('Oops').append(wrongAnswerStatusImage);

                    } else if (optionClickCount === 3) {

                        $('#option_click_status_text').text('You can do better now ;)');

                        var temp = '<a class="cursor-pointer">Show Answer</a>';
                        temp += wrongAnswerStatusImage;

                        $('#option_status_carousel').html(temp);

                        showHint = true;

                    }

                    if (!correctAnswer && optionClickCount < 4) {

                        if (!($("#" + this.id).hasClass('btn-wrong-option'))) {

                            $('#keywords_options').find(' button.btn-wrong-option').removeClass('btn-wrong-option').addClass('btn-default-options');

                            optionClickCount = optionClickCount + 1;

                            $("#" + this.id).removeClass('btn-default-options').addClass('btn-wrong-option');

                        }

                    }
                }

            });


        }

        function createShuffledKeywordOptions(keywordsArray) {

            if (keywordsArray.length > 0) {

                /*To shuffle the array elements*/
                var j, x, i;

                for (i = keywordsArray.length; i; i--) {

                    j = Math.floor(Math.random() * i);

                    x = keywordsArray[i - 1];

                    keywordsArray[i - 1] = keywordsArray[j];

                    keywordsArray[j] = x;
                }

                /*Creating keywords as options*/
                var activity_options = "";
                var temp = 0;

                for (i in keywordsArray) {

                    activity_options += ((temp % 4) === 0) ? '<div class="row" style="padding-top: 40px;">' : '';

                    activity_options += '<div class="col-md-3 col-sm-6 col-xs-12 keywords-margin"><a><button type="button" id="'  + keywordsArray[i] + '" class="keywords_button btn-default-options">' + keywordsArray[i].replace(/_/g, " ") + '</button></a></div>';

                    activity_options += ((temp % 4) === 3) ? '</div>' : '';

                    temp = ++temp;

                }

                $("#keywords_options").empty().append(activity_options);

                initKeywordOptionClick();

            }

        }

        function createKeywordExplanationCarousel() {

            var activity_carousel = "";

            var temp = 0;
            var keyword;
            for (keyword in keywordsList) {

                /*Activity Questions Div*/
                activity_carousel = (temp === 0) ? '<div class="item active">' : '<div class="item">';

                activity_carousel += '<div class="row">' +
                    '<div class="col-md-12 col-sm-12 col-xs-12">' +
                    '<div class="col-md-1 col-sm-1 col-xs-1"></div>' +
                    '<div class="col-md-10 col-sm-10 col-xs-10">' +
                    '<p class="text-center subtext-font">' + keywordsList[keyword] + '</p>' +
                    '</div>' +
                    '<div class="col-md-1 col-sm-1 col-xs-1"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $("#keywords_explanation_carousel").append(activity_carousel);

                temp = ++temp;
            }

            $("#total-keywords-number").html(keywords.length);
            createShuffledKeywordOptions(keywords);

        }

        contentControl.getKeywordsContent(topicId, function (keywordData) {

            keywords = JSON.parse("[" + keywordData.keywords_array + "]");

            keywordsExplanation = JSON.parse("[" + keywordData.keywords_explanation_array + "]");

            if (keywords.length > 0) {
                var i;
                for (i = 0; i < keywords.length; i++) {

                    keywords[i] = keywords[i].replace(/\s/g, '_');

                    keywordsList[keywords[i]] = parseHtmlEnteties(keywordsExplanation[i]);

                }

                createKeywordExplanationCarousel();

            }

        });

        $('.carousel').carousel({
            interval: false
        }).on('slid.bs.carousel', function () {

            // console.log("Next:"+$(".item.active").index());

            explanation = $("#keywords_explanation_carousel").find(".item.active p").text();

            $("#current-keyword-number").html($(".item.active").index() + 1);

            // $('.carousel').carousel('pause');

        }).on('slide.bs.carousel', function (e) {
            console.log("before Next:" + ($(e.relatedTarget).index() < $(".item.active").index()));

            /*Check for preventing previous slide navigation in first slide*/
            if ($(".item.active").index() === 0 && ($(e.relatedTarget).index() === (keywords.length - 1))) {
                console.log("Check 1");

                e.preventDefault();

            } else if ($(e.relatedTarget).index() < $(".item.active").index()) {

                console.log("Check");
                createShuffledKeywordOptions(keywords);

            }


        });

        $("#carousel_next, #option_click_status_text").on("click", function () {

            console.log("Entered");

            if (correctAnswer) {

                var optionStatusImage = '<div><img src="images/icn_letsStart.svg" width="123" height="52" alt="" /></div>';

                $('#option_status_carousel').text("One more...").append(optionStatusImage);

                createShuffledKeywordOptions(keywords);

                $('.carousel').carousel('next');

            }

        });

        $("#option_status_carousel").on("click", function () {

            if (showHint) {

                var imagesServerUrl = "https://s3.ap-south-1.amazonaws.com/b2c-demo/assets/";
                var hintImage = '<div><img src="' + imagesServerUrl + topicId + '/Keywords/images/img_' + currentIndex + '.png" alt="" /></div>';

                $('#keyword_hint').empty().append(hintImage);

                $('#activity_hint_modal').modal('show');

            }

        });

        $('#logo_icon').click(function () {

            userControl.getUserDetails(function (data) {

                if (data) {
                    window.location.href = '/curriculum.html';
                }

            }, function error(err) {
                window.location.href = '/index.html'
            });

        });

        $("#activity-modal-close").click(function () {
            var checkValue = $("#check1").prop('checked');

            if(checkValue){
                userControl.saveUserPreference("keywordsActivityModalHide", checkValue, function (data) {
                   // console.log("Data preferences:"+JSON.stringify(data));
                    $("#activity-start-modal").modal('hide');
                }, function (error) {
                    // console.log("Data preferences Error:"+JSON.stringify(error));
                    $("#activity-start-modal").modal('hide');
                });
            }else{
                $("#activity-start-modal").modal('hide');
            }
        });
    });
});
