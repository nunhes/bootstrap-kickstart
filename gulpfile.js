var gulp = require('gulp');
var notify = require("gulp-notify");
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var duration = require('gulp-duration');
var del = require('del');


// Configurable paths
var	config = {
	src: './src-for-gulp/',
	dist: 'dist',
	reports: 'reports',
	docs: 'docs',
	server: 'server'
};

gulp.task('cleanServer', function() {
	return del(['./' + config.server + '/**/*']);
});

gulp.task('copyAssetsToServer', function() {
	return gulp.src([
					config.src + 'assets/css/**/*',
					config.src + 'assets/js/**/*',
					config.src + 'assets/fonts/**/*',
					config.src + 'assets/img/**/*'
				], {
			base: config.src
		})
		.pipe(gulp.dest('./' + config.server));
});

gulp.task('copyLibsToServer', function() {
	return gulp.src([
					'./libs/**/*.js',
					'./libs/**/*.css',
					'./libs/bootstrap/fonts/*'
				], {
			base: './'
		})
		.pipe(gulp.dest('./' + config.server));
});

gulp.task('styles', function() {
	return gulp.src(config.src + 'assets/less/index.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', notify.onError({
			message: '\nError: <%= error.message %>'
		}))
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
	gulp.series('cleanServer', gulp.parallel('scripts', 'styles', 'copyLibsToServer'), 'copyAssetsToServer'), function() {
		console.log('done with dev');
	}
);
