var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var NwBuilder = require('node-webkit-builder');
var projectDir = require('fs-jetpack');
var childProcess = require('child_process');

var tmpDir = projectDir.dir('./tmp', { empty: true });
var cleanTmp = function () {
	tmpDir.remove('.');
};

gulp.task('nodewebkit', function() {

	var nw = new NwBuilder({
		files: './src/**/**', // use the glob format
		version: '0.11.5',
		platforms: ['osx32', 'osx64', 'win32', 'win64'],
		winZip: false,
		winIco: './images/Icon.ico',
		buildDir: './webkitbuilds' // Where the build version of my node-webkit app is saved
	});

	//Log stuff you want

	nw.on('log',  console.log);

// Build returns a promise
	nw.build().then(function () {
		console.log('all done!');
	}).catch(function (error) {
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
	projectDir.dir('./releases');
	var manifest = projectDir.read('src/package.json', 'json');
	var filename = 'Polar Flow Synchronizer Installer.exe';
	var installScript = projectDir.read('./installer/installer.nsi');
	installScript = replaceVars(installScript, {
		"name": "Polar Flow Synchronizer",
		"prettyName": "Polar Flow Synchronizer",
		"version": manifest.version,
		// The paths expect the .nsi file is in "nw-boilerplate/tmp" folder.
		"src": "..\\webkitbuilds\\polar-flow-synchronizer-ui\\win32",
		"dest": "..\\releases\\" + filename,
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