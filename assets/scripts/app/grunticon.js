$(function() {

	var $body = $("body");
	var path = (typeof $body.data('path') === "string") ? $body.data('path') : '';

	grunticon([
		path + "images/icons/icons.data.svg.css",
		path + "images/icons/icons.data.png.css",
		path + "images/icons/icons.fallback.css"
	], grunticon.svgLoadedCallback);

});