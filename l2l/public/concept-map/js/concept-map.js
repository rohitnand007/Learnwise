/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('/js/controllers/user_control.js', function () {
    $.getScript('/js/controllers/toc_control.js', function () {

        var topicId = localStorage.getItem("topicId");
        var learningOutcomes = [];

        userControl.getUserDetails(function (data) {

            $('#preloader').fadeOut(1000, function () {
                $('#preloader').hide();
            });

            localStorage.removeItem("demoContentAttempts");
            tocControl.unlockLearningPathContent(topicId, "content_2");

        }, function error(err) {

            $('#preloader').fadeOut(1000, function () {
                $('#preloader').hide();
            });

            tocControl.unlockDemoLearningPathContent(topicId, "content_2");
            // tocControl.unlockNextContent("content_2");

        });
    });
});