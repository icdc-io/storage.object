
/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Header, Button, Dropdown } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { createBucketAndFetch, editBucketAndFetch } from '../../../AppActions';
import { BILLING_USER_NAME } from '../../../AppConstants';
import BucketForm from './bucketForm';

const mapPropsToApi = (item) => (
    {
        bucket_name: item.name,
        data_size_mb_quota: +item.storageSizeLimit,
        number_of_objects_quota: +item.objectsLimit
    }
);

const mapApiToProps = (item) => (
    {
        name: item.bucket_name,
        storageSizeLimit: item.storage_size.limit,
        objectsLimit: item.objects.limit
    }
);

const BucketModal = ({ t, bucket, edit }) => {
    const dispatch = useDispatch();
    const s3user = useSelector(state => state.AmazonStore.s3user);
    const userRole = useSelector(state => state.host.user.role);

    const [open, setOpen] = useState(false);

    const handleClose = useCallback(
        () => {
            setOpen(false);
            dispatch(reset('createBucket'));
        },
        [setOpen, dispatch]
    );

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);

            if (edit) {
                dispatch(editBucketAndFetch(s3user.id, { ...payload, user_name: s3user.username } ));
            } else {
                dispatch(createBucketAndFetch(s3user.id, payload));
            }

            dispatch(reset('createBucket'));
        },
        [handleClose, edit, s3user, dispatch]
    );

    return userRole !== BILLING_USER_NAME && <React.Fragment>
        {
            edit ? <Dropdown.Item icon='pencil alternate' text={t('edit')} onClick={() => setOpen(true)} disabled={s3user.is_locked}/> :
                <Button
                    onClick={() => setOpen(true)}
                    content={t('addBucket')} icon='plus'
                    labelPosition='left'
                    primary
                    disabled={s3user.is_locked}
                />
        }
        <Modal open={open} size="tiny" onSubmit={onSubmit}>
            <Header content={edit ? t('bucketEdit') : t('createBucket')} />
            <Modal.Content>
                {
                    edit ? <BucketForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} initialValues={mapApiToProps(bucket)} edit={edit}/> :
                        <BucketForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} />
                }
            </Modal.Content>
        </Modal>
    </React.Fragment>;
};

BucketModal.propTypes = {
    bucket: PropTypes.object,
    edit: PropTypes.bool,
    t: PropTypes.func
};

export default BucketModal;
