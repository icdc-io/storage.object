import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

const Users = React.lazy(() => import("./Users/users"));
const Quotas = React.lazy(() => import("./Users/Quotas/quotas"));
const UserDetails = React.lazy(() => import("./UserDetails/userDetails"));

const Overview = ({ t }) => {
    return (
        <div className="page-layout">
            <Quotas t={t} />
            <div>
                <Switch>
                    <Route exact path={`/amazon`} render={() => <Users t={t} />} />
                    <Route path={`/amazon/:userId`} render={() => <UserDetails t={t} />} />
                    <Redirect to="/amazon" />
                </Switch>
            </div>
        </div>
    );
};

export default Overview;
