var Datauri = require('datauri');
var React = require('react/addons');

var Image = React.createClass({
	render: function() {
		return <img src={this.props.src} width="100%" />;
	}
});

module.exports = Image;
