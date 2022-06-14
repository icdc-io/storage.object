import * as ActionTypes from './AppConstants';
import API from './Utilities/Api';
import cogoToast from 'cogo-toast';

const notificationMessages = {
    ru: {
        error: 'Ошибка! ',
        success: 'Успешно! ',
        processError: 'Повторите попытку позже.',
        deleteDiskError: 'Отсоедините клиентов и удалите снапшоты перед удалением диска.'
    },
    en: {
        error: 'Error! ',
        success: 'Success! ',
        processError: 'Please try again later.',
        deleteDiskError: 'Unassign clients and delete snapshots before deleting disk.'
    }
};

const base = (url) => {
    const { locations } = window.insights.getUserInfo().external;
    const location = window.insights.getLocation();
    return locations[location] + url;
};

const fetchData = (url, headers, options) => API.get(base(url), { ...headers, Authorization: `Bearer ${window.insights.getToken()}` }, { role: window.insights.getRole(), ...options });

const createData = (url, payload, headers) => API.put(base(`${url}?role=${window.insights.getRole()}`), payload, { ...headers, Authorization: `Bearer ${window.insights.getToken()}` });

const deleteData = (url, payload, headers) =>  API.delete(base(`${url}?role=${window.insights.getRole()}`), payload, { ...headers, Authorization: `Bearer ${window.insights.getToken()}` });

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorNotification = (msg) => cogoToast.error(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error + msg, notificationOptions);
const successNotification = (msg) => cogoToast.success(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

const checkErrorCodes = (item) => {
    switch (item.status) {
    case 422:
        return errorNotification(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].deleteDiskError);
    case 500:
        return errorNotification(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].processError);
    default:
        return errorNotification(item.data.explanation);
    }
};

// s3 users actions

export const fetchInfo = () => ({
    type: ActionTypes.INFO_FETCH,
    payload: fetchData(ActionTypes.infoUrl(), {}, {})
});

export const createS3user = (payload) => ({
    type: ActionTypes.CREATE_S3_USER,
    payload: createData(ActionTypes.s3UsersUrl(), payload, {})
});

export const fetchS3Users = (options) => ({
    type: ActionTypes.S3_USERS_FETCH,
    payload: fetchData(ActionTypes.s3UsersUrl(), {}, options)
});

export const deleteS3user = (name) => ({
    type: ActionTypes.DELETE_S3_USER,
    payload: deleteData(`${ActionTypes.s3UsersUrl()}/${name}`, {}, {})
});

export const editS3user = (name, payload) => ({
    type: ActionTypes.EDIT_S3_USER,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}`, payload, {})
});

export const fetchS3User = (name) => ({
    type: ActionTypes.S3_USER_FETCH,
    payload: fetchData(`${ActionTypes.s3UsersUrl()}/${name}`, {}, {})
});

export const clearS3UserFetchStatus = () => ({
    type: ActionTypes.CLEAR_S3_USER_FETCH_STATUS
});

export const lockS3user = (name) => ({
    type: ActionTypes.S3_USER_LOCK,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}/lock`, {}, {})
});

export const unlockS3user = (name) => ({
    type: ActionTypes.S3_USER_UNLOCK,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}/unlock`, {}, {})
});

export const generateKeys = (name) => ({
    type: ActionTypes.S3_USER_GENERATE_KEYS,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}/keys`, {}, {})
});

export const createS3userAndFetch = (payload) => {
    return (dispatch) => {
        const response = dispatch(createS3user(payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const editS3userAndFetch = (name, payload) => {
    return (dispatch) => {
        const response = dispatch(editS3user(name, payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const deleteS3userAndFetch = (name) => {
    return (dispatch) => {
        const response = dispatch(deleteS3user(name));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const actionAndFetch = (action, payload) => {
    return (dispatch) => {
        const response = dispatch(action(payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const lockS3userAndFetch = (name) => {
    return (dispatch) => {
        const response = dispatch(lockS3user(name));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            dispatch(fetchS3User(name));
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const unlockS3userAndFetch = (name) => {
    return (dispatch) => {
        const response = dispatch(unlockS3user(name));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchInfo());
            dispatch(fetchS3User(name));
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

// buckets actions

export const fetchBuckets = (name) => ({
    type: ActionTypes.BUCKETS_FETCH,
    payload: fetchData(`${ActionTypes.s3UsersUrl()}/${name}/buckets`, {}, {})
});

export const createBucket = (name, payload) => ({
    type: ActionTypes.CREATE_BUCKET,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}/buckets`, payload, {})
});

export const deleteBucket = (bucket) => ({
    type: ActionTypes.DELETE_BUCKET,
    payload: deleteData(`${ActionTypes.s3UsersUrl()}/${bucket.s3user_name}/buckets/${bucket.bucket_name}`, {}, {})
});

export const editBucket = (name, payload) => ({
    type: ActionTypes.DELETE_BUCKET,
    payload: createData(`${ActionTypes.s3UsersUrl()}/${name}/buckets/${payload.bucket_name}`, payload, {})
});

export const createBucketAndFetch = (name, payload) => {
    return (dispatch) => {
        const response = dispatch(createBucket(name, payload));

        response.then(() => {
            dispatch(fetchBuckets(name));
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const editBucketAndFetch = (name, payload) => {
    return (dispatch) => {
        const response = dispatch(editBucket(name, payload));

        response.then(() => {
            dispatch(fetchBuckets(name));
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const deleteBucketAndFetch = (bucket) => {
    return (dispatch) => {
        const response = dispatch(deleteBucket(bucket));

        response.then(() => {
            dispatch(fetchBuckets(bucket.s3user_name));
            successNotification('');
        }, error => errorNotification(error.response.data.explanation));
    };
};

export const updateUser = (newUser) => ({
    type: ActionTypes.USER_UPDATE,
    payload: newUser
});

export const changeLang = (lang) => ({
    type: ActionTypes.CHANGE_LANG,
    payload: lang
});
