import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Table } from 'semantic-ui-react';
import QuotasModal from './quotasModal';
import { useSelector } from 'react-redux';
import CopyButton from '../../GeneralComponents/copyButton';
import External from "../../../images/external.svg";

const Quotas = ({ t, quotas }) => {
    const user = useSelector((state) => state.host.user);
    const vendor = useSelector((state) => state.host.vendor);
    const lang = useSelector((state) => state.host.lang);
    const pools = useSelector((state) => state.AmazonStore.pools);

    const quotasLimit = quotas.length >= pools.length;

    const headers = [
        { title: 'storageType', data: 's3_placement_target' },
        { title: 'objects', data: 'objects' },
        { title: 'space', data: 'storage_mb' },
        { title: 's3swiftUsers', data: 'users' },
        { title: 'buckets', data: 'buckets' },
        { title: 'publicEndpoints', data: 'public' },
        { title: 'privateEndpoints', data: 'private' },
        { title: '', data: 'edit' },
    ];

    const showEndpoints = (endpoints) => {
        let endpointsArray = endpoints.split(',');
        return (
            <div className="endpoint">
                {endpointsArray.map((el) => (
                    <div>
                        <a href={el} target="blank">
                            {el}
                        </a>
                        <CopyButton content={el} />
                    </div>
                ))}
            </div>
        );
    };

    const HELP_LINK = `https://help.${vendor}.io/storage/${lang}/s3_swift_object_storage/overview/`;

    return (
        <section className="items-list">
            <Grid>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle" width={4}>
                        <Header as="h4">{t('quotas')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right" width={12}>
                        {user.role === 'admin' && <QuotasModal t={t} quotasLimit={quotasLimit} />}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="quotas-description">
                    <Grid.Column verticalAlign="middle" width={16}>
                        <p>{t('quotasDescription')}  <a href={HELP_LINK} target="_blank" rel="noreferrer">{t("howToConnect")} <img src={External} alt="External link" /></a></p>
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
                                            {user.role === 'admin' && <QuotasModal t={t} key={i} edit quota={item} />}
                                        </Table.Cell>
                                    ) : (
                                        <Table.Cell
                                            key={i}
                                            className={headerItem.data !== 's3_placement_target' ? 'gray-text' : ''}
                                        >
                                            {headerItem.data === 's3_placement_target'
                                                ? item.pool[headerItem.data]
                                                : headerItem.data === 'storage_mb' ||
                                                  headerItem.data === 'objects' ||
                                                  headerItem.data === 'users' ||
                                                  headerItem.data === 'buckets'
                                                ? `${item.stats[headerItem.data].actual} / ${item.stats[headerItem.data].limit}`
                                                : headerItem.data === 'public' || headerItem.data === 'private'
                                                ? showEndpoints(item.endpoints[headerItem.data])
                                                : item[headerItem.data]}
                                        </Table.Cell>
                                    )
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {quotas.length === 0 && <span className="s3quotas-empty">{t('quotasEmpty')}</span>}
            </Grid>
        </section>
    );
};

Quotas.propTypes = {
    t: PropTypes.func,
    quotas: PropTypes.array,
};

export default Quotas;
