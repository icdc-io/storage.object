import { rolesWithAdminRights } from "container/roles";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Header, Loader, Table } from "semantic-ui-react";
import { fetchPools, fetchS3Limits, fetchS3quotas } from "../../../AppActions";
import External from "../../../images/external.svg";
import CopyButton from "../../GeneralComponents/copyButton";
import QuotasModal from "./quotasModal";

const Quotas = ({ t }) => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.host.user);
    const lang = useSelector((state) => state.host.lang);
    const quotas = useSelector((state) => state.AmazonStore.s3quotas);
    const s3quotasFetchStatus = useSelector((state) => state.AmazonStore.s3quotasFetchStatus);

    useEffect(() => {
        dispatch(fetchS3quotas());
        dispatch(fetchPools({ type: "s3" }));
        dispatch(fetchS3Limits(user.account));
    }, [dispatch, user]);

    const headers = [
        { title: "storageType", data: "name", width: 2 },
        { title: "objects", data: "objects", width: 2 },
        { title: "space", data: "data_size_mb", width: 2 },
        { title: "s3swiftUsers", data: "users", width: 2 },
        { title: "buckets", data: "buckets", width: 2 },
        { title: "publicEndpoints", data: "public", width: 3 },
        { title: "privateEndpoints", data: "private", width: 3 },
        { title: "", data: "edit", width: 1 },
    ];

    const showEndpoints = (endpoints) => {
        const endpointsArray = endpoints.split(",");
        return (
            <div className="endpoint">
                {endpointsArray.map((el, index) => (
                    <div key={index}>
                        <a href={el} target="blank">
                            {el}
                        </a>
                        <CopyButton content={el} />
                    </div>
                ))}
            </div>
        );
    };

    const vendorDomain = window.location.origin.split(".").slice(-2).join(".");

    const HELP_LINK = `https://docs.${vendorDomain}/${lang}/storage/s3/overview/`;

    const getContent = () => {
      if (s3quotasFetchStatus === "pending") return (
          <Table.Row>
              <Table.Cell className="s3quotas-empty-cell" colSpan="8">
                  <div className="s3quotas-empty">
                      <Loader active inline="centered" />
                  </div>
              </Table.Cell>
          </Table.Row>
      )

      if (s3quotasFetchStatus === "rejected") return (
        <Table.Row>
            <Table.Cell className="s3quotas-empty-cell" colSpan="8">
                <div className="s3quotas-empty">
                  <p>{t("wrong")}</p>
                </div>
            </Table.Cell>
        </Table.Row>
      )

      if (quotas.length === 0) return (
        <Table.Row>
            <Table.Cell className="s3quotas-empty-cell" colSpan="8">
                <div className="s3quotas-empty">
                    <p>{t("quotasEmpty")}</p>
                    {rolesWithAdminRights.includes(user.role) && <QuotasModal t={t} />}
                </div>
            </Table.Cell>
        </Table.Row>
      )

      return quotas.map((quota, i) => (
        <Table.Row key={i}>
            {headers.map((headerItem, i) =>
                headerItem.data === "edit" ? (
                    <Table.Cell key={i} textAlign="right">
                        {rolesWithAdminRights.includes(user.role) && <QuotasModal t={t} key={i} edit quota={quota} />}
                    </Table.Cell>
                ) : (
                    <Table.Cell key={i}>
                        {headerItem.data === "name"
                            ? quota.pool[headerItem.data]
                            : headerItem.data === "data_size_mb" ||
                              headerItem.data === "objects" ||
                              headerItem.data === "users" ||
                              headerItem.data === "buckets"
                            ? `${quota.usage[headerItem.data]} / ${quota[headerItem.data]}`
                            : headerItem.data === "public" || headerItem.data === "private"
                            ? showEndpoints(quota.endpoints[headerItem.data])
                            : quota[headerItem.data]}
                    </Table.Cell>
                )
            )}
        </Table.Row>
      ))
    };

    return (
        <section className="s3quotas-list">
            <Grid>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle" width={4}>
                        <Header as="h2">{t("quotas")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right" width={12}>
                        {rolesWithAdminRights.includes(user.role) && <QuotasModal t={t} />}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="quotas-description">
                    <Grid.Column verticalAlign="middle" width={16}>
                        <p>
                            {t("quotasDescription")}{" "}
                            <a href={HELP_LINK} target="_blank" rel="noreferrer">
                                {t("howToConnect")} <img src={External} alt="External link" />
                            </a>
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Table className="quotas-list">
                <Table.Header>
                    <Table.Row>
                        {headers.map((item, i) => (
                            <Table.HeaderCell key={i} width={item.width}>
                                {t(item.title)}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getContent()}
                </Table.Body>
            </Table>
        </section>
    );
};

Quotas.propTypes = {
    t: PropTypes.func,
};

export default Quotas;
