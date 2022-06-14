import React from 'react';
import PropTypes from 'prop-types';
import { Header, Item, Grid } from 'semantic-ui-react';
import EditResModal from './editResModal';

const Resources = ({ t, s3user }) => {
    return <React.Fragment>
        <Item.Header as='h4'>{t('storageSizeLimit')}</Item.Header>
        <Grid>
            <Grid.Column verticalAlign='middle' width={2}>
                {s3user.current_actual_usage.data_size_mb + ' / ' + s3user.quota_per_s3user.data_size_mb}
            </Grid.Column>
            <Grid.Column width={2}>
                <EditResModal t={t} name="storageSizeLimit" label={t('storageSizeLimit')} s3user={s3user}/>
            </Grid.Column>
        </Grid>

        <Header as='h4'>{t('objectsLimit')}</Header>
        <Grid>
            <Grid.Column verticalAlign='middle' width={2}>
                {s3user.current_actual_usage.number_of_objects + ' / ' + s3user.quota_per_s3user.number_of_objects}
            </Grid.Column>
            <Grid.Column width={2}>
                <EditResModal t={t} name="objectsLimit" label={t('objectsLimit')} s3user={s3user}/>
            </Grid.Column>
        </Grid>

        <Header as='h4'>{t('bucketsLimit')}</Header>
        <Grid>
            <Grid.Column verticalAlign='middle' width={2}>
                {s3user.current_actual_usage.number_of_buckets + ' / ' + s3user.quota_per_s3user.number_of_buckets}
            </Grid.Column>
            <Grid.Column width={2}>
                <EditResModal t={t} name="bucketsLimit" label={t('bucketsLimit')} s3user={s3user}/>
            </Grid.Column>
        </Grid>

        <Header as='h4'>{t('storageInBucketLimit')}</Header>
        <Grid>
            <Grid.Column verticalAlign='middle' width={2}>
                {s3user.default_quota_per_bucket.data_size_mb}
            </Grid.Column>
            <Grid.Column width={2}>
                <EditResModal t={t} name="storageInBucketLimit" label={t('storageInBucketLimit')} s3user={s3user}/>
            </Grid.Column>
        </Grid>

        <Header as='h4'>{t('objectsInBucketLimit')}</Header>
        <Grid>
            <Grid.Column verticalAlign='middle' width={2}>
                {s3user.default_quota_per_bucket.number_of_objects}
            </Grid.Column>
            <Grid.Column width={2}>
                <EditResModal t={t} name="objectsInBucketLimit" label={t('objectsInBucketLimit')} s3user={s3user}/>
            </Grid.Column>
        </Grid>
    </React.Fragment>;
};

Resources.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.object
};

export default Resources;
