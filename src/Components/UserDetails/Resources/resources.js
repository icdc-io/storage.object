import React from "react";
import PropTypes from "prop-types";
import { Header, Grid } from "semantic-ui-react";
import EditResModal from "./editResModal";
import { useEffect } from "react";

const Resources = ({ t, s3user, setActiveItem }) => {
    useEffect(() => {
        return () => setActiveItem(1);
    }, []);

    return (
        <React.Fragment>
            <Header as="h4">{t("storageType")}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.pool?.klass}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t("space")}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.usage?.data_size_mb + " / " + s3user.user_quota?.data_size_mb}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t("objectsLimit")}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.usage?.objects + " / " + s3user.user_quota?.objects}
                </Grid.Column>
            </Grid>
            <Header as="h4">{t("numberBucketsLimit")}</Header>
            <Grid>
                <Grid.Column verticalAlign="middle" width={2}>
                    {s3user.usage?.buckets + " / " + s3user.user_quota?.buckets}
                </Grid.Column>
            </Grid>
            <Grid className="resources-bottom-panel">
                <Grid.Row verticalAlign="middle" width={2} className="resource-action">
                    <EditResModal t={t} s3user={s3user} />
                </Grid.Row>
            </Grid>
        </React.Fragment>
    );
};

Resources.propTypes = {
    t: PropTypes.func,
    s3user: PropTypes.object,
};

export default Resources;
