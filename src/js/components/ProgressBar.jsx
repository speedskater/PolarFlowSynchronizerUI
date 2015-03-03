var React = require('react/addons'),
	ProgressBar;

ProgressBar = React.createClass({

	getDefaultProps: function() {
		return {
			progress: 0,
			caption: '',
			active: false
		}
	},

	render: function() {
		return (
			<div className="progress">
				<div className={'progress-bar progress-bar-striped' + (this.props.active ? ' active' : '') } role="progressbar" aria-valuenow={this.props.progress} aria-valuemin={0} aria-valuemax={100} style={{width: this.props.progress + '%'}}>
					<span className="sr-only">{this.props.caption}</span>
				</div>
			</div>
		);
	}
});


module.exports = ProgressBar;