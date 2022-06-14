
/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Dropdown } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { actionAndFetch, createS3user, editS3userAndFetch } from '../../AppActions';
import { BILLING_USER_NAME } from '../../AppConstants';
import UserForm from './userForm';

const mapPropsToApi = (item) => (
    {
        s3user_name: item.name,
        s3user_description: item.description,
        quota_per_s3user: {
            data_size_mb: item.storageSizeLimit,
            number_of_buckets: item.bucketsLimit,
            number_of_objects: item.objectsLimit
        },
        default_quota_per_bucket: {
            data_size_mb: item.storageInBucketLimit,
            number_of_objects: item.objectsInBucketLimit
        },
        owner: item.owner || ''
    }
);

const mapApiToProps = (item) => (
    {
        name: item.s3user_name,
        description: item.s3user_description,

        storageSizeLimit: item.quota_per_s3user.data_size_mb,
        bucketsLimit: item.quota_per_s3user.number_of_buckets,
        objectsLimit: item.quota_per_s3user.number_of_objects,

        storageInBucketLimit: item.default_quota_per_bucket.data_size_mb,
        objectsInBucketLimit: item.default_quota_per_bucket.number_of_objects,
        owner: item.owner
    }
);

const UserModal = ({ user, edit, t }) => {
    const userRole = useSelector(state => state.host.user.role);

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(
        () => {
            setOpen(false);
            dispatch(reset('createS3user'));
        },
        [setOpen, dispatch]
    );

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);

            if (edit) {
                dispatch(editS3userAndFetch(user.s3user_name, payload));
            } else {
                dispatch(actionAndFetch(createS3user, payload));
            }

            dispatch(reset('createS3user'));
        },
        [handleClose, edit, user, dispatch]
    );

    return  userRole !== BILLING_USER_NAME && <React.Fragment>
        {
            edit ? <Dropdown.Item icon='pencil alternate' text={t('edit')} onClick={() => setOpen(true)} /> :
                <Button
                    onClick={() => setOpen(true)}
                    // disabled={itemsFetchStatus !== 'fulfilled'}
                    content={t('createS3user')} icon='plus'
                    labelPosition='left'
                    primary
                />
        }
        <Modal open={open} size="tiny" onSubmit={onSubmit}>
            <Header content={edit ? t('editS3user') : t('createS3user')} />
            <Modal.Content>

                {
                    // eslint-disable-next-line max-len
                    edit ? <UserForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} initialValues={mapApiToProps(user)} edit={edit} isAdmin={userRole === 'admin'} /> :
                        <UserForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} isAdmin={userRole === 'admin'} />
                }

            </Modal.Content>
        </Modal>
    </React.Fragment>;
};

UserModal.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.bool,
    t: PropTypes.func
};

export default UserModal;
