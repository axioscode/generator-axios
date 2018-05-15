var dirs = {
  root: './',
  tmp: '.tmp',
  src: 'src',
  dist: 'dist'
};

var paths = {
  projectConfig: dirs.root + 'project.config.json',
  src: {
    img: dirs.src + '/img',
    fallbacks: dirs.src + '/fallbacks',
    js: dirs.src + '/js',
    sass: dirs.src + '/sass',
    templates: dirs.src + '/templates',
    assets: dirs.src + '/assets',
    data: dirs.src + '/data'
  },
  tmp: {
    css: dirs.tmp + '/css',
    img: dirs.tmp + '/img',
    fallbacks: dirs.tmp + '/fallbacks',
    js: dirs.tmp + '/js',
    fonts: dirs.tmp + '/fonts',
    assets: dirs.tmp + '/assets',
    data: dirs.tmp + '/data'
  },
  dist: {
    css: dirs.dist + '/css',
    img: dirs.dist + '/img',
    fallbacks: dirs.dist + '/fallbacks',
    js: dirs.dist + '/js',
    fonts: dirs.dist + '/fonts',
    assets: dirs.dist + '/assets',
    data: dirs.dist + '/data'
  }
};

module.exports = {
  dirs: dirs,
  paths: paths,
};
