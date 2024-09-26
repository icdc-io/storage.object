import * as ActionTypes from './AppConstants';
import { fetchData, createData, deleteData, updateData } from 'container/Api';
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

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorNotification = (msg) => cogoToast.error(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error + msg, notificationOptions);
const successNotification = (msg) => cogoToast.success(notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

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

export const editS3user = (user_id, payload) => ({
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

export const lockS3user = (user_id, payload) => ({
    type: ActionTypes.S3_USER_LOCK,
    payload: updateData(`${ActionTypes.s3UserUrl()}/${user_id}/lock`, payload)
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
    }, error => errorNotification(error.response.data));
}

//S3_QUOTAS
export const createS3quotasActionAndFetch = (payload) => {
    return (dispatch) => {
        const response = dispatch(createS3quota(payload));

        response.then(() => {
            dispatch(fetchS3quotas());
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const editS3quotaAndFetch = (quota_id, payload) => {
    return (dispatch) => {
        const response = dispatch(updateS3quota(quota_id, payload));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

//S3_USER
export const createS3userAndFetch = (payload) => {
    return (dispatch) => {
        const response = dispatch(createS3user(payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const editS3userAndFetch = (user_id, payload, resourcesTab) => {
    return (dispatch) => {
        const response = dispatch(editS3user(user_id, payload));

        response.then(() => {
            if(resourcesTab) {
                dispatch(fetchS3User(user_id))
            } else {
                dispatch(fetchS3Users());
                dispatch(fetchS3quotas());
            }
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const deleteS3userAndFetch = (user_id) => {
    return (dispatch) => {
        const response = dispatch(deleteS3user(user_id));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const actionAndFetch = (action, payload) => {
    return (dispatch) => {
        const response = dispatch(action(payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const lockS3userAndFetch = (user_id, payload) => {
    return (dispatch) => {
        const response = dispatch(lockS3user(user_id, payload));

        response.then(() => {
            dispatch(fetchS3Users());
            dispatch(fetchS3quotas());
            dispatch(fetchS3User(user_id));
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

// buckets actions

export const fetchBuckets = (user_id) => ({
    type: ActionTypes.BUCKETS_FETCH,
    payload: fetchData(`${ActionTypes.s3UserUrl()}/${user_id}/buckets`)
});

export const createBucket = (user_id, payload) => ({
    type: ActionTypes.CREATE_BUCKET,
    payload: createData(`${ActionTypes.s3UserUrl()}/${user_id}/buckets`, payload)
});

export const deleteBucket = (bucket_name) => ({
    type: ActionTypes.DELETE_BUCKET,
    payload: deleteData(`${ActionTypes.bucketsUrl()}?bucket_name=${bucket_name}`, {})
});

export const editBucket = (payload) => ({
    type: ActionTypes.DELETE_BUCKET,
    payload: updateData(`${ActionTypes.bucketsUrl()}?bucket_name=${payload.bucket_name}`, payload)
});

export const createBucketAndFetch = (user_id, payload) => {
    return (dispatch) => {
        const response = dispatch(createBucket(user_id, payload));

        response.then(() => {
            dispatch(fetchBuckets(user_id));
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const editBucketAndFetch = (user_id, payload) => {
    return (dispatch) => {
        const response = dispatch(editBucket(payload));

        response.then(() => {
            dispatch(fetchBuckets(user_id));
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, error => errorNotification(error.response.data));
    };
};

export const deleteBucketAndFetch = (user_id, options) => {
    return (dispatch) => {
        const response = dispatch(deleteBucket(options));

        response.then(() => {
            dispatch(fetchBuckets(user_id));
            dispatch(fetchS3User(user_id))
            successNotification('');
        }, error => errorNotification(error.response.data));
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
