var cartControl = (function () {

    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
        url = window.location.protocol + '//' + window.location.hostname + ':'
            + window.location.port;
    }

    url = 'http://54.200.251.236/spree/api/v1';

    return {

        getIncompleteOrder : function (cb) {
            $.ajax(
                {
                    type: "GET",
                    url: url + '/orders/current.json',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        createEmptyOrderWithItem : function (data, cb) {
            $.ajax(
                {
                    type: "POST",
                    url: url + '/orders/',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    data: {order: data},
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        addLineItemToCart: function (lineItem, orderId, orderToken, cb) {
            var line_item = {};
            line_item['variant_id'] = lineItem;

            $.ajax(
                {
                    type: "POST",
                    url: url + '/orders/' + orderId + '/line_items',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    data: JSON.stringify(line_item),
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        removeAllLineItems : function (orderId, cb) {

            $.ajax(
                {
                    type: "PUT",
                    url: url + '/orders/' + orderId + '/empty',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        removeLineItem : function (orderId, lineItem, cb) {

            $.ajax(
                {
                    type: "DELETE",
                    url: url + '/orders/' + orderId + '/line_items/' + lineItem,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        //OLD URLS
        getSubjectsByGrade: function (selectedGrade, cb) {
            $.ajax(
                {
                    type: "GET",
                    url: 'http://54.200.251.236' + '/products.json?grade=' + selectedGrade,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        addItemToCart: function (productId, isAll, cb) {
            $.ajax(
                {
                    type: "POST",
                    url: 'http://54.200.251.236' + '/cart_items.json?product_id=' + productId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        addAllItemsToCart: function (grade, cb) {
            $.ajax(
                {
                    type: "GET",
                    url: 'http://54.200.251.236' + '/products.json?grade=' + grade,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        getCartItems: function (cb) {
            $.ajax(
                {
                    type: "GET",
                    url: 'http://54.200.251.236' + '/cart_items.json',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg);
                    }
                });
        },

        clearCartItem: function (cartId, grade, cb) {
            $.ajax(
                {
                    type: "DELETE",
                    url: 'http://54.200.251.236' + '/cart_items/' + cartId + '.json',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        clearCartByGrade: function (gradeToBeCleared, cb) {
            $.ajax(
                {
                    type: "DELETE",
                    url: 'http://54.200.251.236' + '/cart_items/remove_grade.json',
                    dataType: 'json',
                    headers: {
                        'token': 'fpix2018',
                        'Access-Control-Allow-Origin': '*'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    data: {grade: gradeToBeCleared},
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        },

        clearCart: function (cb) {
            $.ajax(
                {
                    type: "DELETE",
                    url: 'http://54.200.251.236' + '/cart_items/clear_cart.json',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'token': 'fpix2018'
                    },
                    xhrFields: {
                        'withCredentials': true
                    },
                    crossDomain: true,
                    success: cb,
                    error: function (msg) {
                        console.log(msg.responseText);
                    }
                });
        }
    };

}());