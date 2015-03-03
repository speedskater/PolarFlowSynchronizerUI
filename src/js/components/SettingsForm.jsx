var fs = require('fs'),
	React = require('react/addons'),
	FormElement = require('./FormElement.jsx'),
	DirectoryChooser = require('./DirectoryChooser.jsx'),
	SettingsStore = require('../SettingsStore.js'),
	SettingsActions = require('../actions/SettingsActions.js'),
	Reflux = require('reflux');

var SettingsForm = React.createClass({
	mixins: [Reflux.connect(SettingsStore)],

	getInitialState: function() {
		return {
			email: SettingsStore.getEmail(),
			password: SettingsStore.getPassword(),
			directory: SettingsStore.getDirectory()
		}
	},

	fieldChanged: function(fieldName, event) {
		SettingsActions.changed(fieldName, event.target.value);
	},

	formIsValid: function() {
		var formIsValid = this.state.email !== '' && this.state.password !== '' && fs.existsSync(this.state.directory) && fs.lstatSync(this.state.directory).isDirectory();
		return formIsValid;
	},

	isRequired: function(label, value) {
		var isValid = value !== "";
		console.log("VALIDATE: " + label + " -> " + isValid);

		return {
			valid: isValid,
			message: label + " is required."
		};
	},

	isDirectory: function(label, value) {
		var isDirectory = fs.existsSync(value) && fs.lstatSync(value).isDirectory()
		return {
			valid: isDirectory,
			message: label + " must be an existing Directory."
		}
	},

	render: function() {
		return (<form>
			<FormElement
				label="Email address"
				type="email"
				name="email"
				value={this.state.email}
				validation={this.isRequired}
				onChange={this.fieldChanged.bind(this, ['email'])} placeholder="Enter email" />
			<FormElement
				label="Password"
				type="password"
				name="password"
				value={this.state.password}
				placeholder="Password"
				validation={this.isRequired}
				onChange={this.fieldChanged.bind(this, ['password'])}
			/>
			<DirectoryChooser
				value={this.state.directory}
				label="Target directory"
				validation={this.isDirectory}
				onChange={this.fieldChanged.bind(this, ['directory'])}
			/>
		</form>);
	}
});

module.exports = SettingsForm;