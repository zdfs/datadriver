$(document).ready(function() {

	var $menuToggle = $('#js-centered-navigation-mobile-menu').unbind();
	var $navigationMenu = $('#js-centered-navigation-menu');

	$navigationMenu.removeClass("show");

	$menuToggle.on('click', function(e) {

		e.preventDefault();

		$navigationMenu.slideToggle(function() {

			if ($navigationMenu.is(':hidden')) {
				$navigationMenu.removeAttr('style');
			}

		});

	});

});