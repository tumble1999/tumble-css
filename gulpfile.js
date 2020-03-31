const
gulp = require('gulp'),
uglify = require('gulp-uglify'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
pipeline = require('readable-stream').pipeline,
sourcemaps = require('gulp-sourcemaps');


sass.compiler = require('node-sass');


function js(cb) {
	return pipeline(
		gulp.src('js/*.js'),
		sourcemaps.init(),
		uglify(),
		concat('tumble.js'),
		sourcemaps.write(),
		gulp.dest('dist'),
		cb
	)
}

function css(cb) {
return pipeline(
	gulp.src('scss/**/*.scss'),
	sourcemaps.init(),
	sass({outputStyle: 'compressed'}).on('error', sass.logError),
	concat('tumble.min.css'),
	sourcemaps.write(),
	gulp.dest('dist'),
	cb
)
}

exports.build = gulp.series(css,js);