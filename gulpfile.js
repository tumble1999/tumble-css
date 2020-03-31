require("dotenv").config();
var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  pipeline = require("readable-stream").pipeline,
  sourcemaps = require("gulp-sourcemaps"),
  release = require("gulp-github-release"),
  fs = require("fs").promises,
  git = require('gulp-git'),
  bump = require('gulp-bump'),
  filter = require('gulp-filter'),
  tagVersion = require('gulp-tag-version');
var
versionFile='version.txt';

sass.compiler = require("node-sass");

async function GetVersion() {
	var vBuff = await fs.readFile(versionFile);
	var v = parseInt(vBuff.toString());
	version = 'v'+v;
	console.log("Releasing version",version)

	v++;
	await fs.writeFile(versionFile,v);
	return version;
}

function js(cb) {
  return pipeline(
    gulp.src("js/*.js"),
    sourcemaps.init(),
    uglify(),
    concat("tumble.min.js"),
    sourcemaps.write(),
    gulp.dest("dist"),
    cb
  );
}

function css(cb) {
  return pipeline(
    gulp.src("scss/main.scss"),
    sourcemaps.init(),
    sass({ outputStyle: "compressed" }).on("error", sass.logError),
    concat("tumble.min.css"),
    sourcemaps.write(),
    gulp.dest("dist"),
    cb
  );
}

async function release() {
  var v = await GetVersion();
  return pipeline(
	  gulp.src('dist/*'),
    release({
      owner: "tumble1999",
      repo: "tumble-css",
      manifest: require('./package.json')
	})
	);
};


function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('bumps package version'))

        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tagVersion());
}

// gulp.task('patch', function() { return inc('patch'); })
// gulp.task('feature', function() { return inc('minor'); })
// gulp.task('release', function() { return inc('major'); })


exports.build = gulp.series(css, js);
