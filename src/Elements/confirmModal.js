
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Header, Button, Dropdown, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ConfirmModal = ({ t, name, message, confirm }) => {
    const [open, setOpen] = useState(false);
    const s3user = useSelector(state => state.AmazonStore.s3user);

    const handleClose = useCallback(
        () => {
            setOpen(false);
        },
        [setOpen]
    );

    const onConfirm = useCallback(
        () => {
            handleClose();
            confirm();
        },
        [handleClose, confirm]
    );

    return <React.Fragment>
        <Dropdown.Item icon='trash' className="item-red" text={t('remove')}  onClick={() => setOpen(true)} disabled={s3user.is_locked} />

        <Modal open={open} size="tiny">
            <Header content={name} />
            <Modal.Content>
                {message}
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' onClick={handleClose} >
                    <Icon name='remove' /> {t('no')}
                </Button>
                <Button color='green' onClick={onConfirm}>
                    <Icon name='checkmark'  /> {t('yes')}
                </Button>
            </Modal.Actions>
        </Modal>
    </React.Fragment>;
};

ConfirmModal.propTypes = {
    name: PropTypes.string,
    message: PropTypes.any,
    confirm: PropTypes.func,
    t: PropTypes.func
};

export default ConfirmModal;
