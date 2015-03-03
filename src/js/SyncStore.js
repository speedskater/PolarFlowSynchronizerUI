var Reflux = require('reflux');
var SyncActions = require('./actions/SyncActions.js');

var SyncStore = Reflux.createStore({

	isSyncing: false,
	processedUrls: [],
	existingsFiles: [],
	syncedFiles: [],
	wrongFormatFiles: [],
	failedFiles: [],
	totalNumberFiles: 0,
	noFilesSuccessful: 0,
	noFilesFailed: 0,

	// Initial setup
	init: function() {
		// Register statusUpdate action
		this.listenTo(SyncActions.sync, this.syncStarted.bind(this));
		this.listenTo(SyncActions.sync.completed, this.syncFinished.bind(this));
		this.listenTo(SyncActions.sync.failed, this.syncFailed.bind(this));
		this.listenTo(SyncActions.sync.progress, this.updateSyncState.bind(this));
	},

	syncStarted: function() {
		this.isSyncing = true;
		this.errorOccurred = null;
		this.processedUrls = [];
		this.existingFiles = [];
		this.syncedFiles = [];
		this.failedFiles = [];
		this.wrongFormatFiles = [];
		this.totalNumberFiles = 0;
		this.noFilesSuccessful = 0;
		this.noFilesFailed = 0;
		this.triggerUpdate();
	},

	syncFailed: function(error, nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles) {
		this.errorOccurred = error;
		this.syncFinished(nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles);
	},

	syncFinished: function(nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles) {
		this.failedFiles = couldNotDownload;
		this.existingFiles = existingFiles;
		this.wrongFormatFiles = falseMimeTypes;
		this.syncedFiles = successfullDownloads;
		this.isSyncing = false;
		this.triggerUpdate();
	},

	updateSyncState: function(totalNumberFiles, noFilesProcessed, noFilesFailed, currentFile, successful) {
		this.totalNumberFiles = totalNumberFiles;
		this.noFilesSuccessful = noFilesProcessed;
		this.noFilesFailed = noFilesFailed;
		this.processedUrls.push({
			url: currentFile,
			successful: successful
		});
		this.triggerUpdate();
	},

	triggerUpdate: function() {
		this.trigger({
			errorOccurred: this.errorOccurred,
			isSyncing: this.isSyncing,
			processedUrls: this.processedUrls,
			existingFiles: this.existingFiles,
			syncedFiles: this.syncedFiles,
			wrongFormatFiles: this.wrongFormatFiles,
			noFilesFailed: this.noFilesFailed,
			noFilesSuccessful: this.noFilesSuccessful,
			totalNumberFiles: this.totalNumberFiles,
			failedFiles: this.failedFiles,
			syncStarted: true
		});
	}
});

module.exports = SyncStore;