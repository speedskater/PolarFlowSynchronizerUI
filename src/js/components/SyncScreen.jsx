var React = require('react/addons'),
	ProgressBar = require('./ProgressBar.jsx'),
	Reflux = require('reflux'),
	SettingsStore = require('../SettingsStore.js'),
	SyncActions = require('../actions/SyncActions.js'),
	SyncStore = require('../SyncStore.js');

var timer;

var SyncScreen = React.createClass({
	mixins: [Reflux.listenTo(SettingsStore,'onUserSettingsChange'), Reflux.listenTo(SyncStore,'synStateChanged')],

	getInitialState: function() {
		return {
			isSyncing: false,
			statusMessage: '',
			progress: 0,
			isSettingsValid: SettingsStore.isValid()
		};
	},

	synStateChanged: function(syncingInformation) {
		this.setState({
			isSyncing: syncingInformation.isSyncing,
			progress: (syncingInformation.totalNumberFiles === 0) ? 0 : (100 * (syncingInformation.noFilesFailed + syncingInformation.noFilesSuccessful))/syncingInformation.totalNumberFiles
		});
	},

	onUserSettingsChange: function(settings) {
		this.setState({
			isSettingsValid: settings.isValid
		});
	},

	synchronize: function() {
		SyncActions.sync();
	},

	isButtonDisabled: function() {
		return this.state.isSyncing || !this.state.isSettingsValid;
	},

	render: function() {
		return (<div>
			{ (this.state.statusMessage !== '') ? <div>{this.state.statusMessage}</div> : '' }
			<ProgressBar progress={this.state.progress} active={this.state.isSyncing} caption="4/20 files synced" />
			<button type="submit" className="btn btn-default btn-primary"  disabled={this.isButtonDisabled()}  onClick={this.synchronize}>Sync</button>
		</div>);
	}
});

module.exports = SyncScreen;