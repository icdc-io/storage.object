
/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Dropdown } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { actionAndFetch, createS3quota, editS3userAndFetch } from '../../../AppActions';
import { BILLING_USER_NAME } from '../../../AppConstants';
import QuotasForm from './quotasForm';


const mapPropsToApi = (item) => (
    {
        objects: +item.objects,
        data_size_mb: +item.space,
        buckets_per_users: +item.bucketsUser,
        users: +item.users,
        pool_id: +item.storageType
    }
);

const mapApiToProps = (item) => (
    {
        name: item.name,
        description: item.description,

        storageSizeLimit: item.stats.storage_size.limit,
        bucketsLimit: item.stats.buckets.limit,
        objectsLimit: item.stats.objects.limit,

        // storageInBucketLimit: item.default_quota_per_bucket.data_size_mb,
        // objectsInBucketLimit: item.default_quota_per_bucket.number_of_objects,
        owner: item.owner
    }
);

const QuotasModal = ({ user, edit, t }) => {
    const userRole = useSelector(state => state.host.user.role);
    const pools = useSelector(state => state.AmazonStore.pools);

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(
        () => {
            setOpen(false);
            dispatch(reset('createS3quota'));
        },
        [setOpen, dispatch]
    );

    const onSubmit = useCallback(
        (values) => {
            handleClose();

            let payload = mapPropsToApi(values);
            console.log(payload)
            if (edit) {
                dispatch(editS3userAndFetch(user.s3user_name, payload));
            } else {
                dispatch(actionAndFetch(createS3quota, payload));
            }

            dispatch(reset('createS3quota'));
        },
        [handleClose, edit, user, dispatch]
    );

    return  userRole !== BILLING_USER_NAME && <React.Fragment>
        {
            edit ? <Dropdown.Item icon='pencil alternate' text={t('edit')} onClick={() => setOpen(true)} /> :
                <Button
                    onClick={() => setOpen(true)}
                    // disabled={itemsFetchStatus !== 'fulfilled'}
                    content={t('setQuota')} icon='plus'
                    labelPosition='left'
                    primary
                />
        }
        <Modal open={open} size="tiny" onSubmit={onSubmit}>
            <Header content={edit ? t('editS3user') : t('setQuota')} />
            <Modal.Content>

                {
                    // eslint-disable-next-line max-len
                    edit ? <QuotasForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} initialValues={mapApiToProps(user)} edit={edit} isAdmin={userRole === 'admin'} pools={pools}/> :
                        <QuotasForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} isAdmin={userRole === 'admin'} pools={pools}/>
                }

            </Modal.Content>
        </Modal>
    </React.Fragment>;
};

QuotasModal.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.bool,
    t: PropTypes.func
};

export default QuotasModal;
