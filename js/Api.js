var gui = window.require('nw.gui');
var PolarSynchronizer = require('polar-flow-synchronizer/lib/PolarSynchronizer.js');
var PolarApi = require('polar-flow-synchronizer/lib/PolarApi.js');
var UserSettings = require('./SettingsStore.js');
var MemoryCookieStore = require('tough-cookie/lib/memstore').MemoryCookieStore;
var settingsWindow;
var splashScreenwindow;
var syncScreenwindow;
var mainScreen;

module.exports = {

	showMainScreen: function() {
		if(!mainScreen) {
			mainScreen = gui.Window.open('component.html#MainScreen', {
				title: 'Polar Flow Synchronizer UI',
				position: 'center',
				toolbar: false,
				width: 600,
				height: 800,
				focus: true
			});
			mainScreen.on('close', function() {
				this.hide(); // Pretend to be closed already
			});
		} else {
			mainScreen.show();
			mainScreen.focus();
		}
	},

	showSettings: function() {
		if(!settingsWindow) {
			settingsWindow = gui.Window.open('component.html#SettingsForm', {
				title: 'Settings',
				position: 'center',
				toolbar: false,
				width: 600,
				height: 265,
				focus: true
			});
			settingsWindow.on('close', function() {
				this.hide(); // Pretend to be closed already
			});
		} else {
			settingsWindow.show();
			settingsWindow.focus();
		}
	},

	showSync: function() {
		if(!syncScreenwindow) {
			syncScreenwindow = gui.Window.open('component.html#SyncScreen', {
				title: 'Sync',
				position: 'center',
				toolbar: false,
				width: 600,
				height: 100,
				focus: true,
			});
			syncScreenwindow.on('close', function() {
				this.hide();
			});
		} else {
			syncScreenwindow.show();
			syncScreenwindow.focus();
		}
	},

	hideSplashScreen: function() {
		if(!!splashScreenwindow) {
			splashScreenwindow.hide();
		}
	},

	showSplashScreen: function() {
		if(!splashScreenwindow) {
			splashScreenwindow = gui.Window.open('component.html#SplashScreen', {
				location: 'no',
				transparent: true,
				frame: false,
				toolbar: false,
				position: 'center',
				width: 600,
				height: 430,
				focus: true
			});
		} else {
			splashScreenwindow.focus();
		}
	},

	getSynchronizer: function() {
		console.log("Email: " + SettingsStore.getEmail());
		var api = new PolarApi(SettingsStore.getEmail(), new MemoryCookieStore(), function(api, cb) {
			console.log("Password: "+ SettingsStore.getPassword());
			api.authenticate(SettingsStore.getPassword(), cb);
		});
		var synchronizer = new PolarSynchronizer(SettingsStore.getDirectory(), api);
		return synchronizer;
	},

	sync: function(cb, progressCb) {
		this.getSynchronizer().synchronize(cb, progressCb);
	},

	initApplication: function() {
		// Create a tray icon
		var tray = new gui.Tray({ tooltip: 'Flow Synchronizer', icon: 'images/Heart_System_Tray.png' });

		// Give it a menu
		var menu = new gui.Menu();

		var settingsMenuItem = new gui.MenuItem({ label: 'Settings' });

		settingsMenuItem.click = this.showSettings.bind(this);

		var syncMenuItem = new gui.MenuItem({ label: 'Sync' });

		syncMenuItem.click = this.showSync.bind(this);

		menu.append(settingsMenuItem);
		menu.append(syncMenuItem);

		tray.menu = menu;

		this.showSplashScreen();

	}

};