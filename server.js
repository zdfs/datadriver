var express = require('express'),
		app = express(),
		compress = require('compression'),
		port = process.env.PORT || 3000,
		dirToJson = require('dir-to-json');

// New call to compress content
app.use(compress());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.locals.basedir = app.get('views');
app.locals.pretty = true;
app.locals.path = '';

dirToJson('views')
	.then(function(tree) {
		getFilePaths(tree.children);
	})
	.catch(function(err) {
		throw err;
	});

function getFilePaths(tree) {

	var routes = [];

	tree.forEach(function(route) {

		if (route.type === 'file') {
			if (route.parent !== 'common') {
				routes.push(route);
			}
		} else {
			getFilePaths(route.children);
		}

	});

	mapRoutes(routes);

}

function mapRoutes(routes) {

	routes.forEach(function(route) {

		var viewDir = route.parent,
				viewFile = route.name.split('.')[0],
				htmlPath, jadePath;

		if (route && viewDir !== '') {
			htmlPath = '/' + viewDir + '/' + viewFile + '.html';
			jadePath = viewDir + '/' + route.name;
		} else {
			htmlPath = '/' + viewFile + '.html';
			jadePath = route.name;
		}

		app.get(htmlPath, function (req, res) {
			res.render(jadePath);
		});

	});

}

app.get('/', function (req, res) {
	res.render('index');
});

app.listen(port);