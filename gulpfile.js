var gulp       = require('gulp');
var concat     = require('gulp-concat');
var cssnano  = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

var cssFiles = [
  'node_modules/normalize.css/normalize.css',
  'src/css/main.css'
];


/*
 * Default
*/
gulp.task('css', function() {
  gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public'))
    .pipe(livereload());
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/css/main.css', ['css']);
});
gulp.task('default', ['css', 'watch']);

/*
 * Prod
*/
// No sourcemaps, watch or livereload
gulp.task('css-prod', function() {
  gulp.src(cssFiles)
    .pipe(cssnano())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('public'));
});
gulp.task('prod', ['css-prod']);
