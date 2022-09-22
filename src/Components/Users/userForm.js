import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, s3user, email } from '../../Validaions';
import CustomSelect from '../../Elements/customSelect';
import CustomField from '../../Elements/customField';

const UserForm = ({ t, handleClose, handleSubmit, edit, isAdmin, pools }) => {
    const storageTypes = pools.map((item, index) => ({
        key: index,
        text: item.class,
        value: item.id,
    }));

    return (
        <React.Fragment>
            <Form>
                <Field
                    name="name"
                    label={t('name')}
                    component={CustomField}
                    type="text"
                    validate={[required, s3user]}
                />
                <Field
                    name="description"
                    label={t('description')}
                    component={CustomField}
                    type="text"
                    validate={[required]}
                />
                {isAdmin && (
                    <Field
                        name="owner"
                        label={t('owner')}
                        component={CustomField}
                        type="email"
                        validate={edit ? [required, email] : [email]}
                    />
                )}
                <Field
                    name="storageType"
                    label={t('storageType')}
                    component={CustomSelect}
                    type="text"
                    options={storageTypes}
                    edit={edit}
                    validate={[required]}
                />
                <Field
                    name="storageSizeLimit"
                    label={t('storageSizeLimitGb')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="objectsLimit"
                    label={t('objectsLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="bucketsLimit"
                    label={t('bucketsLimit')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="storageInBucketLimit"
                    label={t('storageInBucketLimitGb')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
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
    form: 'createS3user',
})(UserForm);
