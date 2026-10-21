$(document).ready(function(){

	// mixItUp is not bundled; only run when the plugin and target exist
	if ($.fn.mixItUp) {
		$("#portfolio-contant-active").mixItUp();
	}

	$("#testimonial-slider").owlCarousel({
	    paginationSpeed : 500,
	    singleItem:true,
	    autoPlay: 3000,
	});

	$("#clients-logo, #works-logo").owlCarousel({
		autoPlay: 3000,
		items : 5,
		itemsDesktop : [1199,5],
		itemsDesktopSmall : [979,5],
	});

	// Counter
	$('.counter').counterUp({
        delay: 10,
        time: 1000
    });

});
