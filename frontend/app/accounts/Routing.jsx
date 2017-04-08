import React from 'react';
import {Route} from 'react-router';

import {Login} from './components/Login.jsx';
import {Register} from './components/Register.jsx';


export default (
    <Route path="/accounts/">
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
    </Route>
);
