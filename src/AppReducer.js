/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';

import Immutable from 'seamless-immutable';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    // info: [],
    // iscsi_info: [],
    pools: [],
    s3users: [],
    s3quotas: [],
    poolsFetchStatus: '',
    s3quotasFetchStatus: '',
    s3usersFetchStatus: '',
    s3usersCreateStatus: '',
    s3userFetchStatus: '',
    s3user: {},
    bucketsFetchStatus: '',
    buckets: [],
    lang: 'en',
    user: {}
});

export let errorMessage = '';

export const AmazonStore = (state = initialState, action) => {
    switch (action.type) {
    // fetch all s3 users
    case `${ActionTypes.S3_USERS_FETCH}_PENDING`:
        return state.set('s3usersFetchStatus', 'pending');
    case `${ActionTypes.S3_USERS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            s3users: action.payload,
            s3usersFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.S3_USERS_FETCH}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('s3usersFetchStatus', 'rejected');

    // fetch quotas
    case `${ActionTypes.FETCH_S3_QUOTAS}_PENDING`:
        return state.set('s3quotasFetchStatus', 'pending');
    case `${ActionTypes.FETCH_S3_QUOTAS}_FULFILLED`:
        return Immutable.merge(state, {
            s3quotas: action.payload,
            s3quotasFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.FETCH_S3_QUOTAS}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('s3quotasFetchStatus', 'rejected');

    // fetch pools
    case `${ActionTypes.POOLS_FETCH}_PENDING`:
        return state.set('poolsFetchStatus', 'pending');
    case `${ActionTypes.POOLS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            pools: action.payload,
            poolsFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.POOLS_FETCH}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('poolsFetchStatus', 'rejected');

    // create s3 user
    case `${ActionTypes.CREATE_S3_USER}_PENDING`:
        return state.set('s3usersCreateStatus', 'pending');
    case `${ActionTypes.CREATE_S3_USER}_FULFILLED`:
        return Immutable.merge(state, {
            createdS3user: action.payload,
            s3usersCreateStatus: 'fulfilled'
        });
    case `${ActionTypes.CREATE_S3_USER}_REJECTED`:
        return state.set('s3usersCreateStatus', 'rejected');

    // fetch single s3 user
    case `${ActionTypes.S3_USER_FETCH}_PENDING`:
        return state.set('s3userFetchStatus', 'pending');
    case `${ActionTypes.S3_USER_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            s3user: action.payload,
            s3userFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.S3_USER_FETCH}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('s3userFetchStatus', 'rejected');
    case ActionTypes.CLEAR_S3_USER_FETCH_STATUS:
        return state.set('s3userFetchStatus', '');

    // edit single s3 user
    case `${ActionTypes.EDIT_S3_USER}_FULFILLED`:
        return Immutable.merge(state, {
            s3user: action.payload
        });

    // genereate new keys
    case `${ActionTypes.S3_USER_GENERATE_KEYS}_FULFILLED`:
        return Immutable.merge(state, {
            s3user: action.payload
        });

    // fetch all s3 user buckets
    case `${ActionTypes.BUCKETS_FETCH}_PENDING`:
        return state.set('bucketsFetchStatus', 'pending');
    case `${ActionTypes.BUCKETS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            buckets: action.payload.data,
            bucketsFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.BUCKETS_FETCH}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('bucketsFetchStatus', 'rejected');

    // info
    // case `${ActionTypes.INFO_FETCH}_FULFILLED`:
    //     return Immutable.merge(state, {
    //         info: [
    //             {
    //                 name: 's3swiftUsers',
    //                 data: {
    //                     used: action.payload.number_of_created_s3users,
    //                     total: action.payload.account_quota.number_of_s3users
    //                 }
    //             },
    //             {
    //                 name: 'space',
    //                 data: {
    //                     used: action.payload.allocated_quota.data_size_mb,
    //                     total: action.payload.account_quota.data_size_mb
    //                 }
    //             },
    //             {
    //                 name: 'objects',
    //                 data: {
    //                     used: action.payload.allocated_quota.number_of_objects,
    //                     total: action.payload.account_quota.number_of_objects
    //                 }
    //             },
    //             {
    //                 name: 'bucketsUser',
    //                 data: {
    //                     // used: action.payload.allocated_quota.number_of_objects,
    //                     total: action.payload.account_quota.number_of_buckets_per_s3user
    //                 }
    //             },
    //             {
    //                 name: 's3Endpoints',
    //                 data: {
    //                     s3Endpoints: action.payload.s3_endpoints
    //                 }
    //             }
    //         ]
    //     });

    // // iscsi info
    // case `${ActionTypes.ISCSI_INFO_FETCH}_FULFILLED`:
    //     return Immutable.merge(state, {
    //         iscsi_info: [
    //             {
    //                 name: 'disks',
    //                 data: {
    //                     used: action.payload.allocated_resources.number_of_disks,
    //                     total: action.payload.account_quota.number_of_disks
    //                 },
    //                 isChap: action.payload.chap_auth_required
    //             },
    //             {
    //                 name: 'diskSpace',
    //                 data: {
    //                     used: action.payload.allocated_resources.storage_size_gb,
    //                     total: action.payload.account_quota.storage_size_gb
    //                 }
    //             },
    //             {
    //                 name: 'clients',
    //                 data: {
    //                     used: action.payload.allocated_resources.number_of_clients,
    //                     total: action.payload.account_quota.number_of_clients
    //                 }
    //             },
    //             {
    //                 name: 'iscsiPortals',
    //                 data: {
    //                     list: action.payload.portals
    //                 }
    //             }
    //         ]
    //     });

    case ActionTypes.USER_UPDATE:
        return state.set('user', action.payload);

    case ActionTypes.CHANGE_LANG:
        return state.set('lang', action.payload);

    default:
        return Immutable.merge(state, {});
    }
};
