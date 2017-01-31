var path = require('path');

var dirs = {
	tmp: './.tmp',
	src: './src',
	dist: './dist',
	data: './data'
};

var paths = {
	src: {
		img: dirs.src + '/img',
		js: dirs.src + '/js',
		sass: dirs.src + '/sass',
    templates: dirs.src + '/templates',
    assets: dirs.src + '/assets'
	},
	tmp: {
		css: dirs.tmp + '/css',
		img: dirs.tmp + '/img',
		js: dirs.tmp + '/js',
		fonts: dirs.tmp + '/fonts',
		assets: dirs.tmp + '/assets'
	},
	dist: {
		css: dirs.dist + '/css',
		img: dirs.dist + '/img',
		js: dirs.dist + '/js',
		fonts: dirs.dist + '/fonts',
		assets: dirs.dist + '/assets'
	}
};

var server = {
	port: '8080',
	root: path.resolve('./'),
};

module.exports = {
	dirs: dirs,
  paths: paths,
	server: server
};
