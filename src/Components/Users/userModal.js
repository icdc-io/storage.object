/* eslint-disable camelcase */

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Header, Button, Dropdown } from "semantic-ui-react";
import { reset } from "redux-form";
import PropTypes from "prop-types";
import { actionAndFetch, createS3user, editS3user, editS3userAndFetch } from "../../AppActions";
import { BILLING_USER_NAME } from "../../AppConstants";
import UserForm from "./userForm";
import { rolesWithAdminRights } from "container/roles";

const UserModal = ({ user, edit, t }) => {
    const userRole = useSelector((state) => state.host.user.role);
    const quotas = useSelector((state) => state.AmazonStore.s3quotas);
    const currentOwner = useSelector((state) => state.host.user.email);

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const initialValues = {
        storageSizeLimit: "1024",
        bucketsLimit: "5",
        objectsLimit: "5",
        storageType: quotas[0].pool.id,
    };

    const initLimits = {
        storageSizeLimit: quotas[0].stats.data_size_mb.limit - quotas[0].stats.data_size_mb.actual,
        objectsLimit: quotas[0].stats.objects.limit - quotas[0].stats.objects.actual,
        bucketsLimit: quotas[0].stats.buckets.limit - quotas[0].stats.buckets.actual,
    };

    const [limits, setLimits] = useState(initLimits);

    useEffect(() => {
        if (edit) {
            const userPool = quotas.find((quota) => quota.pool.id === user.pool.id);
            setLimits({
                storageSizeLimit: userPool.stats.data_size_mb.limit - userPool.stats.data_size_mb.actual - user.usage.data_size_mb,
                objectsLimit: userPool.stats.objects.limit - userPool.stats.objects.actual - user.usage.objects,
                bucketsLimit: userPool.stats.buckets.limit - userPool.stats.buckets.actual - user.usage.buckets,
            });
        } else {
            setLimits(initLimits);
        }
    }, [edit]);

    const mapPropsToApi = (item, edit) =>
        edit
            ? {
                  description: item.description,
                  owner: item.owner || currentOwner,
                  quota: {
                      data_size_mb: +item.storageSizeLimit,
                      objects: +item.objectsLimit,
                      buckets: +item.bucketsLimit,
                  },
              }
            : {
                  name: item.name,
                  description: item.description,
                  owner: item.owner || currentOwner,
                  pool_id: item.storageType,
                  quota: {
                      data_size_mb: +item.storageSizeLimit,
                      objects: +item.objectsLimit,
                      buckets: +item.bucketsLimit,
                  },
              };

    const mapApiToProps = (item) => ({
        name: item.name,
        description: item.description,
        default_placement: item.pool.id,
        storageSizeLimit: item.user_quota.data_size_mb || 0,
        objectsLimit: item.user_quota.objects || 0,
        bucketsLimit: item.user_quota.buckets || 0,
        owner: item.owner,
    });

    const handleClose = useCallback(() => {
        setOpen(false);
        dispatch(reset("createS3user"));
    }, [setOpen, dispatch]);

    const onSubmit = useCallback(
        (values) => {
            handleClose();
            let payload = mapPropsToApi(values, edit);
            if (edit) {
                dispatch(actionAndFetch(editS3user, {user_id: user.id, payload}));
            } else {
                dispatch(actionAndFetch(createS3user, payload));
            }

            dispatch(reset("createS3user"));
        },
        [handleClose, edit, user, dispatch]
    );

    return (
        userRole !== BILLING_USER_NAME && (
            <React.Fragment>
                {edit ? (
                    <Dropdown.Item icon="pencil alternate" text={t("edit")} onClick={() => setOpen(true)} />
                ) : (
                    <Button
                        onClick={() => setOpen(true)}
                        // disabled={itemsFetchStatus !== 'fulfilled'}
                        content={t("create")}
                        primary
                    />
                )}
                <Modal open={open} size="tiny" onSubmit={onSubmit}>
                    <Header content={edit ? t("editS3user") : t("createS3user")} />
                    <Modal.Content>
                        {
                            // eslint-disable-next-line max-len
                            edit ? (
                                <UserForm
                                    t={t}
                                    open={open}
                                    handleClose={handleClose}
                                    onSubmit={onSubmit}
                                    initialValues={mapApiToProps(user)}
                                    edit={edit}
                                    isAdmin={rolesWithAdminRights.includes(userRole)}
                                    pools={quotas}
                                    limits={limits}
                                    setLimits={setLimits}
                                />
                            ) : (
                                <UserForm
                                    t={t}
                                    open={open}
                                    handleClose={handleClose}
                                    onSubmit={onSubmit}
                                    isAdmin={rolesWithAdminRights.includes(userRole)}
                                    pools={quotas}
                                    initialValues={initialValues}
                                    limits={limits}
                                    setLimits={setLimits}
                                />
                            )
                        }
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    );
};

UserModal.propTypes = {
    user: PropTypes.object,
    edit: PropTypes.bool,
    t: PropTypes.func,
};

export default UserModal;
