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
export function setCancelListener(cancelListener: () => void): void;
export function removeCancelListener(cancelListener: () => void): void;
export function removeAllCancelListeners(): void;
export function setLoginSuccessListener(
	loginSuccessListener: (result: loginResult) => void
): void;
export function removeLoginSuccessListener(
	loginSuccessListener: (result: loginResult) => void
): void;
export function removeAllLoginSuccessListeners(): void;
export function setLoginFailListener(
	loginFailListener: (result: failResult) => void
): void;
export function removeLoginFailListener(
	loginFailListener: (result: failResult) => void
): void;
export function removeAllLoginFailListeners(): void;
export function close(): void;
export function setCloseListener(closeListener: () => void): void;
export function removeCloseListener(closeListener: () => void): void;
export function removeAllCloseListeners(): void;

export const cancelListeners: Array<() => void>;
export const loginFailListeners: Array<(result: failResult) => void>;
export const loginSuccessListeners: Array<(result: loginResult) => void>;
export const closeListeners: Array<() => void>;
