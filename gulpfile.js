var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var appdmg = require('appdmg');
var NwBuilder = require('node-webkit-builder');
var projectDir = require('fs-jetpack');
var runSequence = require('run-sequence');
var childProcess = require('child_process');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var del = require('del');

var tmpDir = projectDir.dir('./tmp', { empty: true });
var cleanTmp = function () {
	tmpDir.remove('.');
};

gulp.task('clean', function(callback) {
	del([
		'tmp/**',
		// here we use a globbing pattern to match everything inside the `mobile` folder
		'releases/**',
		// we don't want to clean this file though so we negate the pattern
		'webkitbuilds/**'
	], callback);
});

gulp.task('nodewebkit', function(cb) {

	var nw = new NwBuilder({
		files: './src/**/**', // use the glob format
		version: '0.11.5',
		platforms: ['osx32', 'osx64', 'win32', 'linux32', 'linux64'],
		zip: false,
		winIco: './images/Icon.ico',
		macIcns: './images/MacIcon.icns',
		buildDir: './webkitbuilds' // Where the build version of my node-webkit app is saved
	});

	//Log stuff you want

	nw.on('log',  console.log);

// Build returns a promise
	nw.build().then(function () {
		var nw = new NwBuilder({
			files: './src/**/**', // use the glob format
			version: '0.11.5',
			platforms: ['win64'],
			zip: false,
			winIco: './images/Icon.ico',
			macIcns: './images/MacIcon.icns',
			buildDir: './webkitbuilds' // Where the build version of my node-webkit app is saved
		});
		nw.on('log',  console.log);
		nw.build().then(function () {
			cb(null);
			console.log('all done!');
		}).catch(function (error) {
			cb(error);
			console.error(error);
		});
	}).catch(function (error) {
		cb(error);
		console.error(error);
	});

	// place code for your default task here
});

function replaceVars(str, patterns) {
	Object.keys(patterns).forEach(function (pattern) {
		var matcher = new RegExp('{{' + pattern + '}}', 'g');
		str = str.replace(matcher, patterns[pattern]);
	});
	return str;
};

gulp.task('windowsinstaller', function(callback) {
	projectDir.copy('images/Icon.ico', 'webkitbuilds/polar-flow-synchronizer-ui/win32/icon.ico', { overwrite: true });
	projectDir.dir('./releases/windows');
	var manifest = projectDir.read('src/package.json', 'json');
	var filename = 'Polar Flow Synchronizer Installer.exe';
	var installScript = projectDir.read('./installer/installer.nsi');
	installScript = replaceVars(installScript, {
		"name": "Polar Flow Synchronizer",
		"prettyName": "Polar Flow Synchronizer",
		"version": manifest.version,
		// The paths expect the .nsi file is in "nw-boilerplate/tmp" folder.
		"src": "..\\webkitbuilds\\polar-flow-synchronizer-ui\\win32",
		"dest": "..\\releases\\windows\\" + filename,
		"icon": "..\\images\\icon.ico",
		"setupIcon": "..\\images\\icon.ico",
		"banner": "..\\images\\banner.bmp"
	});
	projectDir.write('./tmp/installer.nsi', installScript);

	gulpUtil.log('Building installer with NSIS...');

	// Note: NSIS have to be added to PATH!
	var nsis = childProcess.spawn('makensis', ['./tmp/installer.nsi']);
	nsis.stdout.pipe(process.stdout);
	nsis.stderr.pipe(process.stderr);
	nsis.on('close', function () {
		gulpUtil.log('Installer', filename, 'ready!');
		cleanTmp();
		callback();
	});
});

gulp.task('copyMacApp', function(cb){
	return gulp.src('webkitbuilds/polar-flow-synchronizer-ui/osx64/polar-flow-synchronizer-ui.app/**/*')
		.pipe(gulp.dest('webkitbuilds/polar-flow-synchronizer-ui/osx64/Polar Flow Synchronizer.app'));
});

gulp.task('linux32TarGZ', function() {
	projectDir.dir('./releases/linux32');
	return gulp.src('webkitbuilds/polar-flow-synchronizer-ui/linux32/**/*')
		.pipe(tar('PolarFlowSynchronizer.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('releases/linux32'));
});

gulp.task('linux64TarGZ', function() {
	projectDir.dir('./releases/linux64');
	return gulp.src('webkitbuilds/polar-flow-synchronizer-ui/linux64/**/*')
		.pipe(tar('PolarFlowSynchronizer.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('releases/linux64'));
});

gulp.task('macinstaller', function(callback) {
	projectDir.dir('./releases/osx');
	var ee = appdmg({ source: 'dmgDescription.json', target: 'releases/osx/Polar Flow Synchronizer.dmg' });
	ee.on('finish', function () {
		callback(null);
	});

	ee.on('error', function (err) {
		callback(err);
	});
});

gulp.task('release', function(callback) {
	runSequence('clean',
		'nodewebkit',
		'copyMacApp',
		'windowsinstaller', 'macinstaller', 'linux32TarGZ', 'linux64TarGZ',
		callback);
		/*,
		,
		);*/
});

