"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var pipeline = require("readable-stream").pipeline;
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var beautify = require('posthtml-beautify');
var del = require("del");
var imagemin = require('gulp-imagemin');
var imageminJpg = require('imagemin-jpeg-recompress');
var imageminPng = require('imagemin-pngquant');

gulp.task("css", function () {
  return gulp.src("src/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("compress", function () {
  return pipeline(
    gulp.src("src/js/*.js"),
    // uglify(),
    gulp.dest("build/js")
  );
});

gulp.task("sprite", function () {
  return gulp.src("src/img/{*-sprite,logo-footer}.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("src/html/*.html")
    .pipe(posthtml([
      include({
        root: 'src/html',
      }),
      beautify({
        rules: {
            indent: 2,
            blankLines: false
        },
      }),
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("image:build", () =>  {
  return gulp.src("src/img/**/*.*")
    .pipe(imagemin(
      [imageminPng(),
      imageminJpg({
        progressive: true,
        max: 85,
        min: 80
      })],
      {verbose: true}
    ))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "src/favicon/**",
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/video/**",
    "src/*.ico"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/"
  });

  gulp.watch("src/less/**/*.less", gulp.series("css"));
  gulp.watch("src/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("src/**/*.html", gulp.series("html", "refresh"));
  gulp.watch("src/js/**/*.js", gulp.series("compress", "refresh"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "html",
  "image:build",
  "compress"
));

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series("build", "server"));
