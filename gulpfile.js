require("dotenv").config();
var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  pipeline = require("readable-stream").pipeline,
  sourcemaps = require("gulp-sourcemaps"),
  release = require("gulp-github-release"),
  fs = require("fs").promises;
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

gulp.task("release", async function() {
  var v = await GetVersion();
  return pipeline(
	  gulp.src('dist/*'),
    release({
      owner: "tumble1999",
      repo: "tumble-css",
      tag: v
	})
	);
});


exports.build = gulp.series(css, js,gulp.task('release'));
