import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, bucket, positiveNumber } from '../../../Validaions';
import CustomField from '../../GeneralComponents/customField';

const BucketForm = ({ t, handleClose, handleSubmit, edit, initialValues, limits }) => {
    return (
        <React.Fragment>
            <Form>
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t('name')}</label>
                        <p>{initialValues.name}</p>
                    </div>
                ) : (
                    <Field name="name" label={t('name')} component={CustomField} type="text" validate={[required, bucket]} placeholder={t("namePlaceholder")}/>
                )}
                <div className="add-info-field__container">
                    <Field
                        name="storageSizeLimit"
                        label={t('space')}
                        component={CustomField}
                        type="text"
                        validate={[positiveNumber, number]}
                        placeholder={t("bucketParamsPlaceholder")}
                        limit={limits.space}
                    />
                </div>
                <div className="add-info-field__container">
                    <Field
                        name="objectsLimit"
                        label={t('objectsLimit')}
                        component={CustomField}
                        type="number"
                        validate={[number]}
                        placeholder={t("bucketParamsPlaceholder")}
                        limit={limits.objects}
                    />
                </div>
                <Modal.Actions align={'right'}>
                    <Button onClick={handleClose}>{t('cancel')}</Button>
                    <Button onClick={handleSubmit} primary type="submit">
                        {t('submit')}
                    </Button>
                </Modal.Actions>
            </Form>
        </React.Fragment>
    );
};

BucketForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    initialValues: PropTypes.any,
};

export default reduxForm({
    form: 'createBucket',
})(BucketForm);
