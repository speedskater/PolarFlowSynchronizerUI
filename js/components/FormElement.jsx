var React = require('react/addons');

var FormElement = React.createClass({

	getInitialState: function () {
		return {
			value: this.props.defaultValue,
			validation: {
				valid: true
			}
		};
	},

	handleChange: function (event) {
		var newValue = event.target.value;

		if (this.props.onChange) {
			this.props.onChange(event);
		}
		this.setState({
			value: newValue,
			validation: this.props.validation(this.props.label, newValue)
		});
	},

	render: function() {
		var value = this.props.value || this.state.value;
		var validationMessage = this.state.validation.valid
			? ''
			: ' (' + this.state.validation.message + ')';
		var validationClass = this.state.validation.valid
			? ''
			: ' has-error has-feedback';

		return (
			<div className={'form-group' + validationClass}>
				<label htmlFor={this.props.name}>{this.props.label + validationMessage}</label>
				<input type={this.props.type || 'text'} className="form-control" onChange={this.handleChange} name={this.props.name} value={value} placeholder={this.props.placeholder} />
			</div>
		);
	}
});

module.exports = FormElement;