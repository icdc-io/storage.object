import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number } from '../../../Validaions';
import CustomSelect from '../../../Elements/customSelect';
import CustomField from '../../../Elements/customField';

const QuotasForm = ({ t, handleClose, handleSubmit, edit, pools }) => {
    const storageTypes = pools.map((item, index) => ({
        key: index,
        text: item.class,
        value: item.id,
    }));

    return (
        <React.Fragment>
            <Form>
                <Field
                    name="objects"
                    label={t('objects')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="space"
                    label={t('space')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="bucketsUser"
                    label={t('bucketsUser')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="users"
                    label={t('users')}
                    component={CustomField}
                    type="number"
                    validate={[required, number]}
                />
                <Field
                    name="storageType"
                    label={t('storageType')}
                    component={CustomSelect}
                    type="text"
                    options={storageTypes}
                    edit={edit}
                    validate={[required]}
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
    form: 'createS3user',
})(QuotasForm);
