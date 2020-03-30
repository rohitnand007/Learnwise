/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$(document).ready(function () {

    var sectionInfo = JSON.parse(localStorage.getItem("sectionInfo"));
    var selectedSubjectInfo = JSON.parse(localStorage.getItem("selectedContent"));

    $.getScript('./js/controllers/toc_control.js', function () {

        tocControl.getTopics(selectedSubjectInfo.selectedSubject, sectionInfo._id, function(topicsData) {
            console.log("TopicsInfo:" + JSON.stringify(topicsData));
            var topics = topicsData.topics;

            $('#section_name').html(sectionInfo._display_name);

            function displayTopics(topic) {

                var topicId = topic.ce._id.toLowerCase();
                var topicHtml = "";

                if (topic._unlocked === true) {
                    topicHtml += '<div class="col-md-4"><div class="thumbnail caption topic-display cursor-pointer" id="' + topicId + '"><a>' +
                        '<img src="images/Capture.PNG" alt=""/></a><div><div class="logo-demo1 logo-border">' +
                        '<span class="custom-logo">' + topic._learning_status + '%</span></div>';
                } else if (topic._demo_content === "true") {
                    topicHtml += '<div class="col-md-4"><div class="thumbnail caption topic-display cursor-pointer" id="' + topicId + '"><a>' +
                        '<img src="images/Capture.PNG" alt=""/></a><div><div class="logo-demo1 logo-border">' +
                        '<span class="custom-logo">0%</span></div>';
                } else {
                    topicHtml += '<div class="col-md-4 learning-content-disable"><div class="thumbnail caption topic-display cursor-pointer" id="' + topicId + '"><a>' +
                        '<img src="images/Capture.PNG" alt=""/></a><div><div class="logo-demo1 logo-border locked">' +
                        '<span class="custom-logo"><img src="../../images/icn_Lock.svg" class="curriculum-lock"></span></div>';
                }

                topicHtml += '<h5 class="text-center thumbnail-headingfont text-wrap">' + topic._display_name + '</h5>' +
                    '<h6 class="text-center thumbnail-subtextfont text-wrap">Describe the structure and components of cell membrane.</h6>' +
                    '<div class="row text-center icon margin-zero"><div class="col-md-4"><i class="fa fa-2x fa-eye font-sizes"></i><span>' +
                    '0</span></div><div class="col-md-4"><i class="fa fa-2x fa-heart font-sizes"></i><span> 0</span></div><div class="col-md-4">' +
                    '<i class="fa  fa-2x fa-share-alt font-sizes"></i><span> 0</span></div></div></div></div></div>';

                $('#topics_content').append(topicHtml);

            }

            if (Array.isArray(topics)) {

                if (topics.length > 0) {
                    for (var i in topics) {
                        displayTopics(topics[i]);
                    }
                }

            } else {

                displayTopics(topics);

            }

            $(".topic-display").click(function () {
                // console.log("Topic click: "+this.id);
                localStorage.setItem("topicId", this.id);
                window.location.href = "/learningpath2.html";
            });

        }, function (error) {
            console.log("Topics Load Error");
        });

    });

    $('#back_to_curriculum').click(function () {

        localStorage.removeItem("sectionInfo");
        localStorage.removeItem("section");
        window.location.href = '../../curriculum.html';

    });

});
