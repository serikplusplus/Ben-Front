// entry effects
$(window).on("scroll", function () {
    if ($(window).width() > 800) {
        $('.enter').each(function() {
        var visible = $(this).visible( true );
        if(visible == true) {
            $(this).addClass('entered');
        }
        });
    }
});

// side nav
$( document ).ready(function() {
    $.fn.controlSideNav = function(action) {
        if(action == 'open') {
            $('.side-nav').addClass('side-nav-open');
            $('.side-nav-content').fadeIn();
        }
        if(action == 'close') {
            $('.side-nav').removeClass('side-nav-open');
            $('.side-nav-content, .side-nav-sub').hide();
        }
    }

    $('.menu-open').click(function() {
        $.fn.controlSideNav('open');
    });
  
    $('.menu-close, .side-nav-links a').click(function() {
        $.fn.controlSideNav('close');
    });
});

//prevent form submission on enter
$(document).ready(function() {
    $('form input').keydown(function (e) {
        if (e.keyCode == 13) {
            var inputs = $(this).parents("form").eq(0).find(":input");
            if (inputs[inputs.index(this) + 1] != null) {                    
                inputs[inputs.index(this) + 1].focus();
            }
            e.preventDefault();
            return false;
        }
    });
});

//contact form submit
$(document).ready(function() {
    $(".contact-form").submit(function(e) {
        e.preventDefault();
    
        var $form = $(this);
        $.post($form.attr("action"), $form.serialize()).then(function() {
            $('.form-success').css('Opacity', '1');
            $('.contact-form')[0].reset();
        });
    });
});