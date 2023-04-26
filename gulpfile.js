const gulp = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

const SRC = {
  SCSS: "./assets/scss/*.scss",
};

function styles() {
  return gulp
    .src(SRC.SCSS)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./assets/css"));
}

function watch() {
  gulp.watch(SRC.SCSS, styles).on("change", reload);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  watch();
}

const build = gulp.series(gulp.parallel(styles));

exports.styles = styles;
exports.watch = watch;
exports.build = build;
exports.serve = serve;
exports.default = build;
