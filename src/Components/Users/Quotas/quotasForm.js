import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button, Popup, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, positiveNumber } from '../../../Validaions';
import CustomField from '../../GeneralComponents/customField';
import CustomSelect from '../../GeneralComponents/customSelect';
import { filterFreeDiskTypes } from '../../../utils/filterFreeQuotas';
import DangerousHTML from 'react-dangerous-html';

const QuotasForm = ({ t, handleClose, handleSubmit, edit, availableQuotas, initialValues, limits, handleChangeStorageType }) => {

    return (
        <React.Fragment>
            <Form>
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t('storageType')}</label>
                        <p>{availableQuotas.find((e) => e.value === initialValues.storageType)?.text}</p>
                    </div>
                ) : (
                    <Field
                        placeholder={t('select')}
                        name="storageType"
                        label={t('storageType')}
                        component={CustomSelect}
                        type="text"
                        editable
                        options={filterFreeDiskTypes(availableQuotas)}
                        initialValues={initialValues}
                        edit={edit}
                        onChange={handleChangeStorageType}
                        validate={[required]}
                    />
                )}
                <Field
                    placeholder={t('objPlaceholder')}
                    name="objects"
                    label={!edit ? t('objects') : <span>{t('objects')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.objects
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.objects}
                />
                <Field
                    placeholder={t('spacePlaceholder')}
                    name="space"
                    label={!edit ? t('space') : <span>{t('space')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.space
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.data_size_mb}
                />
                <Field
                    placeholder={t('usersPlaceholder')}
                    name="users"
                    label={!edit ? t('s3swiftUsers') : <span>{t('s3swiftUsers')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.users
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.users}
                />
                <Field
                    placeholder={t('bucketsPlaceholder')}
                    name="buckets"
                    label={!edit ? t('bucketsPerS3') : <span>{t('bucketsPerS3')} <Popup inverted trigger={<Icon color='grey' name='exclamation circle' />} content={<DangerousHTML
                        html={t('cannotBeLess', {
                            value: initialValues.buckets
                        })}
                    />}/></span>}
                    component={CustomField}
                    type="number"
                    validate={[required, number, positiveNumber]}
                    limit={limits.buckets}
                />
                <Modal.Actions align={'right'}>
                    <Button onClick={handleClose}>{t('cancel')}</Button>
                    <Button onClick={handleSubmit} primary type="submit">
                        {!edit ? t('add') : t('submit')}
                    </Button>
                </Modal.Actions>
            </Form>
        </React.Fragment>
    );
};

QuotasForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    isAdmin: PropTypes.bool,
    availableQuotas: PropTypes.array,
};

export default reduxForm({
    form: 'createQuota',
})(QuotasForm);
