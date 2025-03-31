/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';

import Immutable from 'seamless-immutable';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    pools: [],
    s3users: [],
    s3quotas: [],
    poolsFetchStatus: '',
    s3quotasFetchStatus: '',
    s3usersFetchStatus: '',
    s3usersCreateStatus: '',
    s3userFetchStatus: '',
    accountLimitsFetchStatus: '',
    accountLimits: [],
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
        errorMessage = action.payload.response.data?.explanation;
        return state.set('s3quotasFetchStatus', 'rejected');

    //fetch account quotas limits
    case `${ActionTypes.FETCH_S3_LIMITS}_PENDING`:
        return state.set('accountLimitsFetchStatus', 'pending');
    case `${ActionTypes.FETCH_S3_LIMITS}_FULFILLED`:
        return Immutable.merge(state, {
            accountLimits: action.payload,
            accountLimitsFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.FETCH_S3_LIMITS}_REJECTED`:
        errorMessage = action.payload.response.data?.explanation;
        return state.set('accountLimitsFetchStatus', 'rejected');

            
        
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

    case `${ActionTypes.UPDATE_S3_QUOTA}_FULFILLED`:
        return Immutable.merge(state, {
            s3quotas: state.s3quotas.map(el => el.id === action.payload.id ? action.payload : el),
        });
            
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

    //lock editing
    case `${ActionTypes.S3_USER_LOCK}_FULFILLED`:
        return Immutable.merge(state, {
            s3users: state.s3users.map(user => user.id === action.payload.id ? action.payload : user),
            s3user: state.s3user?.id === action.payload.id ? action.payload : state.s3user
        });


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

    // fetch all s3 user buckets
    case `${ActionTypes.BUCKETS_FETCH}_PENDING`:
        return state.set('bucketsFetchStatus', 'pending');
    case `${ActionTypes.BUCKETS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            buckets: action.payload,
            bucketsFetchStatus: 'fulfilled'
        });
    case `${ActionTypes.BUCKETS_FETCH}_REJECTED`:
        errorMessage = action.payload.response.data.explanation;
        return state.set('bucketsFetchStatus', 'rejected');

    case ActionTypes.USER_UPDATE:
        return state.set('user', action.payload);

    case ActionTypes.CHANGE_LANG:
        return state.set('lang', action.payload);

    default:
        return Immutable.merge(state, {});
    }
};
