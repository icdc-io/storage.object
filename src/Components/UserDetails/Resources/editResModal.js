/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { editS3userAndFetch } from '../../../AppActions';
import { BILLING_USER_NAME } from '../../../AppConstants';
import EditResForm from './editResForm';

const mapPropsToApi = (item) => ({
    description: item.description,
    owner: item.owner || '',
    limits: {
        storage_size: +item.storageSizeLimit,
        objects: +item.objectsLimit,
        max_buckets: +item.bucketsLimit,
        bucket_storage_size: +item.storageInBucketLimit,
        bucket_objects: +item.objectsInBucketLimit,
    },
});

const mapApiToProps = (item) => ({
    name: item.name,
    description: item.description,
    default_placement: item.default_placement?.id,
    storageSizeLimit: item.stats?.storage_size.limit || 0,
    objectsLimit: item.stats?.objects.limit || 0,
    bucketsLimit: +item.stats?.buckets.limit || 0,
    storageInBucketLimit: item.stats?.storage_bucket_limit,
    objectsInBucketLimit: item.stats?.object_bucket_limit,
    owner: item.owner,
});

const EditResModal = ({ t, s3user, name, label }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const userRole = useSelector((state) => state.host.user.role);

    const handleClose = useCallback(() => {
        setOpen(false);
        dispatch(reset('editResForm'));
    }, [setOpen, dispatch]);

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);

            dispatch(editS3userAndFetch(s3user.id, payload, true));
            dispatch(reset('editResForm'));
        },
        [handleClose, dispatch, s3user]
    );

    return (
        userRole !== BILLING_USER_NAME && (
            <React.Fragment>
                <Button onClick={() => setOpen(true)}>{t('edit')}</Button>
                <Modal open={open} size="tiny" onSubmit={onSubmit}>
                    <Header content={label} />
                    <Modal.Content>
                        <EditResForm
                            t={t}
                            open={open}
                            handleClose={handleClose}
                            onSubmit={onSubmit}
                            name={name}
                            initialValues={mapApiToProps(s3user)}
                        />
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    );
};

EditResModal.propTypes = {
    s3user: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.string,
    t: PropTypes.func,
};

export default EditResModal;
