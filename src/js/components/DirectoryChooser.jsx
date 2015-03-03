var React = require('react/addons'),
	NwDirectory = require('./NwDirectory.jsx');

var DirectoryChooser = React.createClass({
	handleChange: function (event) {
		var newValue = event.target.value;

		if (this.props.onChange) {
			this.props.onChange(event);
		}
		this.setState({
			value: newValue,
			validationState: this.props.validation(this.props.label, newValue)
		});
	},

	componentDidMount: function() {
		this.refs.nwdirectoryChooser.getDOMNode().setAttribute('nwdirectory', 'nwdirectory');
	},

	getInitialState: function () {
		return {
			value: this.props.defaultValue,
			validation: {
				valid: true
			}
		};
	},

	openDialog: function() {
		this.refs.nwdirectoryChooser.getDOMNode().click();
	},

	render: function() {
		var value = this.props.value || this.state.value;
		var validationMessage = this.state.validation.valid
			? ''
			: ' (' + this.state.validation.message + ')';
		var validationClass = this.state.validation.valid
			? ''
			: ' has-error has-feedback';

		var directory = !value || value === '' ? 'Kein Verzeichnis ausgewählt' : value;

		return (
			<div className={'form-group' + validationClass}>
				<label htmlFor="exampleInputFile">{this.props.label + validationMessage}</label>
				<br/>
				<div style={{display: 'flex' }}>
					<input type="file" name={this.props.name} style={{display:'none'}} onChange={this.handleChange} ref='nwdirectoryChooser'/>
					<button type="button" className="btn btn-xs" onClick={this.openDialog.bind(this)}>Choose directory</button>
					<input type="text" value={directory} readOnly style={{display :'inline-block', flexGrow: 1, marginLeft: '5px' }} />
				</div>
			</div>
		);
	}
});

module.exports = DirectoryChooser;