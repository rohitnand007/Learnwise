var langs = ['en', 'sp'];
var langCode = '';
var langJS = null;

var translate = function (jsdata) {
    $("[tkey]").each(function (index) {
        var strTr = jsdata [$(this).attr('tkey')];
        $(this).html(strTr);
    });
}

$(document).ready(function () {
    $('.lang').click(function () {
        var lang = $(this).attr('id');
// translate all translatable elements

        $.getJSON('multilanguage/' + lang + '.json', translate);
    });

});
