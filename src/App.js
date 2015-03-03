require('node-jsx').install({extension: '.jsx'});
var settingsStore = require("./js/SettingsStore.js");
var gui = window.require('nw.gui');
var win = gui.Window.get();

global.localStorage = window.localStorage;
global.document = window.document;
global.navigator = window.navigator;

var React = require('react/addons');
var MainScreen = React.createFactory(require('./js/components/MainScreen.jsx'));
//console.log("Location: " + gui.Window.get().location);

React.render(MainScreen(), window.document.getElementById('main'));
window.focus();
//win.showDevTools();

settingsStore.load();


