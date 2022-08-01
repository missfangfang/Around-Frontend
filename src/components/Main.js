import React from 'react';
import { Route, Switch } from "react-router"

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import { Redirect } from "react-router-dom";

function Main(props) {
    const { isLoggedIn, handleLoggedIn } = props;

    const showLogin = () => {
        // Case 1: isLoggedIn -> show Home
        // Case 2: !isLoggedIn -> show Login
        return isLoggedIn ? <Redirect to={"/home"} /> : <Login handleLoggedIn={handleLoggedIn} />
    }

    const showHome = () => {
        // Case 1: isLoggedIn -> show Home
        // Case 2: !isLoggedIn -> show Login
        return isLoggedIn ? <Home /> : <Redirect to="/login" />
    }

    return (
        <div className="main">
            <Switch>
                <Route path="/" exact render={showLogin} />
                <Route path="/login" render={showLogin} />
                <Route path="/register" component={Register} />
                <Route path="/home" render={showHome} />
            </Switch>
        </div>
    );
}

export default Main;