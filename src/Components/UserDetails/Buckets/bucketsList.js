import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Table, Progress, Dropdown, Grid, Segment, Icon, Loader, Confirm } from 'semantic-ui-react';
import { deleteBucketAndFetch, fetchBuckets } from '../../../AppActions';
import _ from 'lodash';
import DangerousHTML from 'react-dangerous-html';
import BucketModal from './bucketModal';
import { useParams } from 'react-router-dom';

const Bar = ({ value, total }) => (
    <Progress
        success={value / total < 0.7 ? true : false}
        error={value / total > 0.9 ? true : false}
        warning={value / total > 0.7 && value < 0.9 ? true : false}
        size="small"
        value={value}
        total={total}
    />
);

const BucketsList = ({ t, setActiveItem, s3user }) => {
    const { userId } = useParams();

    const dispatch = useDispatch();

    const buckets = useSelector((state) => state.AmazonStore.buckets);
    const bucketsFetchStatus = useSelector((state) => state.AmazonStore.bucketsFetchStatus);
    const user = useSelector((state) => state.host.user);

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [currentItem, setCurrentItem] = useState(null);

    const [column, setColumn] = useState('name');
    const [direction, setDirection] = useState('ascending');
    const [data, setData] = useState([]);

    useEffect(() => {
        s3user && dispatch(fetchBuckets(s3user.name))
    }, [s3user]);
    
    useEffect(() => {
        setData(Object.values(buckets));
    }, [buckets]);

    useEffect(() => {
        return () => setActiveItem(2)
    }, []);

    const handleSort = (clickedColumn) => () => {
        if (column !== clickedColumn) {
            setColumn(clickedColumn);
            setData(_.sortBy(data, [clickedColumn]));
            setDirection('ascending');
            return;
        }

        direction === 'ascending' ? setDirection('descending') : setDirection('ascending');
        setData(data.reverse());
    };

    const onConfirm = (bucket) =>  dispatch(deleteBucketAndFetch(userId, `${user.account}/${bucket.name}`));

    return (
        <React.Fragment>
            {bucketsFetchStatus === 'pending' && Object.keys(buckets).length === 0 && <Loader active inline="centered" />}

            {Object.keys(buckets).length === 0 && bucketsFetchStatus === 'fulfilled' && (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="meh outline" />
                        {t('noBuckets')}
                    </Header>
                    <BucketModal t={t} s3user={s3user}/>
                </Segment>
            )}

            {bucketsFetchStatus === 'rejected' && (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="frown outline" />
                        {t('wrong')}
                    </Header>
                </Segment>
            )}

            {Object.keys(buckets).length > 0 && bucketsFetchStatus !== 'rejected' && (
                <React.Fragment>
                    <Grid className="buckets-grid">
                        <Grid.Row>
                            <Grid.Column verticalAlign="middle" width={4}>
                                <Header as="h4">
                                    {t('bucketsTab')}
                                    {s3user.is_locked && (
                                        <Icon
                                            style={{ fontSize: '15px', position: 'relative', top: '-5px', marginLeft: '4px' }}
                                            name="lock"
                                            title={t('lockedS3user')}
                                        />
                                    )}
                                </Header>
                            </Grid.Column>
                            <Grid.Column textAlign="right" width={12}>
                                <BucketModal t={t} s3user={s3user}/>
                            </Grid.Column>
                            <Grid.Row className="buckets-description">
                                <Grid.Column verticalAlign="middle" width={16}>
                                    <p>{t('bucketsDescription')}</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Row>
                    </Grid>
                    <Table sortable className="users-list">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={handleSort('name')}>
                                    {t('name')}
                                </Table.HeaderCell>

                                <Table.HeaderCell textAlign="center" sorted={column === 'space' ? direction : null} onClick={handleSort('space')}>
                                    {t('space')}
                                </Table.HeaderCell>

                                <Table.HeaderCell textAlign="center" sorted={column === 'objects' ? direction : null} onClick={handleSort('objects')}>
                                    {t('objects')}
                                </Table.HeaderCell>
                                <Table.HeaderCell />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {data &&
                                data.map((item, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell width={5}>{item.name}</Table.Cell>
                                        <Table.Cell width={5}textAlign="center">
                                            {item.usage.data_size_mb} / {item.quota.data_size_mb}
                                            <Bar value={item.usage.data_size_mb} total={item.quota.data_size_mb} />
                                        </Table.Cell>
                                        <Table.Cell width={5} textAlign="center">
                                            {item.usage.objects} / {item.quota.objects}
                                            <Bar value={item.usage.objects} total={item.quota.objects} />
                                        </Table.Cell>
                                        <Table.Cell width={1} collapsing textAlign="right">
                                            <Dropdown direction="left" icon="ellipsis vertical" className="users-list__actions_dot">
                                                <Dropdown.Menu>
                                                    <BucketModal t={t} edit bucket={item} s3user={s3user}/>
                                                    <Dropdown.Item
                                                        className="item-red"
                                                        icon="trash"
                                                        text={t('remove')}
                                                        onClick={() => {
                                                            setDeleteConfirm(true);
                                                            setCurrentItem(item);
                                                        }}
                                                    />
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </React.Fragment>
            )}
            {deleteConfirm && (
                <Confirm
                    open={deleteConfirm}
                    header={t('deleteBucketConfirmName')}
                    content={
                        <div className="content">
                            <DangerousHTML
                                html={t('deleteBucketConfirmMessage', {
                                    name: `<b>${currentItem.name}</b>`,
                                })}
                            />
                        </div>
                    }
                    onCancel={() => setDeleteConfirm(false)}
                    onConfirm={() => onConfirm(currentItem)}
                />
            )}
        </React.Fragment>
    );
};

BucketsList.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.any,
};

Bar.propTypes = {
    value: PropTypes.number,
    total: PropTypes.number,
};

export default BucketsList;
