/**
 * Removes a module from the cache.
 */
require.uncache = function (moduleName) {
	// Run over the cache looking for the files
	// loaded by the specified module name
	require.searchCache(moduleName, function (mod) {
		delete require.cache[mod.id];
	});
};

/**
 * Runs over the cache to search for all the cached files.
 */
require.searchCache = function (moduleName, callback) {
	// Resolve the module identified by the specified name
	var mod = require.resolve(moduleName);

	// Check if the module has been resolved and found within
	// the cache
	if (mod && ((mod = require.cache[mod]) !== undefined)) {
		// Recursively go over the results
		(function run(mod) {
			// Go over each of the module's children and
			// run over it
			mod.children.forEach(function (child) {
				run(child);
			});

			// Call the specified callback providing the
			// found module
			callback(mod);
		})(mod);
	}
};

/*
 * Load a module, clearing it from the cache if necessary.
 */
require.reload = function(moduleName) {
	require.uncache(moduleName);
	return require(moduleName);
};


var keychain = require('xkeychain');

console.log("TTEEESSSTTT: " + window.localStorage.email);

var shortcuts = [];
module.exports = {
	registerDevToolShortcut: function(gui, win) {
		var option = {
			key : "Ctrl+Alt+I",
			active : function() {
				win.showDevTools();
			},
			failed : function(msg) {
				// :(, fail to register the |key| or couldn't parse the |key|.
				console.log("Couldnot register" + msg);
			}
		};
		// Create a shortcut with |option|.
		var shortcut = new gui.Shortcut(option);

// Register global desktop shortcut, which can work without focus.
		gui.App.registerGlobalHotKey(shortcut);

		return shortcut;
	},

	registerReloadShortcut: function(gui, win) {
		var reloadOptions = {
			key : "Ctrl+R",
			active : function() {
				win.window.location.reload();
			},
			failed : function(msg) {
				// :(, fail to register the |key| or couldn't parse the |key|.
				console.log("Couldnot register reload" + msg);
			}
		};

		var shortcut = new gui.Shortcut(reloadOptions);

		gui.App.registerGlobalHotKey(shortcut);

		return shortcut;
	},

	unregisterShortcuts: function(gui) {
		shortcuts.forEach(function(shortcut) {
			gui.App.unregisterGlobalHotKey(shortcut);
		}, this);
	},

	updateShortcuts: function(gui, win) {
		this.unregisterShortcuts(gui);
		shortcuts = [ this.registerDevToolShortcut(gui, win), this.registerReloadShortcut(gui, win) ];
	},

	showComponent: function(window, Component) {
		global.localStorage = window.localStorage;
		global.document = window.document;
		global.navigator = window.navigator;
		var React = require('react/addons');
		var gui = window.require('nw.gui');
		//console.log("Location: " + gui.Window.get().location);
		var Component = require('./components/' + (Component || window.location.hash.substring(1)) + '.jsx');
		var win = gui.Window.get(window);

		this.updateShortcuts(gui, win);

		React.render(<Component />, window.document.getElementById('main'));

		window.focus();

	}
}
