var paymentControl = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236';

    return {

        getOrderDetails: function (cb) {
            $.ajax({
                    type: "GET",
                    url: url + '/orders/payment.json',
                    crossDomain: true,
                    headers: {
                        'token': 'fpix2018',
                        'Access-Control-Allow-Origin': '*'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    dataType: "json",
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        makePayment: function (paymentData, orderDetails, cb, err) {
            $.ajax({
                    type: "POST",
                    url: url + '/orders/' + orderDetails.id + '/charge.json',
                    crossDomain: true,
                    headers: {
                        'token': 'fpix2018',
                        'Access-Control-Allow-Origin': '*'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    dataType: "json",
                    data: paymentData,
                    success: cb,
                    error: err
                });
        }

    };

}());