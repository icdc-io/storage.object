/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { actionAndFetch, editS3user } from '../../../AppActions';
import { BILLING_USER_NAME } from '../../../AppConstants';
import EditResForm from './editResForm';

const EditResModal = ({ t, s3user, name, label }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const userRole = useSelector((state) => state.host.user.role);
    const currentOwner = useSelector((state) => state.host.user.email);
    const quotas = useSelector((state) => state.AmazonStore.s3quotas);

    const userPool = quotas.find((quota) => quota.pool.id === s3user.pool.id);

    const initLimits = {
        storageSizeLimit: userPool.limits.data_size_mb - userPool.usage.data_size_mb - s3user.usage.data_size_mb,
        objectsLimit: userPool.limits.objects - userPool.usage.objects - s3user.usage.objects,
        bucketsLimit: userPool.limits.buckets - userPool.usage.buckets - s3user.usage.buckets,
    };

    const [limits, setLimits] = useState(initLimits);

    const mapPropsToApi = (item) => ({
        description: item.description,
        owner: item.owner || currentOwner,
        quota: {
            data_size_mb: +item.storageSizeLimit,
            objects: +item.objectsLimit,
            buckets: +item.bucketsLimit,
        },
    });
    
    const mapApiToProps = (item) => ({
        name: item.name,
        description: item.description,
        default_placement: item.pool.id,
        storageSizeLimit: item.user_quota.data_size_mb || 0,
        objectsLimit: item.user_quota.objects || 0,
        bucketsLimit: +item.user_quota.buckets || 0,
        owner: item.owner,
    });

    const handleClose = useCallback(() => {
        setOpen(false);
        dispatch(reset('editResForm'));
    }, [setOpen, dispatch]);

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);

            dispatch(actionAndFetch(editS3user, {user_id: s3user.id, payload}));
            dispatch(reset('editResForm'));
        },
        [handleClose, dispatch, s3user]
    );

    return (
        userRole !== BILLING_USER_NAME && (
            <React.Fragment>
                <Button onClick={() => setOpen(true)} disabled={s3user.is_locked}>{t('edit')}</Button>
                <Modal open={open} size="tiny" onSubmit={onSubmit}>
                    <Header content={label} />
                    <Modal.Content>
                        <EditResForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} name={name} initialValues={mapApiToProps(s3user)} limits={limits} />
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
