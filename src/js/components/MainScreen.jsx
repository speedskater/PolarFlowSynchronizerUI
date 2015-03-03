var React = require('react/addons'),
	SettingsForm = require('./SettingsForm.jsx'),
	SyncScreen = require('./SyncScreen.jsx'),
	SyncOutputDisplay = require('./SyncOutputDisplay.jsx');

var MainScreen = React.createClass({

	render: function() {
		return (
			<div style={{padding:'10px', flexDirection: 'column', "display": 'flex', height: '100%', overflow: 'none' }} >
				<div style={{ flexShrink: 0 }}>
					<SettingsForm />
					<SyncScreen />
				</div>
				<div className="panel panel-default" style={{ flexGrow: 1, marginTop: '10px', "display": "flex", flexDirection: 'column' }}>
					<div className="panel-heading" style={{ flexShrink: 0, overflow: 'none' }}>
						<h3 className="panel-title">Synchronisation Result</h3>
					</div>
					<div className="panel-body" style={{ flexGrow: 1, overflow: 'scroll'}}>
						<SyncOutputDisplay/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = MainScreen;