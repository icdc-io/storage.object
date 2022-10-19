import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Loader, Header, Segment, Icon } from 'semantic-ui-react';
import UsersList from './usersList';
import PropTypes from 'prop-types';
import UserModal from './userModal';
import { fetchS3Users, fetchPools, fetchS3quotas } from '../../AppActions';
import { useHistory } from 'react-router-dom';
import Quotas from './Quotas/quotas';

const Overview = ({ t }) => {
    const s3users = useSelector(state => state.AmazonStore.s3users);
    const quotas = useSelector(state => state.AmazonStore.s3quotas);
    const s3usersFetchStatus = useSelector(state => state.AmazonStore.s3usersFetchStatus);
    const user = useSelector(state => state.host.user);

    const dispatch = useDispatch();
    const history = useHistory();

    window.goToRootRoute = () => history.push('/amazon');

    useEffect(() => {
        dispatch(fetchS3Users());
        dispatch(fetchPools({type: 's3'}))
        dispatch(fetchS3quotas());
    }, [dispatch, user]);

    return <React.Fragment>
        <Quotas t={t} quotas={quotas}/>

        {s3usersFetchStatus === 'pending' && <Loader active inline='centered' />}

        {
            s3users.length === 0 && s3usersFetchStatus === 'fulfilled' && <Segment placeholder>
                <Header icon>
                    <Icon name='meh outline' />
                    {t('noS3users')}
                </Header>
                <UserModal t={t} />
            </Segment>
        }

        {
            s3usersFetchStatus === 'rejected' && <Segment placeholder>
                <Header icon>
                    <Icon name='frown outline' />
                    {t('wrong')}
                </Header>
            </Segment>
        }

        {
            s3users.length > 0 && s3usersFetchStatus !== 'rejected' && < React.Fragment >
                <section className="items-list">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle' width={4}><Header as='h4'>{t('s3users')}</Header></Grid.Column>
                            <Grid.Column textAlign='right' width={12}>
                                <UserModal t={t} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <UsersList t={t} items={s3users}></UsersList>
                </section>
            </React.Fragment>
        }
    </React.Fragment >;
};

Overview.propTypes = {
    t: PropTypes.func
};

export default Overview;
