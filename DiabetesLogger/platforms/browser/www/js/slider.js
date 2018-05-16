$(document).ready(function($) {

    $("#main-slider").owlCarousel({

        slideSpeed: 700,
        paginationSpeed: 700,
        rewindSpeed: 1500,
        singleItem: true,
        pagination: false,
        lazyLoad: true,
        autoPlay: 6000,
        stopOnHover: true,
        navigation: false,
        navigationText: [
            "<i class='owl-nav-left fa fa-angle-left'></i>",
            "<i class='owl-nav-right fa fa-angle-right'></i>"
        ]
    });

});
