import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Table, Progress, Dropdown, Grid, Segment, Icon, Loader } from 'semantic-ui-react';
import { deleteBucketAndFetch } from '../../../AppActions';
import _ from 'lodash';
import ConfirmModal from '../../../Elements/confirmModal';
import BucketModal from './bucketModal';
import { useParams } from 'react-router-dom';

const Bar = ({ value, total }) =>
    <Progress
        success={value / total < 0.7 ? true : false}
        error={value / total > 0.9 ? true : false}
        warning={value / total > 0.7 && value < 0.9 ? true : false}
        size='small'
        value={value}
        total={total}
    />;

const BucketsList = ({ t }) => {
    const { userId } = useParams();

    const dispatch = useDispatch();

    const buckets = useSelector(state => state.AmazonStore.buckets);
    const bucketsFetchStatus = useSelector(state => state.AmazonStore.bucketsFetchStatus);
    const s3user = useSelector(state => state.AmazonStore.s3user);

    const [column, setColumn] = useState('name');
    const [direction, setDirection] = useState('ascending');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(Object.values(buckets))
    }, [buckets])

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

    // useEffect(() => setData(_.sortBy(buckets, [column])), [buckets, column]);

    const onConfirm = useCallback(
        (bucket) => {
            dispatch(deleteBucketAndFetch(userId, bucket.bucket_name));
        },
        [dispatch]
    );

    return <React.Fragment>
        {bucketsFetchStatus === 'pending' && Object.keys(buckets).length === 0 && <Loader active inline='centered' />}

        {
            Object.keys(buckets).length === 0 && bucketsFetchStatus === 'fulfilled' &&
            <Segment placeholder>
                <Header icon>
                    <Icon name='meh outline' />
                    {t('noBuckets')}
                </Header>
                <BucketModal t={t} />
            </Segment>
        }

        {
            bucketsFetchStatus === 'rejected' && <Segment placeholder>
                <Header icon>
                    <Icon name='frown outline' />
                    {t('wrong')}
                </Header>
            </Segment>
        }

        {
            Object.keys(buckets).length > 0 && bucketsFetchStatus !== 'rejected' && <React.Fragment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' width={4}><Header as='h4' style={{ marginLeft: '9px' }}>{t('bucketsTab')}
                            {s3user.is_locked && <Icon style={{ fontSize: '15px', position: 'relative', top: '-5px', marginLeft: '4px' }}
                                name='lock' title={t('lockedS3user')}/>}</Header></Grid.Column>
                        <Grid.Column textAlign='right' width={12}>
                            <BucketModal t={t} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Table sortable className="users-list">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={column === 'name' ? direction : null}
                                onClick={handleSort('name')}
                            >
                                {t('name')}</Table.HeaderCell>

                            <Table.HeaderCell
                                textAlign='center'
                                sorted={column === 'space' ? direction : null}
                                onClick={handleSort('space')}
                            >
                                {t('space')}</Table.HeaderCell>

                            <Table.HeaderCell
                                textAlign='center'
                                sorted={column === 'objects' ? direction : null}
                                onClick={handleSort('objects')}
                            >
                                {t('objects')}</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data && data.map((item, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{item.bucket_name}</Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {item.storage_size.actual} / {item.storage_size.limit}
                                    <Bar value={item.storage_size.actual} total={item.storage_size.limit} />
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {item.objects.actual} / {item.objects.limit}
                                    <Bar value={item.objects.actual} total={item.objects.limit} />
                                </Table.Cell>
                                <Table.Cell collapsing textAlign='right'>
                                    <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
                                        <Dropdown.Menu >
                                            <BucketModal t={t} edit bucket={item} />
                                            <ConfirmModal
                                                t={t}
                                                confirm={() => onConfirm(item)}
                                                name={t('deleteBucketConfirmName')}
                                                message={t('deleteBucketConfirmMessage', { name: item.bucket_name })}
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </React.Fragment>
        }

    </React.Fragment>;
};

BucketsList.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.any
};

Bar.propTypes = {
    value: PropTypes.number,
    total: PropTypes.number
};

export default BucketsList;
