var gulp = require('gulp');
var notify = require("gulp-notify");
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var duration = require('gulp-duration');
var del = require('del');


// Configurable paths
var	config = {
	dist: 'dist',
	reports: 'reports',
	docs: 'docs',
	server: 'server'
};

gulp.task('cleanServer', function() {
	return del(['./server/**/*']);
});

gulp.task('copyToServer', function() {
	return gulp.src([
					'./assets/css/**/*',
					'./assets/js/**/*',
					'./assets/fonts/**/*',
					'./assets/img/**/*',
					'./libs/**/*.js',
					'./libs/**/*.css',
					'./libs/bootstrap/fonts/*'
				], {
			base: './'
		})
		.pipe(gulp.dest('./' + config.server));
});

gulp.task('styles', function() {
	var lessTimer = duration('less compiling')
  var prefixerTimer = duration('auto prefixing')
	return gulp.src('./assets/less/index.less')
		.pipe(sourcemaps.init())
		.once('data', lessTimer.start)
		.pipe(less())
		.on('error', notify.onError({
				message: 'Error: <%= error.message %>'
			}))
		.on('error', function(err) {
				console.log('Error:', err);
			})
		.pipe(lessTimer)
		.once('data', prefixerTimer.start)
		.pipe(autoprefixer({
			browsers: [
					'> 1%',
					'last 3 version',
					'ie 8',
					'ie 9',
					'Firefox ESR',
					'Opera 12.1'
				]
		}))
		.pipe(prefixerTimer)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('scripts', function(done) {
	console.log('Nothing happening yet.');
	done();
});

/**
 * A task for development
 */
gulp.task('dev',
	gulp.series('cleanServer', gulp.parallel('scripts', 'styles'), 'copyToServer'), function() {
		console.log('done with dev');
	}
);
