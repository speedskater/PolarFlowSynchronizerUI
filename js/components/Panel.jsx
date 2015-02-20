var React = require('react/addons');

/*<div className="panel-heading">
 <h3 className="panel-title">{this.props.title}</h3>
 </div>*/

var Panel = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default" style={{ borderWidth: '0px'}}>

				<div className="panel-body">
				{this.props.children}
				</div>
			</div>
		);
	}
});

module.exports = Panel;