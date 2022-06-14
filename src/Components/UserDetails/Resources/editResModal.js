
/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { editS3userAndFetch } from '../../../AppActions';
import { BILLING_USER_NAME } from '../../../AppConstants';
import EditResForm from './editResForm';

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
        }
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
        objectsInBucketLimit: item.default_quota_per_bucket.number_of_objects
    }
);

const EditResModal = ({ t, s3user, name, label }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const userRole = useSelector(state => state.host.user.role);

    const handleClose = useCallback(
        () => {
            setOpen(false);
            dispatch(reset('editResForm'));
        },
        [setOpen, dispatch]
    );

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);

            dispatch(editS3userAndFetch(s3user.s3user_name, payload));
            dispatch(reset('editResForm'));
        },
        [handleClose, dispatch, s3user]
    );

    return userRole !== BILLING_USER_NAME && <React.Fragment>
        <Button icon onClick={() => setOpen(true)} ><Icon name='cog' ></Icon></Button>
        <Modal open={open} size="tiny" onSubmit={onSubmit}>
            <Header content={label} />
            <Modal.Content>
                <EditResForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} name={name} initialValues={mapApiToProps(s3user)}/>
            </Modal.Content>
        </Modal>
    </React.Fragment>;
};

EditResModal.propTypes = {
    s3user: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.string,
    t: PropTypes.func
};

export default EditResModal;
