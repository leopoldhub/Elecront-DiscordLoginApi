const LoginApi = require('./index');

const cancelListener = () => {
	console.log('login cancelled.');
};
LoginApi.setCancelListener(cancelListener);

const loginFailListener = result => {
	console.log('fail...');
	const messages = [];

	for (const [key, value] of Object.entries(result.errors)) {
		value._errors.forEach(error => {
			if (!messages.includes(error.message)) messages.push(error.message);
		});
	}

	console.log('login failed! retrying...\n\t', messages.join('\n\t'));
};
LoginApi.setLoginFailListener(loginFailListener);

const loginSuccessListener = result => {
	console.log('login success! token: ', result.token);
};
LoginApi.setLoginSuccessListener(loginSuccessListener);

LoginApi.setCloseListener(() => {
	console.log('Closed!');
	LoginApi.removeCancelListener(cancelListener);
	LoginApi.removeLoginFailListener(loginFailListener);
	LoginApi.removeLoginSuccessListener(loginSuccessListener);
	LoginApi.removeAllCloseListeners();
	console.log('cancelListeners', LoginApi.cancelListeners.length);
	console.log('loginFailListeners', LoginApi.loginFailListeners.length);
	console.log('loginSuccessListeners', LoginApi.loginSuccessListeners.length);
	console.log('closeListeners', LoginApi.closeListeners.length);
});

console.log('cancelListeners', LoginApi.cancelListeners.length);
console.log('loginFailListeners', LoginApi.loginFailListeners.length);
console.log('loginSuccessListeners', LoginApi.loginSuccessListeners.length);
console.log('closeListeners', LoginApi.closeListeners.length);

console.log('starting...');
LoginApi.startLogin();
