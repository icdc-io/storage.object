import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, s3user, email } from '../../Validaions';

const Fld = ({ input, label, meta: { error, touched } }) => {
    return <React.Fragment>
        <Form.Field error={(touched && error) ? true : false} >
            <label>{label}</label>
            <input {...input}/>
            {touched && error && <Label basic pointing>{error}</Label>}
        </Form.Field>
    </React.Fragment>;
};

Fld.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any
};

const UserForm = ({ t, handleClose, handleSubmit, edit, isAdmin }) => {
    return <React.Fragment>
        <Form>
            <Field
                name="name"
                label={t('name')}
                component={Fld}
                type="text"
                validate={[required, s3user]}
            />
            <Field
                name="description"
                label={t('description')}
                component={Fld}
                type="text"
                validate={[required]}
            />
            {isAdmin && <Field
                name="owner"
                label={t('owner')}
                component={Fld}
                type="email"
                validate={edit ? [required, email] : [email]}
            />}
            <Field
                name="storageSizeLimit"
                label={t('storageSizeLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Field
                name="objectsLimit"
                label={t('objectsLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Field
                name="bucketsLimit"
                label={t('bucketsLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Field
                name="storageInBucketLimit"
                label={t('storageInBucketLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Field
                name="objectsInBucketLimit"
                label={t('objectsInBucketLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Modal.Actions align={'right'}>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} primary type='submit'>{t('submit')}</Button>
            </Modal.Actions>
        </Form>
    </React.Fragment >;
};

UserForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    isAdmin: PropTypes.bool
};

export default reduxForm({
    form: 'createS3user'
})(UserForm);
