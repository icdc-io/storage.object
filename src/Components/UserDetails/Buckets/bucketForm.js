import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, bucket, positiveNumber } from '../../../Validaions';
import CustomField from '../../GeneralComponents/customField';

const STORAGE_SIZE_MAX = 10_000;
const OBJECTS_MAX = 100_000;

const BucketForm = ({ t, handleClose, handleSubmit, edit, initialValues }) => {
    return (
        <React.Fragment>
            <Form>
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t('name')}</label>
                        <p>{initialValues.name}</p>
                    </div>
                ) : (
                    <Field name="name" label={t('name')} component={CustomField} type="text" validate={[required, bucket]} />
                )}
                <div className="add-info-field__container">
                    <Field
                        name="storageSizeLimit"
                        label={t('storageSizeLimit')}
                        component={CustomField}
                        type="text"
                        validate={[required, positiveNumber, number]}
                    />
                    <span className='add-info-field'>{t("max")}. {STORAGE_SIZE_MAX}</span>
                </div>
                <div className="add-info-field__container">
                    <Field
                        name="objectsLimit"
                        label={t('objectsLimit')}
                        component={CustomField}
                        type="number"
                        validate={[required, number]}
                        subLabel={t("objectsNoLimit")}
                    />
                    <span className='add-info-field'>{t("max")}. {OBJECTS_MAX}</span>
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
