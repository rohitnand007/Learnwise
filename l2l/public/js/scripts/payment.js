/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/payment_control.js', function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    $('#amount_payable').text(localStorage.getItem("redirect"));

    var orderDetails;

    console.log("User Payment:" + localStorage.user);

    function getOrderDetails() {

        paymentControl.getOrderDetails(function (data) {

            orderDetails = data;

        });

    }

    function paymentCall(token) {

        var paymentData = {
            order: orderDetails,
            stripeToken: token.id,
            stripeTokenType: token.type
        };

        paymentControl.makePayment(paymentData, orderDetails, function () {
            // $('#preloader').hide();
            // alert("Payment successfull");
            localStorage.removeItem("redirect");
            window.location.href = '../../thank_you.html';

        }, function err(error) {
            $('#preloader').hide();
            $('#errorBox').html("Something is not right..! Please try again later...");
            setTimeout(function () {
                $("#make_payment_div").show();
                window.location.href = "/";
            }, 2000);

        });

    }

    function makePayment() {

        var stripe = Stripe('pk_test_Fz8kPphwH75yuTQrbJCVbVTw');
        var elements = stripe.elements();

        var css_style = {
            style: {
                base: {

                    fontSize: '20px',
                    '::placeholder': {
                        color: '#8a8c93'
                    }
                }
            }
        };

        var card = elements.create('cardNumber', css_style);
        var cvv = elements.create('cardCvc', css_style);
        var expDate = elements.create('cardExpiry', css_style);

        card.mount('#card-element');
        cvv.mount('#card-cvv');
        expDate.mount('#card-expdate');

        $('#preloader').fadeOut(1000, function () {
            $('#preloader').hide();
        });

        function setOutcome(result) {

            if (result.token) {
                console.log(result.token);
                paymentCall(result.token);
            } else if (result.error) {
                $('#preloader').hide();
                $('#make_payment_div').show();
                $('#errorBox').html(result.error.message);
            }

        }

        $('#make_payment_div').click(function () {
            $('#preloader').show();
            $('#make_payment_div').hide();
            var cardHolderName = $('#card-name').val();
            var extraDetails = {};
            if (cardHolderName) {
                extraDetails = {
                    name: cardHolderName
                };
                stripe.createToken(card, extraDetails).then(setOutcome);
            } else {
                stripe.createToken(card).then(setOutcome);
            }

        });

        card.on('change', function (event) {
            setOutcome(event);
        });

    }

    function isUserLogin() {

        userControl.getUserDetails(function (data) {

            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.username.length > 12) {
                var tempUsername = data.user.username.slice(0, 10) + '..';
                data.user.username = tempUsername;
            }

            $('#signin_nav').hide();
            $('#signup_nav').hide();
            $('#profile_nav').show();
            $('#profile_nav').text(data.user.username).append(
                '<span class="glyphicon glyphicon-user p-left4"></span>'
            );
            $('#signout_nav').show();

            getOrderDetails();
            makePayment();

        }, function err(error) {

            console.log(error);
            $('#signin_nav').show();
            $('#signup_nav').show();
            $('#profile_nav').hide();
            $('#signout_nav').hide();
            window.location.href = '/';

        });

    }


    $('#logo_icon').click(function () {

        userControl.getUserDetails(function (data) {

            if(data) {
                window.location.href = '/curriculum.html';
            }

        }, function error(err) {
            window.location.href = '/index.html'
        });

    });

    isUserLogin();
});

function signout() {

    userControl.userLogout(function () {

        localStorage.removeItem('user');
        $('#signin_nav').show();
        $('#signup_nav').show();
        $('#profile_nav').hide();
        $('#signout_nav').hide();
        window.location.href = '/';

    });

}