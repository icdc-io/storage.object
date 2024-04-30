import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tab, Button, Loader } from 'semantic-ui-react';
import UserOverview from './Overview/overview';
import Resources from './Resources/resources';
import { fetchS3User, fetchBuckets, clearS3UserFetchStatus, fetchS3quotas } from '../../AppActions';
import BucketsList from './Buckets/bucketsList';
import { useState } from 'react';
import Quotas from '../Users/Quotas/quotas';

const UserDetails = ({ t }) => {
    const { userId } = useParams();
    const s3user = useSelector((state) => state.AmazonStore.s3user);
    const s3userFetchStatus = useSelector((state) => state.AmazonStore.s3userFetchStatus);
    const s3quotasFetchStatus = useSelector((state) => state.AmazonStore.s3quotasFetchStatus);
    const user = useSelector((state) => state.host.user);
    const quotas = useSelector((state) => state.AmazonStore.s3quotas);
    const [activeItem, setActiveItem] = useState(0);

    const dispatch = useDispatch();
    const history = useHistory();

    window.goToRootRoute = () => history.push('/amazon');

    const panes = [
        /* eslint-disable react/display-name */
        {
            menuItem: t('overviewTab'),
            render: () => (
                <Tab.Pane>
                    <UserOverview t={t} s3user={s3user} setActiveItem={setActiveItem}/>
                </Tab.Pane>
            )
        },
        {
            menuItem: t('resourcesTab'),
            render: () => (
                <Tab.Pane>
                    <Resources t={t} s3user={s3user} setActiveItem={setActiveItem}/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: t('bucketsTab'),
            render: () => (
                <Tab.Pane>
                    <BucketsList t={t} s3user={s3user} setActiveItem={setActiveItem}/>
                </Tab.Pane>
            ),
        },
    ];

    useEffect(() => {
        dispatch(fetchS3User(userId));
        dispatch(fetchBuckets(userId));
        dispatch(fetchS3quotas());
    }, [dispatch, userId, user]);

    useEffect(() => {
        if (s3userFetchStatus === 'rejected') {
            dispatch(clearS3UserFetchStatus());
            history.push('/storage');
        }
    }, [dispatch, s3userFetchStatus, history]);

    const statuses = [s3userFetchStatus, s3quotasFetchStatus];

    if (statuses.includes('pending')) return <Loader active inline="centered" />;

    return (
        <div className='page-layout'>
            <Link to="/amazon" className="back_link">
                <Button className="back" labelPosition="left" icon="left chevron" content={t('back')} />
            </Link>

            <Quotas t={t} quotas={quotas} />

            {s3userFetchStatus === 'fulfilled' && (
                <>
                    <Tab panes={panes} defaultActiveIndex={activeItem}/>
                    <Link to="/amazon" className="back_link">
                        <Button
                            className="back"
                            labelPosition="left"
                            icon="left chevron"
                            content={t('back')}
                        ></Button>
                    </Link>
                </>
            )}
        </div>
    );
};

UserDetails.propTypes = {
    t: PropTypes.func,
};

export default UserDetails;
