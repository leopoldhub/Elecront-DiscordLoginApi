const LoginApi = require('./index');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

let win;

app.whenReady().then(() => {
	win = new BrowserWindow({
		width: 1080,
		height: 720,
		autoHideMenuBar: true,
		darkTheme: true,
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
			preload: path.join(app.getAppPath(), 'examplepreload.js'),
		},
	});

	win.loadFile('example.html');

	win.on('close', function (e) {
		app.exit(0);
	});

	ipcMain.on('toMain', (event, arg) => {
		LoginApi.setLoginSuccessListener(result => {
			console.log(result.token);
			event.reply('fromMain', result.token);
		});

		LoginApi.setCloseListener(() => {
			LoginApi.removeAllLoginSuccessListeners();
			LoginApi.removeAllCloseListeners();
		});

		LoginApi.startLogin();
	});
});
