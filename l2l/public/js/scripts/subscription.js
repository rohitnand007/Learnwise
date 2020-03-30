/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";

$.getScript('./js/controllers/cart_control.js', function () {

    localStorage.setItem('previousUrl', window.location.href);

    $('#add_new_grade_div').hide();

    var gradesList = ["9", "10"],
        cartSubjects = [], selectedGradesList = [],
        amountToPay = 0, gradeSelectCount = 1, tempGrade = 0,
        currentGrade, gradeSelectId,
        gradeSubjects = {}, gradeWiseSubjectList = {}, cartSubjectIds = {};


    function clearCartByGrade(gradeToBeCleared) {

        cartControl.clearCartByGrade(gradeToBeCleared, function () {

            $('#subject_select' + gradeToBeCleared).val('').selectpicker('refresh');
            getCartItems();

        });

    }

    function clearCartByGradeOrSubject() {

        $('span').click(function () {
            var span = this.id;

            if (span.includes('clearSubject')) {

                var clearSubjectId = span.split("_");
                clearCartItem(clearSubjectId[1], clearSubjectId[2]);

            } else if (span.includes('clear_grade') || span.includes('clear_all')) {

                var gradeToBeCleared = span.match(/[0-9]+/g);
                clearCartByGrade(gradeToBeCleared[0]);

            }
        });

    }

    function displayCartItems(gradeItems, totalPrice) {

        $('#cart_items').empty();
        var cartHtml = "", allcount = 0, listOfGrades = Object.keys(gradeItems), grade, subjectItem;

        for (grade in listOfGrades) {

            var subjectItemsHtml = '<div class="row"><div class="col-md-6 grade-font"><span class="cursor-pointer" id="clear_grade' +
                  listOfGrades[grade] + '">' + '<img class="close-button" src="images/Del.svg" alt=""/></span>Grade ' +
                  listOfGrades[grade] + '</div><div class="col-md-6">';

            var subjects = gradeItems[listOfGrades[grade]];

            if (subjects.length === gradeSubjects[listOfGrades[grade]][0]) {

                var subjects_totalPrice = gradeSubjects[listOfGrades[grade]][1] - 2;

                subjectItemsHtml += '</div></div><div class="row cart-margin"><div class="col-md-6 sub-font"><span class="cursor-pointer"' +
                      'id="clear_all' + listOfGrades[grade] + '"><img class="close-button" src="images/Del.svg" alt=""/></span>' +
                      'All Subjects</div><div class="col-md-6"><span class="pull-right" ' +
                      'style="color: #fff;font-size: 1.25em;">$' + subjects_totalPrice;
                allcount++;

            } else {

                for (subjectItem in subjects) {
                    subjectItemsHtml += '</div></div><div class="row cart-margin"><div class="col-md-6 sub-font"><span class="cursor-pointer"' +
                          'id="clearSubject_' + subjects[subjectItem].id + '_' + listOfGrades[grade] + '">' +
                          '<img class="close-button" src="images/Del.svg" alt=""/></span>' +
                          subjects[subjectItem].product_name + '</div><div class="col-md-6"><span class="pull-right" ' +
                          'style="color: #fff;font-size: 1.25em;">$' + subjects[subjectItem].price;
                }
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

    function displayCartSelectors(subjectsInCart, totalPrice) {
        var cartItems = subjectsInCart;
        var gradesInCartItems = Object.keys(cartItems);
        // console.log(JSON.stringify(gradesInCartItems));

        var i = 0;
        var displaySelectDropdownsAndCartList = function () {

            var tempSelectedSubjects = [];
            var currentGradeCartItems = cartItems[gradesInCartItems[i]];
            for(var j=0; j < currentGradeCartItems.length; j++){
                tempSelectedSubjects.push(currentGradeCartItems[j].product_id);
            }

            console.log(JSON.stringify(tempSelectedSubjects));

            if(i === 0){
                addGradeSelect();
                addSubjectsSelect();
            } else {
                $("#add_grade").trigger( "click");
            }

            $('#grade_select' + gradeSelectCount).selectpicker('val', gradesInCartItems[i]);
            // getSubjectsByGrade(gradesInCartItems[0]);
            currentGrade = gradesInCartItems[i];
            gradeSelectId = i+1;

            cartControl.getSubjectsByGrade(gradesInCartItems[i], function (data) {

                $('#subject_select' + tempGrade).prop('disabled', false);
                $('#subjects' + gradeSelectCount).empty();

                gradeSubjects[gradesInCartItems[i]] = [];
                gradeSubjects[gradesInCartItems[i]].push(data.products.length);
                gradeWiseSubjectList[gradesInCartItems[i]] = [];
                gradeWiseSubjectList[gradesInCartItems[i]] = data.products;
                displaySubjects(data.products, gradesInCartItems[i]);
                // console.log(data.products.length == tempSelectedSubjects.length);

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
                    displaySelectDropdownsAndCartList();
                }else{
                    displayCartItems(subjectsInCart, totalPrice);
                    clearCartByGradeOrSubject();
                }
            });
        };

        displaySelectDropdownsAndCartList();
    }

    function getCartItems(check) {

        cartControl.getCartItems(function (data) {

            $('#empty').hide();

            if (!($.isEmptyObject(data.items))) {
                // var gradeItems = {};
                /*$.each(data.items, function (i) {
                    cartSubjectIds[data.items[i].id] = data.items[i].product_id;
                    if (data.items[i].grade in gradeItems) {
                        gradeItems[data.items[i].grade].push(data.items[i]);
                    } else {
                        gradeItems[data.items[i].grade] = [];
                        gradeItems[data.items[i].grade].push(data.items[i]);
                    }
                });*/

                cartSubjects = data.items;

                for(var key in data.items){
                    $.each(data.items[key], function (i) {
                        cartSubjectIds[data.items[key][i].id] = data.items[key][i].product_id;
                    });
                }

                if(check === "initLoading"){
                    displayCartSelectors(data.items, data.total_price);
                }else{
                    displayCartItems(data.items, data.total_price);
                    clearCartByGradeOrSubject();
                }

            } else {

                if(check === "initLoading"){
                    addGradeSelect();
                    addSubjectsSelect();
                }


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
                cartSubjects = [];
            }

        });

    }

    function clearCartItem(cartId, grade) {

        cartControl.clearCartItem(cartId, grade, function () {

            var selectedValues = $('#subject_select' + grade).val();
            if (selectedValues.length > 0) {
                var index = selectedValues.indexOf(cartSubjectIds[cartId]);
                if (index > -1) {
                    selectedValues.splice(index, 1);
                }
                $('#subject_select' + grade).selectpicker('val', selectedValues);
            }
            getCartItems();

        });

    }


    function addSubjectSelectorListener(elementId) {

        $('#' + elementId).on('changed.bs.select',
            function (e, index, newVal, oldVal) {
                var num = elementId.match(/[0-9]+/g);
                selectSubjects(num, index, newVal, oldVal);
            });

    }

    function displaySubjects(subjects, selectedGrade) {

        var price = 0,
            selectHtml = '<label class="label-style">Select subjects</label>' +
              '<select class="selectpicker" multiple title="Select" id="subject_select' + selectedGrade +
              '" multiple ' + 'data-selected-text-format="count>2">' +
              '<option value="All' + selectedGrade + '"> All </option>';

        $.each(subjects, function (i) {

            selectHtml += '<option value="' + subjects[i].id + '" title="' + subjects[i].name + '"' +
                  'data-content="<div class=row><div class=col-lg-6 col-md-6><span class=pull-left>' +
                  subjects[i].name + '</span></div><div class=col-lg-6 col-md-6><span class=pull-right>$ ' +
                  subjects[i].default_price + '</span></div></div>"></option>';

            price += subjects[i].default_price;

        });

        selectHtml = selectHtml + '</select>';
        $('#subjects' + gradeSelectCount).append(selectHtml);

        addSubjectSelectorListener("subject_select" + selectedGrade);

        $('.selectpicker').selectpicker();

        gradeSubjects[selectedGrade].push(price);

    }

    function getSubjectsByGrade(selectedGrade) {

        $('#errorBox').html("");
        tempGrade = selectedGrade;

        cartControl.getSubjectsByGrade(selectedGrade, function (data) {

            $('#subject_select' + tempGrade).prop('disabled', false);
            $('#subjects' + gradeSelectCount).empty();

            gradeSubjects[selectedGrade] = [];
            gradeSubjects[selectedGrade].push(data.products.length);
            gradeWiseSubjectList[selectedGrade] = [];
            gradeWiseSubjectList[selectedGrade] = data.products;
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

    function addItemToCart(productId, isAll) {

        cartControl.addItemToCart(productId, isAll, function () {

            $('#grade_select' + gradeSelectId).prop('disabled', true);
            tempGrade = 0;
            if (!isAll) {
                getCartItems();
            }

        });

    }

    function addOrRemoveSubjects(subjects, index, newVal, oldVal) {

        if (newVal) {
            if (subjects[index].indexOf('All') < 0) {
                addItemToCart(subjects[index], false);
            }
        }

        if (oldVal) {
            var i;

            if (!($.isEmptyObject(cartSubjects))) {
                for (var key in cartSubjects) {
                    var positionIndex = cartSubjects[key].map(function (e) {
                        return e.product_id;
                    }).indexOf(subjects[index]);

                    if (positionIndex > -1) {
                        clearCartItem(cartSubjects[key][positionIndex].id, key);
                    }
                }
            }

            /*if (cartSubjects.length > 0) {
                for (i = 0; i < cartSubjects.length; i++) {
                    if (cartSubjects[i].product_id === subjects[index]) {
                        clearCartItem(cartSubjects[i].id, cartSubjects[i].grade);
                    }
                }
            }*/
        }

    }

    function addAllItemsToCart(grade) {

        cartControl.addAllItemsToCart(grade, function (data) {

            var j , subjects = data.products;
            if (subjects.length > 0) {
                for (j in subjects) {
                    if (j < subjects.length - 1) {
                        addItemToCart(subjects[j].id, true);
                    } else {
                        addItemToCart(subjects[j].id, false);
                    }
                }
            }

        });

    }

    function checkForSubjectSubscription(grade, subjectId){

        var subjectList = gradeWiseSubjectList[grade];
        var positionIndex = subjectList.map(function (e) {
            return e.id;
        }).indexOf(subjectId);

        if (positionIndex > -1) {
            return subjectList[positionIndex].accessible;
        }
    }

    function toggleSelectAll(control, num, index, newVal, oldVal) {

        var subjectsListOfGrade;
        var allOptionIsSelected = (control.val() || []).indexOf("All" + num) > -1;

        var checkSubscription = false;

        function valuesOf(elements) {
            return $.map(elements, function (element) {
                return element.value;
            });
        }

        subjectsListOfGrade = valuesOf(control.find('option'));

        function undoSubjectSelection(subjectId) {
            var selectedOptions = control.val();

            var optionIndex = selectedOptions.indexOf(subjectId);
            if(optionIndex > -1){
                selectedOptions.splice(optionIndex,1);
            }

            if(selectedOptions.length === 0){
                if (gradeSelectCount < gradesList.length) {
                    $('#add_new_grade_div').hide();
                }
            }
            control.selectpicker('val', selectedOptions);
        }

        if(newVal){
            var tempCheck;
            if(allOptionIsSelected){
                for(var i=0; i < subjectsListOfGrade.length; i++){
                    tempCheck = checkForSubjectSubscription(num, subjectsListOfGrade[i]);
                    if(tempCheck){
                        checkSubscription = true;
                        undoSubjectSelection("All"+num);
                        alert("You have already subscribed subjects in the list");
                        break;
                    }
                }
            }else{
                tempCheck = checkForSubjectSubscription(num, subjectsListOfGrade[index]);
                if(tempCheck){
                    checkSubscription = true;
                    undoSubjectSelection(subjectsListOfGrade[index]);
                    alert("You already subscribed this subject");
                }
            }
        }

        if(!checkSubscription) {
            if (control.data('allOptionIsSelected') !== allOptionIsSelected) {

                if (allOptionIsSelected) {
                    // User clicked 'All' option
                    control.selectpicker('val', valuesOf(control.find('option')));
                    addAllItemsToCart(num);

                } else {

                    if (!control.data('allOptionIsSelected')) {
                        control.selectpicker('val', control.val());
                        addOrRemoveSubjects(subjectsListOfGrade, index, newVal, oldVal);
                    } else {
                        control.selectpicker('val', []);
                        clearCartByGrade(num[0]);
                    }

                }

            } else {
                // User clicked other option
                if (allOptionIsSelected && control.val().length !== control.find('option').length) {
                    // All options were selected, user deselected one option => unselect 'All' option
                    control.selectpicker('val', valuesOf(control.find('option:selected[value!=All' + num + ']')));
                    allOptionIsSelected = false;
                    addOrRemoveSubjects(subjectsListOfGrade, index, newVal, oldVal);

                } else if (!allOptionIsSelected && control.val().length === control.find('option').length - 1) {
                    // Not all options were selected, user selected all options except 'All' option => select 'All' option too
                    control.selectpicker('val', valuesOf(control.find('option')));
                    allOptionIsSelected = true;
                    addAllItemsToCart(num);

                } else {

                    addOrRemoveSubjects(subjectsListOfGrade, index, newVal, oldVal);

                }
            }

            control.data('allOptionIsSelected', allOptionIsSelected);
        }
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


    function clearCart() {

        cartControl.clearCart(function () {

            $('#cart_items').empty();
            $('#empty').show();
            $('#check_out').hide();
            $('#add_new_grade_div').hide();

            cartSubjects = [];

            $('#subject_select' + gradeSelectCount).val('').selectpicker('refresh');

            if (gradeSelectCount === 2) {
                $('#selection_list').empty();
                $('#selection_list').append(addGradeSelect());
                $('#selection_list').append(addSubjectsSelect());
                gradeSelectCount = 1;
            }

        });

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

    // clearCart();

    getCartItems("initLoading");

    // addGradeSelect();

    // addSubjectsSelect();

});