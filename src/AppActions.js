import cogoToast from "cogo-toast";
import {
	createData,
	deleteData,
	fetchData,
	showErrorNotification,
	showSuccessNotification,
	updateData,
} from "container/Api";
import * as ActionTypes from "./AppConstants";

export const createS3user = (payload) => ({
	type: ActionTypes.CREATE_S3_USER,
	payload: createData(ActionTypes.s3UsersUrl(), payload),
});

export const fetchS3Users = (options) => ({
	type: ActionTypes.S3_USERS_FETCH,
	payload: fetchData(ActionTypes.s3UsersUrl(), {}, options),
});

export const fetchPools = (options) => ({
	type: ActionTypes.POOLS_FETCH,
	payload: fetchData(ActionTypes.poolsUrl(), {}, options),
});

export const fetchS3Limits = (account) => ({
	type: ActionTypes.FETCH_S3_LIMITS,
	payload: fetchData(ActionTypes.s3LimitsUrl(account)),
});

export const fetchS3quotas = (options) => ({
	type: ActionTypes.FETCH_S3_QUOTAS,
	payload: fetchData(ActionTypes.s3QuotasUrl(), options),
});

export const createS3quota = (payload) => ({
	type: ActionTypes.CREATE_S3_QUOTA,
	payload: createData(ActionTypes.s3QuotasUrl(), payload),
});

export const updateS3quota = (quota_id, payload) => ({
	type: ActionTypes.UPDATE_S3_QUOTA,
	payload: updateData(ActionTypes.s3QuotaUrl(quota_id), payload),
});

export const deleteS3user = (user_id) => ({
	type: ActionTypes.DELETE_S3_USER,
	payload: deleteData(`${ActionTypes.s3UserUrl()}/${user_id}`),
});

export const editS3user = ({ user_id, payload }) => ({
	type: ActionTypes.EDIT_S3_USER,
	payload: updateData(`${ActionTypes.s3UserUrl()}/${user_id}`, payload),
});

export const fetchS3User = (user_id) => ({
	type: ActionTypes.S3_USER_FETCH,
	payload: fetchData(`${ActionTypes.s3UserUrl()}/${user_id}`),
});

export const clearS3UserFetchStatus = () => ({
	type: ActionTypes.CLEAR_S3_USER_FETCH_STATUS,
});

export const lockS3userAC = (user_id, payload) => ({
	type: ActionTypes.S3_USER_LOCK,
	payload: updateData(`${ActionTypes.s3UserUrl()}/${user_id}`, payload),
});

const generateKeysAC = (user_id) => ({
	type: ActionTypes.S3_USER_GENERATE_KEYS,
	payload: createData(`${ActionTypes.s3UserUrl()}/${user_id}/keys`),
});

const handleError = (e) => {
	showErrorNotification(e);
	throw new Error(e);
};

export const generateKeys = (user_id) => (dispatch) => {
	const response = dispatch(generateKeysAC(user_id));

	return response.then(() => {
		dispatch(fetchS3User(user_id));
		showSuccessNotification("");
	}, handleError);
};

//S3_QUOTAS
export const createS3quotasActionAndFetch = (payload) => {
	return (dispatch) => {
		const response = dispatch(createS3quota(payload));

		return response.then(() => {
			dispatch(fetchS3quotas());
			showSuccessNotification("");
		}, handleError);
	};
};

export const editS3quotaAndFetch = (quota_id, payload) => {
	return (dispatch) => {
		const response = dispatch(updateS3quota(quota_id, payload));

		return response.then(() => {
			// dispatch(fetchS3quotas());
			showSuccessNotification("");
		}, handleError);
	};
};

//S3_USER

export const deleteS3userAndFetch = (user_id) => {
	return (dispatch) => {
		const response = dispatch(deleteS3user(user_id));

		return response.then(() => {
			dispatch(fetchS3Users());
			dispatch(fetchS3quotas());
			showSuccessNotification("");
		}, handleError);
	};
};

export const actionAndFetch = (action, payload) => {
	return (dispatch) => {
		const response = dispatch(action(payload));

		return response.then(() => {
			dispatch(fetchS3Users());
			dispatch(fetchS3quotas());
			showSuccessNotification("");
		}, handleError);
	};
};

export const lockS3user = (user_id, payload) => {
	return (dispatch) => {
		const response = dispatch(lockS3userAC(user_id, payload));

		return response.then((data) => {
			showSuccessNotification("");
			return data;
		}, handleError);
	};
};

// buckets actions

export const fetchBuckets = (username) => ({
	type: ActionTypes.BUCKETS_FETCH,
	payload: fetchData(
		`${ActionTypes.bucketsUrl()}?filter[user.name]=${username}`,
	),
});

export const createBucket = (payload) => ({
	type: ActionTypes.CREATE_BUCKET,
	payload: createData(ActionTypes.bucketsUrl(), payload),
});

export const deleteBucket = (path) => ({
	type: ActionTypes.DELETE_BUCKET,
	payload: deleteData(`${ActionTypes.bucketsUrl()}/${path}`, {}),
});

export const editBucket = (path, payload) => ({
	type: ActionTypes.EDIT_BUCKET,
	payload: updateData(`${ActionTypes.bucketsUrl()}/${path}`, payload),
});

export const createBucketAndFetch = (user_id, payload) => {
	return (dispatch) => {
		const response = dispatch(createBucket(payload));

		return response.then(() => {
			dispatch(fetchS3User(user_id));
			showSuccessNotification("");
		}, handleError);
	};
};

export const editBucketAndFetch = (user_id, path, payload) => {
	return (dispatch) => {
		const response = dispatch(editBucket(path, payload));

		return response.then(() => {
			dispatch(fetchS3User(user_id));
			showSuccessNotification("");
		}, handleError);
	};
};

export const deleteBucketAndFetch = (user_id, path) => {
	return (dispatch) => {
		const response = dispatch(deleteBucket(path));

		return response.then(() => {
			dispatch(fetchS3User(user_id));
			showSuccessNotification("");
		}, handleError);
	};
};

export const updateUser = (newUser) => ({
	type: ActionTypes.USER_UPDATE,
	payload: newUser,
});

export const changeLang = (lang) => ({
	type: ActionTypes.CHANGE_LANG,
	payload: lang,
});
