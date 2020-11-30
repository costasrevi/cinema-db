import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./Helpers";

import Register from "./Register";
import Login from "./Login";
import { Logout } from "./Logout";

import Dashboard from "./Dashboard";
import AddMovie from "./AddMovie";
// import Welcome from "./Welcome";
import AdminPanel from "./AdminPanel";
import EditMovies from "./EditMovies";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Login}/>
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/logout" component={Logout} />
    <PrivateRoute path="/dashboard" component={Dashboard} />
    {/* <PrivateRoute path="/Welcome" component={Welcome} /> */}
    <PrivateRoute path="/AddMovie" component={AddMovie} />
    <PrivateRoute path="/EditMovies" component={EditMovies} />
    <PrivateRoute path="/admin" component={AdminPanel} />
  </Switch>
);

export default Routes;
