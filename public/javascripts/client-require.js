requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		pixi: '/javascripts/lib/pixi',
		jquery: '/javascripts/lib/jquery'
	}
});

requirejs([ 'Main' ], function(Main) {
	Main();
});