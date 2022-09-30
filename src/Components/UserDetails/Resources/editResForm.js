import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number } from '../../../Validaions';
import CustomField from '../../GeneralComponents/customField';

const EditResForm = ({ t, handleClose, handleSubmit, name }) => {
    return <React.Fragment>
        <Form>
            <Field
                name={name}
                component={CustomField}
                type="text"
                validate={[required, number]}
            />
            <Modal.Actions align={'right'}>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} primary type='submit'>{t('submit')}</Button>
            </Modal.Actions>
        </Form>
    </React.Fragment >;
};

EditResForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string
};

export default reduxForm({
    form: 'editResForm'
})(EditResForm);
