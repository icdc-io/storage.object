/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Header, Button, Icon, Popup } from "semantic-ui-react";
import { reset } from "redux-form";
import PropTypes from "prop-types";
import { actionAndFetch, createS3quotasActionAndFetch, editS3quotaAndFetch, fetchPools } from "../../../AppActions";
import { BILLING_USER_NAME } from "../../../AppConstants";
import QuotasForm from "./quotasForm";
import { mapPoolToDiskTypeOptions, mapQuotasToDiskType } from "../../../utils/mappers";
import { filterFreeDiskTypes } from "../../../utils/filterFreeQuotas";
import { rolesWithAdminRights } from "container/roles";

const mapPropsToApi = (item, edit) =>
    edit
        ? {
              objects: +item.objects,
              data_size_mb: +item.space,
              buckets: +item.buckets,
              users: +item.users,
          }
        : {
              objects: +item.objects,
              data_size_mb: +item.space,
              buckets: +item.buckets,
              users: +item.users,
              pool_id: +item.storageType,
          };

const mapApiToProps = (item) => ({
    storageType: item.pool.id,
    space: item.stats.data_size_mb.limit,
    buckets: item.buckets,
    objects: item.stats.objects.limit,
    users: item.stats.users.limit,
});

const QuotasModal = ({ quota, edit, t }) => {
    const userRole = useSelector((state) => state.host.user.role);
    const pools = useSelector((state) => state.AmazonStore.pools);
    const quotas = useSelector((state) => state.AmazonStore.s3quotas);

    const availableQuotas = pools.map(mapPoolToDiskTypeOptions).map((diskOption) => ({
        ...diskOption,
        isFree: !quotas.map(mapQuotasToDiskType).includes(diskOption.text),
    }));

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
        dispatch(reset("createS3quota"));
    }, [setOpen, dispatch]);

    const onSubmit = useCallback(
        (values) => {
            handleClose();
            let payload = mapPropsToApi(values, edit);
            if (edit) {
                dispatch(editS3quotaAndFetch(quota.id, payload));
            } else {
                dispatch(actionAndFetch(createS3quotasActionAndFetch, payload));
            }
            dispatch(reset("createS3quota"));
        },
        [handleClose, edit, quota, dispatch]
    );

    return (
        userRole !== BILLING_USER_NAME && (
            <React.Fragment>
                {edit ? (
                    <Button
                        onClick={() => setOpen(true)}
                        // disabled={itemsFetchStatus !== 'fulfilled'}
                        content={t("edit")}
                        primary
                        basic
                    />
                ) : filterFreeDiskTypes(availableQuotas).length ? (
                    <Button
                        onClick={() => setOpen(true)}
                        // disabled={itemsFetchStatus !== 'fulfilled'}
                        content={t("addQuota")}
                        primary
                    />
                ) : (
                    <Popup
                        on="hover"
                        pinned
                        trigger={
                            <Button className="disabled-btn " primary size="medium">
                                {t("addQuota")}
                                <Icon name="question circle outline" size="large" className="info-icon" />
                            </Button>
                        }
                        inverted
                        position="left center"
                    >
                        {t("noPools")}
                    </Popup>
                )}
                <Modal open={open} size="tiny" onSubmit={onSubmit} onClose={handleClose}>
                    <Header content={edit ? t("editQuota") : t("addQuota")} />
                    <Modal.Content>
                        {edit ? (
                            <QuotasForm
                                t={t}
                                open={open}
                                handleClose={handleClose}
                                onSubmit={onSubmit}
                                initialValues={mapApiToProps(quota)}
                                edit={edit}
                                isAdmin={rolesWithAdminRights.includes(userRole)}
                                availableQuotas={availableQuotas}
                            />
                        ) : (
                            <QuotasForm
                                t={t}
                                open={open}
                                handleClose={handleClose}
                                onSubmit={onSubmit}
                                isAdmin={rolesWithAdminRights.includes(userRole)}
                                availableQuotas={availableQuotas}
                            />
                        )}
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    );
};

QuotasModal.propTypes = {
    quota: PropTypes.object,
    edit: PropTypes.bool,
    t: PropTypes.func,
    availableQuotas: PropTypes.array,
};

export default QuotasModal;
