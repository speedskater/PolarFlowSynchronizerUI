var React = require('react/addons'),
	ProgressBar;

Collapsible = React.createClass({

	getInitialState: function() {
		return {
			collapsed: this.props.collapsed
		}
	},

	getSectionContentStyle: function() {
		return {
			overflow: 'hidden',
			paddingLeft: this.getIndentation(),
			height: this.state.collapsed ? '0' : 'auto'/*,
			transform: 'scaleY(' + (this.state.collapsed ? 0 : 1) + ')',
			transformOrigin: '0 0',
			transition: 'transform 0.3s ease-in'*/
		}
	},

	toggleCollapsed: function() {
		if(this.props.isCollapsible) {
			this.setState({
				collapsed: !this.state.collapsed
			})
		}
	},

	getIconClass: function() {
		var iconClass = " glyphicon-" + (this.state.collapsed ? "plus" : "minus");
		return "glyphicon" + (this.props.isCollapsible ? iconClass : "");
	},

	getIndentation: function() {
		return 20;
	},

	render: function() {
		return (
			<div>
				<div onClick={this.toggleCollapsed.bind(this)}>
					<span className={ this.getIconClass() } style={{marginRight: "5px"}}></span>{this.props.title}
				</div>
				<div style={this.getSectionContentStyle()}>
					{this.props.children}
				</div>
			</div>
		);
	}
});


module.exports = Collapsible;