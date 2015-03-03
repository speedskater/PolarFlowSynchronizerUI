var fs = require('fs');
//var keychain = require('xkeychain');
var email = window.localStorage.email;
var directory = window.localStorage.directory;
var password = '';
var Reflux = require('reflux');
var SettingsActions = require('./actions/SettingsActions');

var SettingsStore = Reflux.createStore({

	// Initial setup
	init: function() {
		// Register statusUpdate action
		this.listenTo(SettingsActions.changed, this.settingsFieldChanged);
		this.listenTo(SettingsActions.load, this.load);
	},

	settingsFieldChanged: function(fieldName, value) {
		fieldName = fieldName.toString();

		var setterName = "set" + fieldName.substr(0, 1).toUpperCase() + fieldName.substr(1);
		this[setterName](value.toString());
		this.triggerUpdate();
	},

	getEmail: function() {
		return email;
	},
	getPassword: function() {
		return password;
	},
	getDirectory: function() {
		return directory;
	},
	setEmail: function(emailParam) {
		email = window.localStorage.email = emailParam;
	},
	setDirectory: function(directoryParam) {
		directory = window.localStorage.directory = directoryParam;
	},
	setPassword: function(passwordParam) {
		password = passwordParam;
		/*keychain.setPassword({ account: email, service: 'polar-flow-synchronizer-ui', password: password }, function(err) {
			if(!err) {
				console.log("Password stored in keychain");
			} else {
				console.log("Password storage in keychain failed: " + err);
			}
		});*/
	},
	isValid: function() {
		function isDefined(value) {
			return value !== undefined && value !== '';
		};
		return isDefined(email) && isDefined(password) && fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();
	},

	triggerUpdate: function() {
		console.log("Triggering Update");
		this.trigger({
			email: email,
			password: password,
			directory: directory,
			isValid: this.isValid()
		});
	},

	load: function() {
		var triggerUpdate = this.triggerUpdate.bind(this);
		/*window.setTimeout(function() {
			keychain.getPassword({account: email, service: 'polar-flow-synchronizer-ui'}, function (err, pass) {
				if (!err && password == '') {
					password = pass;
					triggerUpdate();
				}
			});
		}, 1);*/
	}
});

module.exports = SettingsStore;