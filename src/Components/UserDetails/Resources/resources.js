import React from 'react';
import PropTypes from 'prop-types';
import { Header, Item, Grid } from 'semantic-ui-react';
import EditResModal from './editResModal';
import { useEffect } from 'react';

const Resources = ({ t, s3user, setActiveItem }) => {

    useEffect(() => {
        return () => setActiveItem(1)
    }, []);
    
    return (
        <React.Fragment>
            <Header as="h4">{t('storageType')}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.default_placement?.class}
                </Grid.Column>
            </Grid>
            <Item.Header as="h4">{t('storageSizeLimit')}</Item.Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.stats?.storage_size.actual + ' / ' + s3user.stats?.storage_size.limit}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t('objectsLimit')}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.stats?.objects.actual + ' / ' + s3user.stats?.objects.limit}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t('bucketsLimit')}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.stats?.buckets.actual + ' / ' + s3user.stats?.buckets.limit}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t('storageInBucketLimit')}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.stats?.storage_bucket_limit}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t('objectsInBucketLimit')}</Header>
            <Grid className="resources-bottom-panel">
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.stats?.object_bucket_limit}
                </Grid.Column>
                <Grid.Column verticalAlign="middle" width={2} className="resource-action">
                    <EditResModal t={t} s3user={s3user} />
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
};

Resources.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.object,
};

export default Resources;
