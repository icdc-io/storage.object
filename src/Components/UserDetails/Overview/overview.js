import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Header, Divider, Grid, Button, Confirm, Icon } from 'semantic-ui-react';
import { generateKeys, deleteS3userAndFetch, lockS3userAndFetch } from '../../../AppActions';
import DangerousHTML from 'react-dangerous-html';

import { BILLING_USER_NAME } from '../../../AppConstants';
import CopyButton from '../../GeneralComponents/copyButton';

const UserOverview = ({ t, s3user, setActiveItem }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const userRole = useSelector((state) => state.host.user.role);

    const generateNewKeys = useCallback(() => {
        dispatch(generateKeys(s3user.id));
    }, [dispatch, s3user]);

    const deleteS3user = useCallback(() => {
        dispatch(deleteS3userAndFetch(s3user.id));
        setDeleteConfirm(false);
        history.push('/amazon');
    }, [dispatch, s3user, history]);

    useEffect(() => {
        return () => setActiveItem(0)
    }, []);

    return (
        <React.Fragment>
            <Grid>
                <Grid.Row>
                <Grid.Column width={2}>{t("name")}</Grid.Column>
                <Grid.Column width={4}>
                    <Header as="h4">
                    {s3user.name}{" "}
                    {s3user.is_locked && (
                        <Icon
                        style={{ fontSize: "15px", position: "relative", top: "-5px" }}
                        name="lock"
                        title={t("lockedS3user")}
                        />
                    )}
                    </Header>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                <Grid.Column width={2}>{t("description")}</Grid.Column>
                <Grid.Column width={4}>{s3user.description}</Grid.Column>
                </Grid.Row>
            </Grid>

            <Divider />

            <Header as="h4">{t('s3')}</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>{t('id')}</Grid.Column>
                    <Grid.Column width={4}>{s3user.keys?.s3.user}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={2}>{t('accessKey')}</Grid.Column>
                    <Grid.Column width={4} className='column-copy'>{s3user.keys?.s3.access_key}<CopyButton content={s3user.keys?.s3.access_key} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={2}>{t('secretKey')}</Grid.Column>
                    <Grid.Column width={5} className='column-copy'>
                        <span className='secret-key'>{s3user.keys?.s3.secret_key}</span><CopyButton content={s3user.keys?.s3.secret_key} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider />

            <Header as="h4">{t('swift')}</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>{t('id')}</Grid.Column>
                    <Grid.Column width={4}>{s3user.keys?.swift.user}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={2}>{t('accessKey')}</Grid.Column>
                    <Grid.Column width={5} className='column-copy'>
                        <span className='secret-key'>{s3user.keys?.swift.secret_key}</span><CopyButton content={s3user.keys?.swift.secret_key} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {userRole !== BILLING_USER_NAME && (
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign="right" width={16}>
                            <Button content={t('generatenewKeys')} onClick={generateNewKeys} style={{ width: '270px' }} />
                            {s3user.is_locked ? (
                                <Button
                                    content={t('unlockS3user')}
                                    style={{ width: '270px' }}
                                    onClick={() => dispatch(lockS3userAndFetch(s3user.id, { action: 'unlock' }))}
                                />
                            ) : (
                                <Button
                                    content={t('lockS3user')}
                                    style={{ width: '270px' }}
                                    onClick={() => dispatch(lockS3userAndFetch(s3user.id, { action: 'lock' }))}
                                />
                            )}
                            <Button
                                negative
                                onClick={() => setDeleteConfirm(true)}
                                content={t('deleteS3user')}
                                style={{ width: '270px' }}
                            />
                            <Confirm
                                open={deleteConfirm}
                                header={t('deleteS3userConfirName')}
                                content={
                                    <div className="content">
                                        <DangerousHTML
                                            html={t('deleteS3userConfirmMessage', { name: `<b>${s3user.name}</b>` })}
                                        />
                                    </div>
                                }
                                onCancel={() => setDeleteConfirm(false)}
                                onConfirm={deleteS3user}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </React.Fragment>
    );
};

UserOverview.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.object,
};

export default UserOverview;
