export const BILLING_USER_NAME = 'billing';
export const EMPTY_VALUE = String.fromCharCode(8212);

export const S3_USERS_FETCH = 'S3_USERS_FETCH';
export const CREATE_S3_USER = 'CREATE_S3_USER';
export const DELETE_S3_USER = 'DELETE_S3_USER';
export const EDIT_S3_USER = 'EDIT_S3_USER';
export const S3_USER_FETCH = 'S3_USER_FETCH';
export const S3_USER_LOCK = 'S3_USER_LOCK';
export const S3_USER_UNLOCK = 'S3_USER_UNLOCK';
export const S3_USER_GENERATE_KEYS = 'S3_USER_GENERATE_KEYS';
export const CLEAR_S3_USER_FETCH_STATUS = 'CLEAR_S3_USER_FETCH_STATUS';

export const BUCKETS_FETCH = 'BUCKETS_FETCH';
export const CREATE_BUCKET = 'CREATE_BUCKET';
export const DELETE_BUCKET = 'DELETE_BUCKET';
export const EDIT_BUCKET = 'EDIT_BUCKET';

export const INFO_FETCH = 'INFO_FETCH';
export const ISCSI_INFO_FETCH = 'ISCSI_INFO_FETCH';

export const ISCSI_DISKS_FETCH = 'ISCSI_DISKS_FETCH';
export const CREATE_ISCSI_DISK = 'CREATE_ISCSI_DISK';
export const DELETE_ISCSI_DISK = 'DELETE_ISCSI_DISK';
export const EDIT_ISCSI_DISK = 'EDIT_ISCSI_DISK';
export const CREATE_ISCSI_DISK_FROM_SNAPSHOT = 'CREATE_ISCSI_DISK_FROM_SNAPSHOT';

export const ISCSI_CLIENTS_FETCH = 'ISCSI_CLIENTS_FETCH';
export const CREATE_ISCSI_CLIENT = 'CREATE_ISCSI_CLIENT';
export const DELETE_ISCSI_CLIENT = 'DELETE_ISCSI_CLIENT';
export const EDIT_ISCSI_CLIENT = 'EDIT_ISCSI_CLIENT';

export const SNAPSHOT_INFO_FETCH = 'SNAPSHOT_INFO_FETCH';
export const SNAPSHOT_FETCH_INFO = 'SNAPSHOT_FETCH_INFO';
export const CREATE_SNAPSHOT = 'CREATE_SNAPSHOT';
export const DELETE_SNAPSHOT = 'DELETE_SNAPSHOT';
export const EDIT_SNAPSHOT = 'EDIT_SNAPSHOT';

export const BASE_URL = '/api/storage/v1';

export const s3UsersUrl = () => `${BASE_URL}/s3/{account}/s3users`;
export const infoUrl = () => `${BASE_URL}/s3/{account}/account_quota_info`;
export const iscsiInfoUrl = () => `${BASE_URL}/iscsi/{account}/account_info`;
export const iscsiDisksUrl = () => `${BASE_URL}/iscsi/{account}/disks`;
export const iscsiClientsUrl = () => `${BASE_URL}/iscsi/{account}/clients`;
export const snapshotsUrl = (disk) => `${BASE_URL}/iscsi/{account}/disks/${disk}/snapshots`;
export const createDiskFromSnapshotUrl = (disk, snapshot) => `${BASE_URL}/iscsi/{account}/disks/${disk}/snapshots/${snapshot}/create_disk`;

export const USER_UPDATE = 'USER_UPDATE';
export const CHANGE_LANG = 'CHANGE_LANG';

export const intersperse = (arr, sep) => {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(function(xs, x) {
        return xs.concat([sep, x]);
    }, [arr[0]]);
};
