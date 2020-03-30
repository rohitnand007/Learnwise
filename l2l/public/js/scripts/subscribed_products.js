/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$(document).ready(function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    function displaySubscribedSubjects(subjects) {

        var subscribedSubjectCardHtml = '';

        $.each(subjects, function (i, item) {

            subscribedSubjectCardHtml = '<div class="col-md-4"><div class="thumbnail caption"><a>'
                + '<img src="images/Capture.PNG" alt=""/></a><div>'
                + '<div class="logo-demo"><span class="custom-logo">DEMO</span></div>'
                + '<div class="text-center grade-txt">Grade ' + subjects[i].grade + '</div>'
                + '<h3 class="text-center">' + subjects[i].name + '</h3>'
                + '<h5 class="text-center sub-context">Price: ' + subjects[i].default_price
                + '</h5><div class="row text-center icon"><div class="col-md-4">'
                + '<i class="fa fa-2x fa-eye font-sizes"></i><span> 324</span></div>'
                + '<div class="col-md-4"><i class="fa fa-2x fa-heart font-sizes"></i>'
                + '<span> 121</span></div><div class="col-md-4">'
                + '<i class="fa  fa-2x fa-share-alt font-sizes"></i><span> 68</span></div>'
                + '</div></div></div></div>';

            $('#subscribed_subjects_div').append(subscribedSubjectCardHtml);

        });
    }

    if (localStorage.user === null || localStorage.user === undefined) {

        window.location.href = '/';

    } else {

        $.ajax(
            {
                type: "GET",
                url: url + '/products.json',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    'token': 'fpix2018'
                },
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                success: function (data) {
                    displaySubscribedSubjects(data.products);
                },
                error: function (msg) {
                    console.log(msg.responseText);
                }
            }
        );
    }
});