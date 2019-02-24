var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var $ = require('gulp-load-plugins')();

var path = {
	SCSS_SRC	: 'src/scss/**/*.scss',
	SCSS_DST	: 'assets/css',
}

gulp.task('sass', function () {
	return gulp
		.src(path.SCSS_SRC)
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		.pipe($.size({ showFiles: false }))
		.pipe($.autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe($.size({ showFiles: false }))
		.pipe($.csso())
		.pipe($.size({ showFiles: true }))
		.pipe($.sourcemaps.write('map'))
		.pipe(gulp.dest( path.SCSS_DST ))
		.pipe(browserSync.stream({ match: '**/*.css' }))
	;
});

// Static Server + watching files
gulp.task('serve', function() {

	// Start a server with the root from the current project directory
	browserSync.init({
		watch: true,
		server: './'
	});

	// If there is change in any scss file, regenerate the styles and stream the new code
	gulp.watch( path.SCSS_SRC, gulp.series("sass"));

	// If there is a change in any html or js files reload the browser
	gulp.watch("**/*.html").on('change', browserSync.reload);
	gulp.watch("**/*.js").on('change', browserSync.reload);
});

// Creating a default task
gulp.task("default", gulp.series("serve"));
