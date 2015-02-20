var React = require('react/addons');

var NwDirectory = React.createClass({
	componentDidMount: function() {
		this.getDOMNode().setAttribute('nwdirectory', 'nwdirectory');
		this.getDOMNode().setAttribute('webkitdirectory', 'webkitdirectory');

	},
	directoryChanged: function(value) {
		var files= this.getDOMNode().files;
		for(var i=0; i < files.length; ++i)  {
			var file = files[i];
			console.log("FILE: " + file.path + " :: " + file.name);
		}
		console.log("PATH: " + this.getDOMNode().value);
	},
	render: function() {
		return (
			<input type="file" name={this.props.name} onChange={this.directoryChanged} />
		);
	}
});

module.exports = NwDirectory;