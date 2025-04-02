import cogoToast from 'cogo-toast';
import { createData, deleteData, fetchData, updateData } from 'container/Api';
import * as ActionTypes from './AppConstants';

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

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorNotification = (msg) => cogoToast.error(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error + msg, notificationOptions);
const successNotification = (msg) => cogoToast.success(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

const handleErrorsMessages = error => {
    let errorMessage = error.response.data.message;
    const errors = error.response.data.errors;

    if(errors && Object.keys(errors).length > 0) {

        errorMessage = Object.values(errors).join(" ")
    }
    errorNotification(errorMessage)};


// const checkErrorCodes = (item) => {
//     switch (item.status) {
//     case 422:
//         return errorNotification(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].deleteDiskError);
//     case 500:
//         return errorNotification(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].processError);
//     default:
//         return errorNotification(item.data);
//     }
// };

// s3 users actions

export const createS3user = (payload) => ({
    type: ActionTypes.CREATE_S3_USER,
    payload: createData(ActionTypes.s3UsersUrl(), payload)
});

export const fetchS3Users = (options) => ({
    type: ActionTypes.S3_USERS_FETCH,
    payload: fetchData(ActionTypes.s3UsersUrl(), {}, options)
});

export const fetchPools = (options) => ({
    type: ActionTypes.POOLS_FETCH,
    payload: fetchData(ActionTypes.poolsUrl(), {}, options)
});

export const fetchS3Limits = (account) => ({
    type: ActionTypes.FETCH_S3_LIMITS,
    payload: fetchData(ActionTypes.s3LimitsUrl(account))
});

export const fetchS3quotas = (options) => ({
    type: ActionTypes.FETCH_S3_QUOTAS,
    payload: fetchData(ActionTypes.s3QuotasUrl(), options)
});

export const createS3quota = (payload) => ({
    type: ActionTypes.CREATE_S3_QUOTA,
    payload: createData(ActionTypes.s3QuotasUrl(), payload)
});

export const updateS3quota = (quota_id, payload) => ({
    type: ActionTypes.UPDATE_S3_QUOTA,
    payload: updateData(ActionTypes.s3QuotaUrl(quota_id), payload)
});

export const deleteS3user = (user_id) => ({
    type: ActionTypes.DELETE_S3_USER,
    payload: deleteData(`${ActionTypes.s3UserUrl()}/${user_id}`)
});

export const editS3user = ({user_id, payload}) => ({
    type: ActionTypes.EDIT_S3_USER,
    payload: updateData(`${ActionTypes.s3UserUrl()}/${user_id}`, payload)
});

export const fetchS3User = (user_id) => ({
    type: ActionTypes.S3_USER_FETCH,
    payload: fetchData(`${ActionTypes.s3UserUrl()}/${user_id}`)
});

export const clearS3UserFetchStatus = () => ({
    type: ActionTypes.CLEAR_S3_USER_FETCH_STATUS
});

export const lockS3userAC = (user_id, payload) => ({
    type: ActionTypes.S3_USER_LOCK,
    payload: updateData(`${ActionTypes.s3UserUrl()}/${user_id}`, payload)
});

const generateKeysAC = (user_id) => ({
    type: ActionTypes.S3_USER_GENERATE_KEYS,
    payload: createData(`${ActionTypes.s3UserUrl()}/${user_id}/keys`)
});

export const generateKeys = (user_id) => dispatch => {
    const response = dispatch(generateKeysAC(user_id))

    response.then(() => {
        dispatch(fetchS3User(user_id));
        successNotification('');
    }, handleErrorsMessages);
}

//S3_QUOTAS
export const createS3quotasActionAndFetch = (payload) => {
    return (dispatch) => {
        const response = dispatch(createS3quota(payload));

        response.then(() => {
            dispatch(fetchS3quotas());
            successNotification('');
        }, handleErrorsMessages);
    };
};

export const editS3quotaAndFetch = (quota_id, payload) => {
    return (dispatch) => {
        const response = dispatch(updateS3quota(quota_id, payload));

        response.then(() => {
            successNotification('');
        }, handleErrorsMessages);
    };
};

//S3_USER

export const deleteS3userAndFetch = (user_id) => {
    return (dispatch) => {
        const response = dispatch(deleteS3user(user_id));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            successNotification('');
        }, handleErrorsMessages);
    };
};

export const actionAndFetch = (action, payload) => {
    return (dispatch) => {
        const response = dispatch(action(payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            successNotification('');
        }, handleErrorsMessages);
    };
};

export const lockS3user = (user_id, payload) => {
    return (dispatch) => {
        const response = dispatch(lockS3userAC(user_id, payload));

        response.then(() => {
            successNotification('');
        }, handleErrorsMessages);
    };
};

// buckets actions

export const fetchBuckets = (username) => ({
    type: ActionTypes.BUCKETS_FETCH,
    payload: fetchData(`${ActionTypes.bucketsUrl()}?filter[user_name]=${username}`)
});

export const createBucket = (payload) => ({
    type: ActionTypes.CREATE_BUCKET,
    payload: createData(ActionTypes.bucketsUrl(), payload)
});

export const deleteBucket = (path) => ({
    type: ActionTypes.DELETE_BUCKET,
    payload: deleteData(`${ActionTypes.bucketsUrl()}/${path}`, {})
});

export const editBucket = (path, payload) => ({
    type: ActionTypes.EDIT_BUCKET,
    payload: updateData(`${ActionTypes.bucketsUrl()}/${path}`, payload)
});

export const createBucketAndFetch = (user_id, payload) => {
    return (dispatch) => {
        const response = dispatch(createBucket(payload));

        response.then(() => {
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, handleErrorsMessages);
    };
};

export const editBucketAndFetch = (user_id, path, payload) => {
    return (dispatch) => {
        const response = dispatch(editBucket(path, payload));

        response.then(() => {
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, handleErrorsMessages);
    };
};

export const deleteBucketAndFetch = (user_id, path) => {
    return (dispatch) => {
        const response = dispatch(deleteBucket(path));

        response.then(() => {
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, handleErrorsMessages);
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
