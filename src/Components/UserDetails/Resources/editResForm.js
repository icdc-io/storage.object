import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CustomField from '../../GeneralComponents/customField';
import { number, required } from '../../../Validaions';

const EditResForm = ({ t, handleClose, handleSubmit, initialValues }) => {
    return (
        <React.Fragment>
            <Form>
                <div className="uneditable_field">
                    <label>{t('name')}</label>
                    <p>{initialValues.name}</p>
                </div>
                <Field
                    placeholder={t('spacePlaceholder')}
                    name="storageSizeLimit"
                    label={t('storageSizeLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('objPlaceholder')}
                    name="objectsLimit"
                    label={t('objectsLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('bucketsPlaceholder')}
                    name="bucketsLimit"
                    label={t('bucketsLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('storagePlaceholder')}
                    name="storageInBucketLimit"
                    label={t('storageInBucketLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('objPlaceholder')}
                    name="objectsInBucketLimit"
                    label={t('objectsInBucketLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
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

EditResForm.propTypes = {
    t: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.any,
};

export default reduxForm({
    form: 'editResources',
})(EditResForm);
