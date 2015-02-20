var React = require('react/addons');
var Image = require('./Image.jsx');
var Async = require('async');
var UserSettings = require('../SettingsStore.js');
var SettingsActions = require('../actions/SettingsActions');
var Api = require('../Api.js');
var gui = window.require('nw.gui');

var timer;
var initializationTimer;
var initialized=false;

var SplashScreen = React.createClass({
	getInitialState: function() {
		return {
			dots: 0
		};
	},

	onAppInitialized: function() {
		if(!initialized) {
			window.clearTimeout(initializationTimer);
			Api.hideSplashScreen();
			Api.showMainScreen();
			/*if(!SettingsStore.isValid()) {
				Api.showSettings();
			} else {
				Api.showSync();
			}*/
		}
	},

	componentDidMount: function() {
		timer = window.setInterval(this.updateLoadingText.bind(this), 100);
		SettingsActions.load();
		initializationTimer = window.setTimeout(this.onAppInitialized.bind(this), 700);
	},

	componentWillUnmount: function() {
		window.clearInterval(initializationTimer);
		window.clearInterval(timer);
	},

	updateLoadingText: function() {
		this.setState({
			dots: (this.state.dots+1)%30
		});
	},

	render: function() {
		var dots = '';

		for(var i=0; i < this.state.dots; ++i) {
			dots = dots + '.';
		}

		return <div><Image src="images/cardiacSync.svg"/><span style={{
			color: 'black',
			position: 'absolute',
			left: '25px',
			top: '258px',
			fontSize: "8px"
		}}>Loading{dots}</span></div>;
	}
});

module.exports = SplashScreen;