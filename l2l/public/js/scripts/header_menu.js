/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('/js/controllers/user_control.js', function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    // url = 'http://54.200.251.236';

    function hideLoaderImage() {
        $('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });
    }

    /*if (userControl.isUserLoggedIn()) {

        hideLoaderImage();
        var userInfo = JSON.parse(localStorage['user']);
        if (userInfo.username.length > 12) {
            var tempUsername = userInfo.username.slice(0, 10) + '..';
            userInfo.username = tempUsername;
        }
        $('#signin_nav').hide();
        $('#signup_nav').hide();
        $('#profile_nav').show();
        $('#profile_nav').text(userInfo.username).append('<span class="glyphicon glyphicon-user p-left4"></span>');
        $('#signout_nav').show();

    } else {*/

        $('#signin_nav').hide();
        $('#signup_nav').hide();

        userControl.getUserDetails(function (data) {

            hideLoaderImage();
            console.log("Success");
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.username.length > 12) {
                var tempUsername = data.user.username.slice(0, 10) + '..';
                data.user.username = tempUsername;
            }
            $('#signin_nav').hide();
            $('#signup_nav').hide();
            $('#profile_nav').show();
            $('#profile_nav').text(data.user.username).append( '<span class="glyphicon glyphicon-user p-left4"></span>');
            $('#signout_nav').show();
            // $('#curriculum_nav').show();

        }, function err () {

            hideLoaderImage();
            localStorage.removeItem('user');
            $('#signin_nav').show();
            $('#signup_nav').show();
            $('#profile_nav').hide();
            $('#signout_nav').hide();
            // $('#curriculum_nav').hide();
            if (window.location.href === (url + "/payment.html")) {
                console.log('Payment page error');
                window.location.href = '/';
            // }else if(window.location.href === (url + "/curriculum.html")) {
            //     window.location.href = '/sign_in.html';
            }


        });

    // }

});

function signout() {

    userControl.userLogout(function () {

        localStorage.removeItem('user');
        $('#signin_nav').show();
        $('#signup_nav').show();
        $('#profile_nav').hide();
        $('#signout_nav').hide();
        // $('#curriculum_nav').hide();
        window.location.href = '/';

    });

}
