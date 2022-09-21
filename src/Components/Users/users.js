import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Loader, List, Header, Segment, Icon } from 'semantic-ui-react';
import UsersList from './usersList';
import PropTypes from 'prop-types';
import UserModal from './userModal';
import { intersperse } from '../../AppConstants';
import { fetchS3Users, fetchInfo, fetchPools } from '../../AppActions';
import { useHistory } from 'react-router-dom';
import UserQuotas from './userQuotas';

// const showEndpoints = (endpointsData) => {
//     const endpoints = endpointsData;

//     return endpoints.map(endpoint => <span key={endpoint} style={{ color: '#2185d0' }}>{endpoint}</span>);
// };

const Overview = ({ t }) => {
    const s3users = useSelector(state => state.AmazonStore.s3users);
    const info = useSelector(state => state.AmazonStore.info);
    const s3usersFetchStatus = useSelector(state => state.AmazonStore.s3usersFetchStatus);
    const user = useSelector(state => state.host.user);

    const dispatch = useDispatch();
    const history = useHistory();

    window.goToRootRoute = () => history.push('/amazon');

    useEffect(() => {
        dispatch(fetchS3Users());
        dispatch(fetchInfo());
        dispatch(fetchPools({type: 's3'}))
    }, [dispatch, user]);

    return <React.Fragment>
        <UserQuotas t={t} info={info}/>
        {/* <List horizontal divided>
            {
                info.map((item, i) => (
                    <List.Item key={i}>
                        <List.Content>
                            <List.Header>{t(item.name)}</List.Header>
                            {
                                item.data.used ?
                                    <React.Fragment>{item.data.used + ' / ' + item.data.total}</React.Fragment> :
                                    item.data.s3Endpoints ?
                                        <React.Fragment>{intersperse(showEndpoints(item.data.s3Endpoints), ', ')}</React.Fragment> :
                                        <React.Fragment>{item.data.total}</React.Fragment>
                            }
                        </List.Content>
                    </List.Item>
                ))
            }
        </List> */}

        {s3usersFetchStatus === 'pending' && s3users.length === 0 && <Loader active inline='centered' />}

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
