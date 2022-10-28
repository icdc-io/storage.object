import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number } from '../../../Validaions';
import CustomField from '../../GeneralComponents/customField';
import CustomSelect from '../../GeneralComponents/customSelect';

const QuotasForm = ({ t, handleClose, handleSubmit, edit, pools, initialValues }) => {
    const storageTypes = pools.map((item, index) => ({
        key: index,
        text: item.s3_placement_target,
        value: item.id,
    }));

    return (
        <React.Fragment>
            <Form>
                {edit ? (
                    <div className="uneditable_field">
                        <label>{t('storageType')}</label>
                        <p>{storageTypes.find((e) => e.value == initialValues.storageType)?.text}</p>
                    </div>
                ) : (
                    <Field
                        placeholder={t('select')}
                        name="storageType"
                        label={t('storageType')}
                        component={CustomSelect}
                        type="text"
                        editable
                        options={storageTypes}
                        initialValues={initialValues}
                        edit={edit}
                        validate={[required]}
                    />
                )}
                <Field
                    placeholder={t('objPlaceholder')}
                    name="objects"
                    label={t('objects')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('spacePlaceholder')}
                    name="space"
                    label={t('space')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('usersPlaceholder')}
                    name="users"
                    label={t('s3swiftUsers')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    placeholder={t('bucketsPlaceholder')}
                    name="buckets"
                    label={t('buckets')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
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
    pools: PropTypes.array,
};

export default reduxForm({
    form: 'createQuota',
})(QuotasForm);
