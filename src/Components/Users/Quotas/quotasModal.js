
/* eslint-disable camelcase */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Header, Button, Dropdown } from 'semantic-ui-react';
import { reset } from 'redux-form';
import PropTypes from 'prop-types';
import { actionAndFetch, createS3quotasActionAndFetch, editS3userAndFetch } from '../../../AppActions';
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
        storageType: item.pool.id,
        space: item.data_size_mb,
        bucketsUser: item.buckets_per_users,
        objects: item.objects,
        users: item.users

    }
);

const QuotasModal = ({ quota, edit, t }) => {
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
                // dispatch(editS3userAndFetch(user.s3user_name, payload));
            } else {
                dispatch(actionAndFetch(createS3quotasActionAndFetch, payload));
            }

            dispatch(reset('createS3quota'));
        },
        [handleClose, edit, quota, dispatch]
    );

    return  userRole !== BILLING_USER_NAME && <React.Fragment>
        {
            edit ? <Button
            onClick={() => setOpen(true)}
            // disabled={itemsFetchStatus !== 'fulfilled'}
            content={t('edit')}
            primary
            basic
        /> :
                <Button
                    onClick={() => setOpen(true)}
                    // disabled={itemsFetchStatus !== 'fulfilled'}
                    content={t('addQuota')} icon='plus'
                    labelPosition='left'
                    primary
                />
        }
        <Modal open={open} size="tiny" onSubmit={onSubmit}>
            <Header content={edit ? t('editQuota') : t('addQuota')} />
            <Modal.Content>

                {
                    // eslint-disable-next-line max-len
                    edit ? <QuotasForm t={t} open={open} handleClose={handleClose} onSubmit={onSubmit} initialValues={mapApiToProps(quota)} edit={edit} isAdmin={userRole === 'admin'} pools={pools}/> :
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
