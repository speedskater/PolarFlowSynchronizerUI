var SettingsActions,
	Reflux = require('reflux');

SettingsActions = {
	changed: Reflux.createAction({ sync: true}),
	load: Reflux.createAction({ sync: true})
};

module.exports = SettingsActions;
