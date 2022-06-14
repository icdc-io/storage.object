import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Users = React.lazy(() => import('./Users/users'));
const UserDetails = React.lazy(() => import('./UserDetails/userDetails'));

const Overview = ({ t }) => {
    return (
        <Switch>
            <Route exact path='/amazon' render={() => <Users t={t} />}/>
            <Route exact path='/amazon/:name' render={() => <UserDetails t={t} />} />
            <Redirect to='/amazon' />
        </Switch>
    );
};

export default Overview;
