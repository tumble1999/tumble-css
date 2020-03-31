require("dotenv").config();
var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  pipeline = require("readable-stream").pipeline,
  sourcemaps = require("gulp-sourcemaps"),
  release = require("gulp-github-release"),
  fs = require("fs"),
  verFile = "version.txt",
  ver = 0;

sass.compiler = require("node-sass");

fs.readFile(verFile, function(err, buf) {
  if (err) console.log(err);
  ver = parseInt(buf.toString());
});

function GetVersion() {
  var v = ver++;
  fs.writeFile(verFile, v, err => {
    if (err) console.log(err);
  });
  return v;
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
    gulp.src("scss/**/*.scss"),
    sourcemaps.init(),
    sass({ outputStyle: "compressed" }).on("error", sass.logError),
    concat("tumble.min.css"),
    sourcemaps.write(),
    gulp.dest("dist"),
    cb
  );
}

exports.build = gulp.series(css, js);
