/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/user_control.js', function () {
    $.getScript('./js/controllers/toc_control.js', function () {

        var topicId = localStorage.getItem("topicId");
        var learningOutcomes = [];

        function getlearningOutComes() {

            $.getJSON("/content/assets/learning_outcomes.json", function (json) {

                $('#preloader').fadeOut(1000, function () {
                    $('#preloader').hide();
                });

                learningOutcomes = json.learning_outcomes;
                var positionIndex = learningOutcomes.map(function (e) {
                    return e.TOPICID;
                }).indexOf(topicId);

                if (positionIndex > -1) {

                    localStorage.setItem('topicVideoPath',
                        learningOutcomes[positionIndex].videoPath);

                    localStorage.setItem('topicVideoId', learningOutcomes[positionIndex].videoId);

                    $('#topic_name').text(learningOutcomes[positionIndex].TOPICNAME);
                    $('#topic_description').text(
                        learningOutcomes[positionIndex].DESCRIPTION
                    );

                    var i;
                    var learningOutcomesPTag;
                    for (i = 1; i <= 4; i++) {
                        learningOutcomesPTag = '<p>' + learningOutcomes[positionIndex]["LEARNINGOUTCOMES" + i] + '</p>';
                        $('#learning_outcomes').append(learningOutcomesPTag);
                    }
                    $('#outcome_image').append('<img src="./content/images/' + topicId + '.png"/>');

                }

            });
        }

        userControl.getUserDetails(function (data) {

            localStorage.removeItem("demoContentAttempts");

            tocControl.unlockLearningPathContent(topicId, "content_1");

            getlearningOutComes();

        }, function error(err) {

            tocControl.unlockDemoLearningPathContent(topicId, "content_1");
            // tocControl.unlockNextContent("content_1");

            getlearningOutComes();

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
    });
});
