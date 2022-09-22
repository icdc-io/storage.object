import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Table } from 'semantic-ui-react';
import QuotasModal from './quotasModal';
import { intersperse } from '../../../AppConstants';

const showEndpoints = (endpointsData) => {
    const endpoints = endpointsData;

    return endpoints.map((endpoint) => (
        <span key={endpoint} style={{ color: '#2185d0' }}>
            {endpoint}
        </span>
    ));
};

const Quotas = ({ t, quotas }) => {
    const headers = [
        { title: 'storageType', data: 'class' },
        { title: 'objects', data: 'objects' },
        { title: 'space', data: 'data_size_mb' },
        { title: 'bucketsUser', data: 'buckets_per_users' },
        { title: 's3swiftUsers', data: 'users' },
    ];

    return (
        <section className="items-list">
            <Grid>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle" width={4}>
                        <Header as="h4">{t('quotas')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right" width={12}>
                        <QuotasModal t={t} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="quotas-description">
                    <Grid.Column verticalAlign="middle" width={16}>
                        <p>{t('quotasDescription')}</p>
                    </Grid.Column>
                </Grid.Row>

                <Table className="users-list">
                    <Table.Header>
                        <Table.Row>
                            {headers.map((item, i) => (
                                <Table.HeaderCell key={i}>{t(item.title)}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {quotas.map((item, i) =>
                            headers.map((headerItem, i) => (
                                <Table.Cell key={i}>
                                    {headerItem.data === 'class'
                                        ? item.pool[headerItem.data]
                                        : item[headerItem.data]}
                                </Table.Cell>
                            ))
                        )}
                    </Table.Body>
                </Table>
            </Grid>
        </section>
    );
};

Quotas.propTypes = {
    t: PropTypes.func,
    quotas: PropTypes.array,
};

export default Quotas;
