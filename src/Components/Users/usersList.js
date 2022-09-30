import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Progress, Dropdown, Icon, Confirm, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import UserModal from './userModal';
// import ConfirmModal from '../../Elements/confirmModal';
import { actionAndFetch, deleteS3user, lockS3userAndFetch, unlockS3userAndFetch } from '../../AppActions';
import { BILLING_USER_NAME, EMPTY_VALUE } from '../../AppConstants';

const Bar = ({ value, total }) =>
    <Progress
        success={value / total < 0.7 ? true : false}
        error={value / total > 0.9 ? true : false}
        warning={(value / total > 0.7 && value / total < 0.9) ? true : false}
        size='small'
        value={value}
        total={total}
    />;

const UsersList = ({ t, items }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [column, setColumn] = useState('name');
    const [direction, setDirection] = useState('ascending');
    const [data, setData] = useState(items);
    const userRole = useSelector(state => state.host.user.role);

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteConfirmI, setDeleteConfirmI] = useState(null);

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

    useEffect(() => setData(_.sortBy(items, [column])), [items, column]);

    // useCallback(() => {
    //     setData(items);
    // }, [items]);

    const onConfirm = useCallback(
        (userId) => {
            setDeleteConfirm(false);
            setDeleteConfirmI(null);
            dispatch(actionAndFetch(deleteS3user, userId));
        },
        [dispatch]
    );

    const navigate = (path) => {
        history.push(path);
    };

    return <React.Fragment>
        <Table sortable className="users-list">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell
                        sorted={column === 'name' ? direction : null}
                        onClick={handleSort('name')}
                    >
                        {t('name')}</Table.HeaderCell>

                    <Table.HeaderCell
                        sorted={column === 'owner' ? direction : null}
                        onClick={handleSort('owner')}
                    >
                        {t('owner')}</Table.HeaderCell>

                    <Table.HeaderCell
                        sorted={column === 'description' ? direction : null}
                        onClick={handleSort('description')}
                    >
                        {t('description')}</Table.HeaderCell>

                    <Table.HeaderCell
                        sorted={column === 'storageType' ? direction : null}
                        onClick={handleSort('storageType')}
                    >
                        {t('storageType')}</Table.HeaderCell>

                    <Table.HeaderCell
                        textAlign='center'
                        sorted={column === 'space' ? direction : null}
                        onClick={handleSort('space')}
                    >
                        {t('spaceGb')}</Table.HeaderCell>

                    <Table.HeaderCell
                        textAlign='center'
                        sorted={column === 'buckets' ? direction : null}
                        onClick={handleSort('buckets')}
                    >
                        {t('buckets')}</Table.HeaderCell>

                    <Table.HeaderCell
                        textAlign='center'
                        sorted={column === 'objects' ? direction : null}
                        onClick={handleSort('objects')}
                    >
                        {t('objects')}</Table.HeaderCell>
                    { userRole !== BILLING_USER_NAME && <Table.HeaderCell />}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data && data.map((item, i) => (
                    <Table.Row key={i} onClick={() => navigate(`/amazon/${item.id}`)}>
                        <Table.Cell>
                            { item.name.slice(0, 20) }
                            { item.name.length > 20 && <Popup
                                trigger={ <span className='popup-icon'>&nbsp;...&nbsp;</span> }
                                content={item.name}
                                position='bottom center'
                                inverted
                            /> }
                            {item.is_locked && <Icon name='lock' title={t('lockedS3user')} style={{ marginLeft: '4px' }}/>}
                        </Table.Cell>
                        <Table.Cell>
                            { item.owner || EMPTY_VALUE }
                        </Table.Cell>
                        <Table.Cell>
                            { item.description.slice(0, 8) }
                            { item.description.length > 8 && <Popup
                                trigger={ <span className='popup-icon'>&nbsp;...&nbsp;</span> }
                                content={item.description}
                                position='bottom center'
                                inverted
                                className='popup'
                            /> }
                        </Table.Cell>
                        <Table.Cell>
                            { item.default_placement.class || EMPTY_VALUE }
                        </Table.Cell>
                        { Object.keys(item.stats).length > 0 ? <Table.Cell textAlign='center'>
                            {item.stats.storage_size.actual} / {item.stats.storage_size.limit}
                            <Bar value={item.stats.storage_size.actual} total={item.stats.storage_size.limit} />
                        </Table.Cell> : <Table.Cell textAlign='center'>{t('notAvailable')}</Table.Cell>}
                        { Object.keys(item.stats).length > 0 ?  <Table.Cell textAlign='center'>
                            {item.stats.buckets.actual} / {item.stats.buckets.limit}
                            <Bar value={item.stats.buckets.actual} total={item.stats.buckets.limit} />
                        </Table.Cell> : <Table.Cell textAlign='center'>{t('notAvailable')}</Table.Cell>}
                        { Object.keys(item.stats).length > 0 ?  <Table.Cell textAlign='center'>
                            {item.stats.objects.actual} / {item.stats.objects.limit}
                            <Bar value={item.stats.objects.actual} total={item.stats.objects.limit} />
                        </Table.Cell> : <Table.Cell textAlign='center'>{t('notAvailable')}</Table.Cell>}
                        { userRole !== BILLING_USER_NAME && <Table.Cell collapsing textAlign='right'>
                            <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
                                <Dropdown.Menu >
                                    <UserModal t={t} key={i} edit user={item} />
                                    { item.is_locked ?
                                        <Dropdown.Item
                                            icon='lock open'
                                            text={t('unlockS3user')}
                                            onClick={() => dispatch(lockS3userAndFetch(item.id, { action: 'unlock' }))}
                                        /> :
                                        <Dropdown.Item
                                            icon='lock'
                                            text={t('lockS3user')}
                                            onClick={() => dispatch(lockS3userAndFetch(item.id, {action: 'lock'}))}
                                        />}
                                    <Dropdown.Item
                                        className="item-red"
                                        icon='trash'
                                        text={t('remove')}
                                        onClick={() => { setDeleteConfirm(true); setDeleteConfirmI(i); }} />
                                    {/* <ConfirmModal
                                        confirm={() => onConfirm(item.s3user_name)}
                                        name={t('deleteS3userConfirName)}
                                        message={t('deleteS3userConfirmMessage, { name: <b>{item.s3user_name}</b> })}
                                    /> */}

                                    <Confirm
                                        open={deleteConfirm && i === deleteConfirmI}
                                        header={t('deleteS3userConfirName')}
                                        content={
                                            <div className='content'>
                                                {t('deleteS3userConfirmMessage', { name: item.s3user_name })}
                                            </div>
                                        }
                                        onCancel={() => { setDeleteConfirm(false); setDeleteConfirmI(null); }}
                                        onConfirm={() => { onConfirm(item.id); setDeleteConfirm(false); }}
                                        cancelButton={t('no')}
                                        confirmButton={t('yes')}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Table.Cell> }
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </React.Fragment>;
};

UsersList.propTypes = {
    t: PropTypes.func,
    items: PropTypes.array
};

Bar.propTypes = {
    value: PropTypes.number,
    total: PropTypes.number
};

export default UsersList;
