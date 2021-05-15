# Electron-DiscordLoginAPI

Obtain discord user token with an **electron** login page

## Install

Dependencies:

- electron (obviously)

Installation:

```
npm install electron-discordloginapi
```

## Node Usage

### The application must run in an Electron process

Import lib

```js
const LoginApi = require('electron-discordloginapi');
```

Start the login

```js
LoginApi.startLogin();
```

Add event listeners

```js
LoginApi.setCancelListener(() => {
	//when the user manualy close the login page
	console.log('login cancelled!');
});
LoginApi.setLoginFailListener(result => {
	//when the user enter wrong password/username or need captcha verification/2fa etc...
	console.log('login failed!', result);
});
LoginApi.setLoginSuccessListener(result => {
	//when the login is complete
	console.log('login succed! token: ', result.token);
});
LoginApi.setCloseListener(() => {
	//when the page is closed by the user or after clogin complete
	console.log('page closed!');
});
```

Remove event listeners

```js
LoginApi.removeCancelListener(cancelListener);
LoginApi.removeLoginFailListener(loginFailListener);
LoginApi.removeLoginSuccessListener(LoginSuccessListener);
LoginApi.removeCloseListener(closeListener);

LoginApi.removeAllCancelListeners();
LoginApi.removeAllLoginFailListeners();
LoginApi.removeAllLoginSuccessListeners();
LoginApi.removeAllCloseListeners();
```

Screenshots

![screenshot](./screenshot.png)

Types

```ts
interface error {
	code: number;
	errors?: Map<string, { _errors: Array<error> }>;
	message: string;
}

interface failResult extends error {}

interface loginResult {
	token: string;
	user_settings: {
		locale: string;
		theme: 'light' | 'dark';
	};
}

export function startLogin(): void;
export function cancel(): void;
export function close(): void;

export function setCancelListener(cancelListener: () => void): void;
export function removeCancelListener(cancelListener: () => void): void;
export function removeAllCancelListeners(): void;

export function setLoginFailListener(
	loginFailListener: (result: failResult) => void
): void;
export function removeLoginFailListener(
	loginFailListener: (result: failResult) => void
): void;
export function removeAllLoginFailListeners(): void;

export function setLoginSuccessListener(
	loginSuccessListener: (result: loginResult) => void
): void;
export function removeLoginSuccessListener(
	loginSuccessListener: (result: loginResult) => void
): void;
export function removeAllLoginSuccessListeners(): void;

export function setCloseListener(closeListener: () => void): void;
export function removeCloseListener(closeListener: () => void): void;
export function removeAllCloseListeners(): void;

export const cancelListeners: Array<() => void>;
export const loginFailListeners: Array<(result: failResult) => void>;
export const loginSuccessListeners: Array<(result: loginResult) => void>;
export const closeListeners: Array<() => void>;
```
