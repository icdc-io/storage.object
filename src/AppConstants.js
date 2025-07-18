export const BILLING_USER_NAME = "billing";
export const EMPTY_VALUE = String.fromCharCode(8212);

export const POOLS_FETCH = "POOLS_FETCH";

export const FETCH_S3_LIMITS = "FETCH_S3_LIMITS";

export const FETCH_S3_QUOTAS = "FETCH_S3_QUOTAS";
export const CREATE_S3_QUOTA = "CREATE_S3_QUOTA";
export const UPDATE_S3_QUOTA = "UPDATE_S3_QUOTA";

export const S3_USERS_FETCH = "S3_USERS_FETCH";
export const CREATE_S3_USER = "CREATE_S3_USER";
export const DELETE_S3_USER = "DELETE_S3_USER";
export const EDIT_S3_USER = "EDIT_S3_USER";
export const S3_USER_FETCH = "S3_USER_FETCH";
export const S3_USER_LOCK = "S3_USER_LOCK";
export const S3_USER_UNLOCK = "S3_USER_UNLOCK";
export const S3_USER_GENERATE_KEYS = "S3_USER_GENERATE_KEYS";
export const CLEAR_S3_USER_FETCH_STATUS = "CLEAR_S3_USER_FETCH_STATUS";

export const BUCKETS_FETCH = "BUCKETS_FETCH";
export const CREATE_BUCKET = "CREATE_BUCKET";
export const DELETE_BUCKET = "DELETE_BUCKET";
export const EDIT_BUCKET = "EDIT_BUCKET";

export const ACCOUNT_USERS_FETCH = "ACCOUNT_USERS_FETCH";

export const BASE_URL = "/api/storage/v2";
export const BASE_USERS_URL = `${process.env.REACT_APP_API_GATEWAY}/api`;

export const poolsUrl = () => `${BASE_URL}/pools`;
export const s3UsersUrl = () => `${BASE_URL}/s3/users`;
export const s3UserUrl = () => `${BASE_URL}/s3/users`;
export const s3LimitsUrl = () => `${BASE_URL}/s3/limits`;
export const s3QuotasUrl = () => `${BASE_URL}/s3/quotas`;
export const s3QuotaUrl = (quota_id) => `${BASE_URL}/s3/quotas/${quota_id}`;
export const bucketsUrl = () => `${BASE_URL}/s3/buckets`;
export const getAccountUsersUrl = () =>
	`${BASE_USERS_URL}/accounts/v1/account/users`;

export const USER_UPDATE = "USER_UPDATE";
export const CHANGE_LANG = "CHANGE_LANG";

export const intersperse = (arr, sep) => {
	if (arr.length === 0) {
		return [];
	}

	return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
};
