var Collapsible = require('./Collapsible.jsx'),
	gui = window.require('nw.gui'),
	React = require('react/addons'),
	Reflux = require('reflux'),
	SyncStore = require('../SyncStore.js'),
	SyncOutputDisplay;

SyncOutputDisplay = React.createClass({
	mixins: [ Reflux.connect(SyncStore) ],

	getInitialState: function() {
		return {
			syncStarted: false,
			isSyncing: false,
			processedUrls: 0,
			syncedFiles: [],
			existingFiles: [],
			wrongFormatFiles: [],
			noFilesFailed: 0,
			noFilesSuccessful: 0,
			totalNumberFiles: 0,
			failedFiles: []
		}
	},

	render: function() {
		var output;

		if(!this.state.syncStarted) {
			output = <div>Please fill out the application settings and start synching.</div>
		} else {
			output = (this.state.isSyncing) ? this.renderSyncingState() : this.renderSyncFinishedState();
		}

		return output;
	},

	renderSyncingState: function() {
		return (
			<div>
				{ this.state.totalNumberFiles == 0 ? 'Inititalizing Sync....' : 'Syncing....' } <br/>
				{ this.createTrainingsUrlList(this.state.processedUrls) }
			</div>
		);
	},

	renderSyncFinishedState: function() {
		var outputs = [];
		var hasFailures = !!this.state.errorOccurred || this.state.wrongFormatFiles.length > 0 || this.state.failedFiles.length > 0;

		if(!!this.state.errorOccurred) {
			outputs.push(<div className="alert alert-danger">
				{this.state.errorOccurred.message}
			</div>)
		}

		if(this.state.syncedFiles.length > 0 || hasFailures) {
			outputs.push(this.createSummary("Successfully downloaded " + this.state.syncedFiles.length + " trainings.", this.state.syncedFiles));
		} else {
			outputs.push(this.createSummary("Everything is up to date.", this.state.syncedFiles));
		}

		if(this.state.existingFiles.length > 0) {
			outputs.push(this.createSummary(this.state.existingFiles.length + " Files already exist.", this.state.existingFiles));
		}
		if(this.state.wrongFormatFiles.length > 0) {
			outputs.push(this.createSummary(this.state.wrongFormatFiles.length + " Files do not match the specified file format.", this.state.wrongFormatFiles));
		}
		if(this.state.failedFiles.length > 0) {
			outputs.push(this.createSummary(this.state.failedFiles.length + " Files could not be downloaded.", this.state.failedFiles));
		}
		return (<div>
			{outputs}
		</div>)
	},

	createSummary: function(text, trainingsUrls) {
		return (
			<Collapsible title={text} collapsed={true} isCollapsible={trainingsUrls.length > 0}>
				{ this.createTrainingsUrlList(trainingsUrls) }
			</Collapsible>
		);
	},

	componentDidUpdate: function() {
		if(this.state.isSyncing) {
			var parentElement = this.getDOMNode().parentElement;
			parentElement.scrollTop = parentElement.scrollHeight;
		}
	},

	gotoTraining: function(trainingsUrl, event) {
		gui.Shell.openExternal(trainingsUrl);
		event.preventDefault();
	},

	createTrainingsUrlList: function(trainingsUrls) {
		var self = this;
		return (
			<ul>{
			trainingsUrls.map(function (trainingUrl) {
				return <li><a href={trainingUrl} targert="_blank" onClick={self.gotoTraining.bind(self, [ trainingUrl ])}>{trainingUrl}</a></li>
			})
			}</ul>
		)
	}

});


module.exports = SyncOutputDisplay;