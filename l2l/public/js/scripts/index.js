/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/user_control.js', function () {

    var emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;
    //document.getElementById("user_name").focus();
    localStorage.setItem('previousUrl', window.location.href);

    function checkEmailPattern(text) {
        if (!emailRegex.test(text)) {
            $('#errorBox').html("Please enter valid email");
            return false;
        } else {
            return true;
        }
    }

    $("#register").click(function () {

        var email = $('#user_email').val();
        var password = $('#user_pwd').val();
        var name = $('#user_name').val();

        if (name === "") {

            $('#name').focus();
            $('#errorBox').html("Please enter your name");

        } else if (email === "") {

            $('#email').focus();
            $('#errorBox').html("Please enter your email");

        } else if (password === "") {

            $('#password').focus();
            $('#errorBox').html("Please enter your password");

        }

        if (email !== "") {

            if (checkEmailPattern(email) && password !== "" && name !== "") {
                $('#errorBox').html("");
                var user = {
                    email: email,
                    username: name,
                    password: password
                };

                userControl.userSignUp(user, function (data) {

                    console.log(data);

                }, function err (error) {

                    var errorMsg = JSON.parse(error.responseText);
                    var errorKeys = Object.keys(errorMsg.errors);
                    var i;
                    if(errorKeys.length > 0) {
                        for (i in errorKeys) {
                            var errorText = errorKeys[i] + " " + errorMsg.errors[errorKeys[i]];
                            $('#errorBox').append(errorText);
                            $('#errorBox').append('<br>');
                        }

                    }
                });

            }
        }

    });

});

function removeSavedDemoContent() {
    localStorage.removeItem("demoContentAttempts");
}