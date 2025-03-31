import React from "react";
import { Field, reduxForm } from "redux-form";
import { Modal, Form, Button, Popup, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import { required, number, s3user, email, positiveNumber } from "../../Validaions";
import CustomField from "../GeneralComponents/customField";
import CustomSelect from "../GeneralComponents/customSelect";
import DangerousHTML from 'react-dangerous-html';

const UserForm = ({ t, handleClose, handleSubmit, edit, isAdmin, pools, initialValues, limits, setLimits }) => {
    const storageTypes = pools.map((item, index) => ({
        key: index,
        text: item.pool.s3_placement_target,
        value: item.pool.id,
    }));

    const handleStorageTypeChange = (e, newValue) => {
        const checkedPool = pools.find((quota) => quota.pool.id === newValue);
        const newLimits = {
            storageSizeLimit: checkedPool.data_size_mb - checkedPool.usage.data_size_mb,
            objectsLimit: checkedPool.objects - checkedPool.usage.objects,
            bucketsLimit: checkedPool.buckets - checkedPool.usage.buckets,
        };
        setLimits(newLimits);
    };

    return (
        <React.Fragment>
            <Form>
                <h4>{t("general")}</h4>
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t("name")}</label>
                        <p>{initialValues.name}</p>
                    </div>
                ) : (
                    <Field placeholder={t("namePlaceholder")} name="name" label={t("name")} component={CustomField} type="text" validate={[required, s3user]} />
                )}
                <Field
                    placeholder={t("descriptPlaceholder")}
                    name="description"
                    label={t("description")}
                    component={CustomField}
                    type="text"
                    validate={[required]}
                />
                {isAdmin && (
                    <Field
                        placeholder={t("emailPlaceholder")}
                        name="owner"
                        label={t("owner")}
                        component={CustomField}
                        type="email"
                        validate={edit ? [required, email] : [email]}
                    />
                )}
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t("storageType")}</label>
                        <p>{storageTypes.find((e) => e.value === initialValues.default_placement)?.text}</p>
                    </div>
                ) : (
                    <Field
                        placeholder={t("select")}
                        name="storageType"
                        label={t("storageType")}
                        component={CustomSelect}
                        type="text"
                        options={storageTypes}
                        edit={edit}
                        initialValues={initialValues}
                        validate={!edit ? [required] : []}
                        onChange={handleStorageTypeChange} // Listen for changes
                    />
                )}
                <h4>{t("quotas")}</h4>

                <Field
                    placeholder={t("spacePlaceholder")}
                    name="storageSizeLimit"
                    label={!edit ? t('space') : <span>{t('space')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.user.usage.data_size_mb
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.storageSizeLimit}
                />
                <Field
                    placeholder={t("objPlaceholder")}
                    name="objectsLimit"
                    label={!edit ? t('objectsQuota') : <span>{t('objectsQuota')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.user.usage.objects
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.objectsLimit}
                />
                <Field
                    placeholder={t("bucketsPlaceholder")}
                    name="bucketsLimit"
                    label={!edit ? t('bucketsQuota') : <span>{t('bucketsQuota')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.user.usage.buckets
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.bucketsLimit}
                />
                <Modal.Actions align={"right"}>
                    <Button onClick={handleClose}>{t("cancel")}</Button>
                    <Button onClick={handleSubmit} primary type="submit">
                        {t("submit")}
                    </Button>
                </Modal.Actions>
            </Form>
        </React.Fragment>
    );
};

UserForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    isAdmin: PropTypes.bool,
    pools: PropTypes.array,
};

export default reduxForm({
    form: "createS3user",
})(UserForm);
