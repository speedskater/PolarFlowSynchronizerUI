var React = require('react/addons'),
	Panel = require('./Panel.jsx'),
	SettingsForm = require('./SettingsForm.jsx');


var Login = React.createClass({
	render: function() {
		return <Panel title="Settings">
			<SettingsForm />
		</Panel>;
	}
});

module.exports = Login;