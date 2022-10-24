import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Table } from 'semantic-ui-react';
import QuotasModal from './quotasModal';
import { intersperse } from '../../../AppConstants';
import { useSelector } from 'react-redux';

const Quotas = ({ t, quotas }) => {

    const user = useSelector(state => state.host.user);
    const userInfo = window.insights.getUserInfo();
    const pools = useSelector(state => state.AmazonStore.pools);

    let re = new RegExp(`^${user.account}.cloud$`);
    const check = (groups) => groups.some(group => re.test(group));
    const quotasLimit = quotas.length <= pools.length;

    const headers = [
        { title: 'storageType', data: 'class' },
        { title: 'objects', data: 'objects' },
        { title: 'space', data: 'storage_mb' },
        { title: 's3swiftUsers', data: 'users' },
        { title: 'bucketsUser', data: 'buckets_per_users' },
        { title: 's3Endpoints', data: 'endpoints' },
        { title: '', data: 'edit' },
    ];

    return (
        <section className="items-list">
            <Grid>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle" width={4}>
                        <Header as="h4">{t('quotas')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right" width={12}>
                        {/*  !quotasLimit && */}
                        { check(userInfo.groups) && <QuotasModal t={t} quotasLimit />}
                        
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="quotas-description">
                    <Grid.Column verticalAlign="middle" width={16}>
                        <p>{t('quotasDescription')}</p>
                    </Grid.Column>
                </Grid.Row>

                <Table className="quotas-list">
                    <Table.Header>
                        <Table.Row>
                            {headers.map((item, i) => (
                                <Table.HeaderCell key={i}>{t(item.title)}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {quotas.map((item, i) => (
                            <Table.Row key={i}>
                                {headers.map((headerItem, i) =>
                                    headerItem.data === 'edit' ? (
                                        <Table.Cell key={i} textAlign="right">
                                              { check(userInfo.groups) && <QuotasModal t={t} key={i} edit quota={item} /> }
                                        </Table.Cell>
                                    ) : (
                                        <Table.Cell key={i}  className={headerItem.data !== 'class' ? 'gray-text' : ''}>
                                            {headerItem.data === 'class'
                                                ? item.pool[headerItem.data]
                                                : (headerItem.data === 'storage_mb' || headerItem.data === 'objects' || headerItem.data === 'users') 
                                                ? `${item.stats[headerItem.data].actual} / ${item.stats[headerItem.data].limit}`
                                                : item[headerItem.data]}
                                        </Table.Cell>
                                    )
                                )}
                            </Table.Row>
                        ))}
                        
                    </Table.Body>
                </Table>
                {quotas.length === 0 && <span className='s3quotas-empty'>{t('s3QuotasEmpty')}</span>}
            </Grid>
        </section>
    );
};

Quotas.propTypes = {
    t: PropTypes.func,
    quotas: PropTypes.array,
};

export default Quotas;
