import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Table } from 'semantic-ui-react';
import { intersperse } from '../../AppConstants';

const showEndpoints = (endpointsData) => {
    const endpoints = endpointsData;

    return endpoints.map((endpoint) => (
        <span key={endpoint} style={{ color: '#2185d0' }}>
            {endpoint}
        </span>
    ));
};

const UserQuotas = ({ t, info }) => {



    return (
        <section className="items-list">
            {/* <Grid>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle' width={4}><Header as='h4'>{t('s3users')}</Header></Grid.Column>
                            <Grid.Column textAlign='right' width={12}>
                                <UserModal t={t} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid> */}
            <Grid>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle" width={4}>
                        <Header as="h4">{t('quotas')}</Header>
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
                            {info.map((item, i) => (
                                <Table.HeaderCell key={i}>{t(item.name)}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {info.map((item, i) => (
                            <Table.Cell key={i}>
                                    {item.data.used ? (
                                        <React.Fragment>{item.data.used + ' / ' + item.data.total}</React.Fragment>
                                    ) : item.data.s3Endpoints ? (
                                        <React.Fragment>{intersperse(showEndpoints(item.data.s3Endpoints), ', ')}</React.Fragment>
                                    ) : (
                                        <React.Fragment>{item.data.total}</React.Fragment>
                                    )}
                            </Table.Cell>
                        ))}
                    </Table.Body>
                </Table>
            </Grid>
        </section>
    );
};

UserQuotas.propTypes = {
    t: PropTypes.func,
    info: PropTypes.array,
};

export default UserQuotas;
