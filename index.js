const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

let closed = true;

function startLogin() {
	if (!closed) return;
	closed = false;
	app.whenReady().then(() => {
		win = new BrowserWindow({
			width: 720,
			height: 720,
			autoHideMenuBar: true,
			darkTheme: true,
			closable: true,
			resizable: false,
			maximizable: false,
			minimizable: true,
			icon: path.join(app.getAppPath(), 'icon.png'),
			webPreferences: {
				webSecurity: false,
				nodeIntegration: true,
			},
		});

		win.webContents.session.clearStorageData();

		win.on('close', function (e) {
			closed = true;
			try {
				win.destroy();
			} catch (error) {}
			if (!logged) cancel();
			closeEvent();
		});

		try {
			win.webContents.debugger.attach('1.3');
		} catch (err) {
			console.log('Debugger attach failed: ', err);
		}

		win.webContents.session.webRequest.onBeforeRequest(
			{ urls: ['https://discord.com/app'] },
			(details, callback) => {
				callback({ cancel: true });
			}
		);

		win.webContents.debugger.sendCommand('Fetch.enable', {
			patterns: [
				{
					urlPattern: 'https://discord.com/api/v9/auth/login',
					requestStage: 'Response',
				},
			],
		});

		async function getResponseJson(requestId) {
			const res = await win.webContents.debugger.sendCommand(
				'Fetch.getResponseBody',
				{
					requestId: requestId,
				}
			);
			return JSON.parse(
				res.base64Encoded
					? Buffer.from(res.body, 'base64').toString()
					: res.body
			);
		}

		win.webContents.debugger.on('message', async (e, m, p) => {
			if (m === 'Fetch.requestPaused') {
				var reqJson = JSON.parse(p.request.postData);
				var resJson = await getResponseJson(p.requestId);

				if (resJson.token) loginSuccess(resJson);
				else if (resJson.code) loginFail(resJson);

				try {
					await win.webContents.debugger.sendCommand('Fetch.continueRequest', {
						requestId: p.requestId,
					});
				} catch (e) {}
			}
		});

		win.loadURL('https://discord.com/login');
	});
}

let logged = false;

const cancelListeners = [];

function setCancelListener(listener) {
	cancelListeners.push(listener);
}

function removeCancelListener(listener) {
	const idx = cancelListeners.indexOf(listener);
	if (idx > -1) cancelListeners.splice(idx, 1);
}

function removeAllCancelListeners() {
	cancelListeners.splice(0, cancelListeners.length);
}

async function cancel() {
	cancelListeners.forEach(listener => {
		try {
			(async () => listener())();
		} catch (error) {}
	});
	if (!closed) close();
}

const loginSuccessListeners = [];

function setLoginSuccessListener(listener) {
	loginSuccessListeners.push(listener);
}

function removeLoginSuccessListener(listener) {
	const idx = loginSuccessListeners.indexOf(listener);
	if (idx > -1) loginSuccessListeners.splice(idx, 1);
}

function removeAllLoginSuccessListeners() {
	loginSuccessListeners.splice(0, loginSuccessListeners.length);
}

async function loginSuccess(body) {
	logged = true;
	loginSuccessListeners.forEach(listener => {
		try {
			(async () => listener(body))();
		} catch (error) {
			console.log(error);
		}
	});
	close();
}

const loginFailListeners = [];

function setLoginFailListener(listener) {
	loginFailListeners.push(listener);
}

function removeLoginFailListener(listener) {
	const idx = loginFailListeners.indexOf(listener);
	if (idx > -1) loginFailListeners.splice(idx, 1);
}

function removeAllLoginFailListeners() {
	loginFailListeners.splice(0, loginFailListeners.length);
}

async function loginFail(body) {
	loginFailListeners.forEach(listener => {
		try {
			(async () => listener(body))();
		} catch (error) {}
	});
}

const closeListeners = [];

function setCloseListener(listener) {
	closeListeners.push(listener);
}

function removeCloseListener(listener) {
	const idx = closeListeners.indexOf(listener);
	if (idx > -1) closeListeners.splice(idx, 1);
}

function removeAllCloseListeners() {
	closeListeners.splice(0, closeListeners.length);
}

async function closeEvent() {
	closeListeners.forEach(listener => {
		try {
			(async () => listener())();
		} catch (error) {}
	});
}

async function close() {
	try {
		win.close();
	} catch (error) {}
}

module.exports = {
	startLogin,
	cancel,
	setCancelListener,
	removeCancelListener,
	removeAllCancelListeners,
	setLoginSuccessListener,
	removeLoginSuccessListener,
	removeAllLoginSuccessListeners,
	setLoginFailListener,
	removeLoginFailListener,
	removeAllLoginFailListeners,
	close,
	setCloseListener,
	removeCloseListener,
	removeAllCloseListeners,
	cancelListeners,
	loginFailListeners,
	loginSuccessListeners,
	closeListeners,
};
