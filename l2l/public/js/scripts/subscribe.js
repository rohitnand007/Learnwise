/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.when(
    $.getScript( "./js/controllers/product_control.js" ),
    $.getScript( "./js/controllers/cart_control.js" ),
    $.getScript( "./js/controllers/user_control.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){

    localStorage.setItem('previousUrl', window.location.href);

    $('#add_new_grade_div').hide();

    var gradesList = ["9", "10"],
        selectedGradesList = [],
        amountToPay = 0, gradeSelectCount = 1, tempGrade = 0,
        currentGrade, gradeSelectId, orderToken, orderId, isOrderCreated, isEmpty,
        completeGradeProduct = {};

    function displayLineItems(cartData, totalPrice) {

        $('#cart_items').empty();
        var cartHtml = "", allcount = 0, listOfGrades = Object.keys(cartData), grade, subjectItem;

        for (grade in listOfGrades) {

            var subjectItemsHtml = '<div class="row"><div class="col-md-6 grade-font"><span class="cursor-pointer" id="clear_grade' +
                listOfGrades[grade] + '">' + '<img class="close-button" src="images/Del.svg" alt=""/></span>Grade ' +
                listOfGrades[grade] + '</div><div class="col-md-6">';

            var subjects = cartData[listOfGrades[grade]];

            for (subjectItem in subjects) {
                subjectItemsHtml += '</div></div><div class="row cart-margin"><div class="col-md-6 sub-font"><span class="cursor-pointer"' +
                    'id="clearSubject_' + subjects[subjectItem].variantId + '_' + listOfGrades[grade] + '">' +
                    '<img class="close-button" src="images/Del.svg" alt=""/></span>' +
                    subjects[subjectItem].subject + '</div><div class="col-md-6"><span class="pull-right" ' +
                    'style="color: #fff;font-size: 1.25em;">$' + subjects[subjectItem].price;
            }

            cartHtml += subjectItemsHtml + '</span></div></div><hr class="horizontal">';
        }

        var totalValue = cartHtml + '<div class="row cart-margin"><div class="col-md-6 cart-total">Total</div>' +
            '<div class="col-md-6"><span class="pull-right" style="color: #fff;font-size: 1.6em">$' +
            (totalPrice - (allcount * 2)) + '</span></div></div>';

        amountToPay = (totalPrice - (allcount * 2));
        $('#cart_items').append(totalValue);
        $('#check_out').show();
        $('#empty').hide();

    }

    function displayCartSelectors(cartData, totalPrice) {
        var gradesInCartItems = Object.keys(cartData);
        console.log(JSON.stringify(gradesInCartItems));

        var i = 0;
        var displaySelectors = function () {

            var tempSelectedSubjects = [];
            var currentGradeCartItems = cartData[gradesInCartItems[i]];
            for(var j=0; j < currentGradeCartItems.length; j++){
                tempSelectedSubjects.push(currentGradeCartItems[j].variantId);
            }

            if(i === 0){
                addGradeSelect();
                addSubjectsSelect();
            } else {
                $("#add_grade").trigger( "click");
            }

            $('#grade_select' + gradeSelectCount).selectpicker('val', gradesInCartItems[i]);
            currentGrade = gradesInCartItems[i];
            gradeSelectId = i+1;

            productAPICall.getSubjectsByGrade(gradesInCartItems[i], function (data) {

                $('#subject_select' + tempGrade).prop('disabled', false);
                $('#subjects' + gradeSelectCount).empty();

                displaySubjects(data.products, gradesInCartItems[i]);

                if(data.products.length === tempSelectedSubjects.length){
                    tempSelectedSubjects.push("All"+gradesInCartItems[i]);
                    $("#subject_select" + gradesInCartItems[i]).data('allOptionIsSelected', true);
                }else{
                    $("#subject_select" + gradesInCartItems[i]).data('allOptionIsSelected', false);
                }

                $("#subject_select" + gradesInCartItems[i]).selectpicker('val', tempSelectedSubjects).selectpicker('refresh');

                $('#grade_select' + gradeSelectCount).prop('disabled', true);

                if (gradeSelectCount < gradesList.length) {
                    $('#add_new_grade_div').show();
                    addNewGrade();
                }

                i++;
                if(i < gradesInCartItems.length){
                    displaySelectors();
                }else{
                    displayLineItems(cartData, totalPrice);
                }
            });
        };

        displaySelectors();
    }

    function addSubjectSelectorListener(elementId) {

        $('#' + elementId).on('changed.bs.select',
            function (e, index, newVal, oldVal) {
                var num = elementId.match(/[0-9]+/g);
                selectSubjects(num, index, newVal, oldVal);
            });

    }

    function displaySubjects(subjects, selectedGrade) {

        var selectHtml = "", price = 0;

        $.each(subjects, function (i) {

            if(subjects[i].general_data.subject) {

                selectHtml += '<option value="' + subjects[i].variants_data[0].variant_id + '"'
                    + 'title="' + subjects[i].general_data.subject + '" data-content="<div class=row>'
                    + '<div class=col-lg-6 col-md-6><span class=pull-left>' + subjects[i].general_data.subject
                    + '</span></div><div class=col-lg-6 col-md-6><span class=pull-right>$ ' +
                    subjects[i].variants_data[0].cost_price + '</span></div></div>"></option>';

                price += subjects[i].variants_data[0].cost_price;

            } else {

                selectHtml = '<label class="label-style">Select subjects</label>' +
                    '<select class="selectpicker" multiple title="Select" id="subject_select' + selectedGrade +
                    '" multiple ' + 'data-selected-text-format="count>2">' +
                    '<option value="' + subjects[i].variants_data[0].variant_id + '"'
                    + 'title="All" data-content="<div class=row>'
                    + '<div class=col-lg-6 col-md-6><span class=pull-left>All'
                    + '</span></div><div class=col-lg-6 col-md-6><span class=pull-right>$ ' +
                    subjects[i].variants_data[0].cost_price + '</span></div></div>"></option>';

                completeGradeProduct[selectedGrade] = subjects[i].variants_data[0].variant_id;

            }

        });

        selectHtml = selectHtml + '</select>';
        $('#subjects' + gradeSelectCount).append(selectHtml);

        addSubjectSelectorListener("subject_select" + selectedGrade);

        $('.selectpicker').selectpicker();

    }

    function getSubjectsByGrade(selectedGrade) {

        $('#errorBox').html("");
        tempGrade = selectedGrade;

        productAPICall.getSubjectsByGrade(selectedGrade, function (data) {

            $('#subject_select' + tempGrade).prop('disabled', false);
            $('#subjects' + gradeSelectCount).empty();
            displaySubjects(data.products, selectedGrade);

        });

    }

    function addGradeSelectorListener(elementId) {

        $('#' + elementId).on('changed.bs.select',
            function () {
                gradeSelectId = elementId.match(/[0-9]+/g);
                currentGrade = $('#grade_select' + gradeSelectId).val();
                getSubjectsByGrade(currentGrade);
            });
    }

    function addGradeSelect() {

        if (gradeSelectCount === gradesList.length) {
            $('#add_new_grade_div').hide();
        }

        var gradeSelectHtml = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"><label class="label-style">Choose your grade</label>' +
            '<select class="selectpicker" title="Select" id="grade_select' + gradeSelectCount + '">';

        $.each(gradesList, function (i) {
            if(selectedGradesList.indexOf(gradesList[i]) < 0) {
                if(selectedGradesList.length === gradesList.length - 1) {
                    gradeSelectHtml += '<option value="' + gradesList[i] + '" selected disabled>' + gradesList[i] + '</option>';
                    getSubjectsByGrade(gradesList[i]);
                } else {
                    gradeSelectHtml += '<option value="' + gradesList[i] + '">' + gradesList[i] + '</option>';
                }
            }
        });

        gradeSelectHtml = gradeSelectHtml + '</select></div>';

        $('#selection_list').append(gradeSelectHtml);

        addGradeSelectorListener("grade_select" + gradeSelectCount);

    }

    function addSubjectsSelect() {

        var subjectsSelect = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" id="subjects' + gradeSelectCount + '">' +
            '<label class="label-style">Select subjects</label>' +
            '<select class="selectpicker" title="Select" ></select></div>';

        $('#selection_list').append(subjectsSelect);

        $('.selectpicker').selectpicker();

        $('#subjects' + gradeSelectCount).click(function () {

            var grade = $('#grade_select' + gradeSelectCount).val();

            if (grade === "") {
                $('#grade_select' + gradeSelectCount).focus();
                $('#errorBox').html("Please select a grade");
            }

        });
    }

    function addNewGrade() {

        $('#add_grade').click(function () {

            selectedGradesList.push(currentGrade);
            if (gradeSelectCount < gradesList.length) {
                gradeSelectCount++;
                $('#selection_list').append(addGradeSelect());
                $('selection_list').append(addSubjectsSelect());

            }

        });

    }

    function removeALineItem(orderId, variantId) {
        cartControl.removeLineItem(orderId, variantId, function () {

            getIncompleteOrder();

        });
    }

    function removeAllItems(orderId, variantId) {

        if(isEmpty) {
            addLineItem(orderId, variantId);
        } else {
            cartControl.removeAllLineItems(orderId, function () {
                addLineItem(orderId, variantId);
            });
        }
    }

    function addLineItem(orderId, variantId) {

        cartControl.addLineItemToCart(variantId, orderId, orderToken, function () {

            $('#grade_select' + gradeSelectId).prop('disabled', true);
            tempGrade = 0;
            getIncompleteOrder();

        });
    }

    function addOrRemoveLineItems(variantIds, index, newVal, oldVal, allOptionIsSelected) {

        if (newVal) {

            if(allOptionIsSelected) {
                removeAllItems(orderId, variantIds[index]);
            } else {
                addLineItem(orderId, variantIds[index]);
            }
        }

        if (oldVal) {
            if(allOptionIsSelected) {
                removeAllItems(orderId, variantIds[index]);
            } else {
                removeALineItem(orderId, variantIds[index]);
            }
        }
    }

    function createEmptyOrder(subjects, index) {

        var line_item = {
            variant_id: subjects[index]
        };

        cartControl.createEmptyOrderWithItem(line_item, function (data) {
            console.log("order created");
        }, function (error) {
            console.log("error while creating order");
        })

    }

    function checkForCreatedOrder(subjects, index, newVal, oldVal, allOptionIsSelected) {

        if(isOrderCreated) {
            addOrRemoveLineItems(subjects, index, newVal, oldVal, allOptionIsSelected)
        } else {
            createEmptyOrder(subjects, index, allOptionIsSelected);
        }

    }

    function toggleSelectAll(control, num, index, newVal, oldVal) {

        var subjectsListOfGrade;
        var entireGradeVariant = completeGradeProduct[num];
        var allOptionIsSelected = (control.val() || []).indexOf("" + entireGradeVariant) > -1;
        console.log(control.val() + " " + allOptionIsSelected);

        function valuesOf(elements) {
            return $.map(elements, function (element) {
                return element.value;
            });
        }

        subjectsListOfGrade = valuesOf(control.find('option'));

        if (control.data('allOptionIsSelected') !== allOptionIsSelected) {

            if (allOptionIsSelected) {
                // User clicked 'All' option
                console.log(valuesOf(control.find('option')));
                control.selectpicker('val', valuesOf(control.find('option')));
                console.log(subjectsListOfGrade + " " + index);
                checkForCreatedOrder(subjectsListOfGrade, index, newVal, oldVal, allOptionIsSelected);

            } else {

                if (!control.data('allOptionIsSelected')) {
                    control.selectpicker('val', control.val());
                    checkForCreatedOrder(subjectsListOfGrade, index, newVal, oldVal, allOptionIsSelected);
                } else {
                    control.selectpicker('val', []);
                    checkForCreatedOrder(subjectsListOfGrade, index, newVal, oldVal, allOptionIsSelected);
                }

            }

        } else {
            // User clicked other option
            if (allOptionIsSelected && control.val().length !== control.find('option').length) {
                // All options were selected, user deselected one option => unselect 'All' option
                control.selectpicker('val', valuesOf(control.find('option:selected[value!=' + entireGradeVariant + ']')));
                allOptionIsSelected = false;
                checkForCreatedOrder(subjectsListOfGrade, index, newVal, oldVal, allOptionIsSelected);

            } else if (!allOptionIsSelected && control.val().length === control.find('option').length - 1) {
                // Not all options were selected, user selected all options except 'All' option => select 'All' option too
                control.selectpicker('val', valuesOf(control.find('option')));
                allOptionIsSelected = true;
                checkForCreatedOrder(subjectsListOfGrade, 0, newVal, oldVal, allOptionIsSelected);

            } else {

                checkForCreatedOrder(subjectsListOfGrade, index, newVal, oldVal, allOptionIsSelected);

            }
        }

        control.data('allOptionIsSelected', allOptionIsSelected);

    }

    function selectSubjects(num, index, newVal, oldVal) {

        var grade = $('#grade_select' + gradeSelectId).val();

        if (grade === "") {
            $('#grade_select' + gradeSelectId).focus();
            $('#errorBox').html("Please select a grade");
        }

        if (grade !== "") {
            if (gradeSelectCount < gradesList.length) {
                $('#add_new_grade_div').show();
                addNewGrade();
            }
            toggleSelectAll($('#subject_select' + num), num, index, newVal, oldVal);
        }

    }

    function getIncompleteOrder(check) {

        cartControl.getIncompleteOrder(function (data) {
            if(data.incomplete_order_present) {
                var lineItems = data.order_info.line_items;
                orderToken = data.order_info.order_token;
                orderId = data.order_info.order_number;
                isOrderCreated = true;

                if(lineItems.length > 0) {

                    $('#empty').hide();
                    isEmpty = false;

                    var cartData = {}, totalPrice = 0;

                    for(var i in lineItems) {
                      var product = (lineItems[i].product_info.name).split(" ");
                      if(product[0] in cartData) {
                          var variant_info = {
                              "subject": product[1],
                              "variantId": lineItems[i].variant_id,
                              "price": lineItems[i].price
                          };
                          totalPrice += lineItems[i].price;
                          cartData[product[0]].push(variant_info);

                      } else {
                          cartData[product[0]] = [];
                          var variant_info = {
                              "subject": product[1],
                              "variantId": lineItems[i].variant_id,
                              "price": lineItems[i].price
                          };
                          totalPrice += lineItems[i].price;
                          cartData[product[0]].push(variant_info);
                      }
                    }

                    if(check === "init") {
                        displayCartSelectors(cartData, totalPrice);

                    } else {
                        displayLineItems(cartData, totalPrice);
                    }

                } else {

                    if(check === "init"){
                        addGradeSelect();
                        addSubjectsSelect();
                    }

                    isEmpty = true;
                    $('#cart_items').empty();
                    $('#empty').show();
                    $('#check_out').hide();
                    $('#add_new_grade_div').hide();

                    $('#subject_select' + currentGrade).val('').selectpicker('refresh');
                    $('#grade_select' + gradeSelectId).prop('disabled', false);
                    selectedGradesList = [];
                    if (gradeSelectCount > 1) {
                        gradeSelectCount = 1;
                        $('#selection_list').empty();
                        $('#selection_list').append(addGradeSelect());
                        $('#selection_list').append(addSubjectsSelect());
                    }
                }

            } else {

                isOrderCreated = false;
            }
        })

    }

    $('#check_out').click(function () {

        var url = window.location.protocol + '//' + window.location.hostname;

        if (window.location.port) {
            url = window.location.protocol + '//' + window.location.hostname + ':'
                + window.location.port;
        }

        localStorage.setItem('previousUrl', url + '/payment.html');
        localStorage.setItem("redirect", amountToPay);
        if (localStorage.getItem('user') !== null) {
            window.location.href = '../../payment.html';
        } else {
            window.location.href = '../../sign_in.html';
        }

    });

    $('#logo_icon').click(function () {

        userControl.getUserDetails(function (data) {

            if(data) {
                window.location.href = '/curriculum.html';
            }

        }, function error(err) {
            window.location.href = '/index.html'
        });

    });

    getIncompleteOrder("init");
});