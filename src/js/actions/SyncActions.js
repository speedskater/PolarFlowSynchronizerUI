var SyncActions,
	Reflux = require('reflux'),
	SettingsStore = require('../SettingsStore.js'),
	PolarApi = require('polar-flow-synchronizer/lib/PolarApi.js'),
	PolarSynchronizer = require('polar-flow-synchronizer/lib/PolarSynchronizer.js'),
	MemoryCookieStore = require('tough-cookie/lib/memstore.js').MemoryCookieStore;

SyncActions = Reflux.createActions({
	"sync": {children: ["completed","failed","progress"]}
});

SyncActions.sync.listen(function() {
	var email = SettingsStore.getEmail();
	var cookieStore = new MemoryCookieStore();

	var api = new PolarApi(email, cookieStore, function(api, cb) {
		api.authenticate(SettingsStore.getPassword(), cb);
	});
	var synchronizer = new PolarSynchronizer(SettingsStore.getDirectory(), api);

	var completed = this.completed.bind(this);
	var failed = this.failed.bind(this);
	var progress = this.progress.bind(this);

	synchronizer.synchronize(function(error, nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles) {
		if(!error) {
			completed(nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles);
		} else {
			failed(error, nrFilesDownloaded, couldNotDownload, falseMimeTypes, successfullDownloads, existingFiles)
		}
	}, function(totalNumberFiles, filesProcessed, filesFailed, trainingUrl, successful) {
		progress(totalNumberFiles, filesProcessed, filesFailed, trainingUrl, successful);
	});
});

module.exports = SyncActions;
