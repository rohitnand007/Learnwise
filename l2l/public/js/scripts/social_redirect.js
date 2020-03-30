/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

function social_login(platform) {
    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    var previousUrl = localStorage.getItem('previousUrl');

    var socialCall = $.ajax({
        type: "GET",
        url: url + '/set_redirect_url_after_login.json?redirect_url='
            + previousUrl,
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

            console.log('Data:' + JSON.stringify(data));
            if (platform === 'facebook') {
                window.location.href = url + '/users/auth/facebook';
            } else if (platform === 'googleplus') {
                window.location.href = url + "/users/auth/google_oauth2";
            }

        },
        error: function (msg) {
            console.log(msg.responseText);
        }
    });
}
