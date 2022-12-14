import React from "react";
import { Switch, Route } from "react-router-dom";

import Layout from "./hoc/layout";
import Auth from "./hoc/auth";

import Login from "./components/login/login";
import Requests from "./components/requests/requests";


const NotFound = () => <div>Page not found</div>;

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/admin/" exact component={Auth(Login, false)} />
        <Route path="/admin/dashboard" exact  component={Auth(Requests, true)} />
        <Route path="*"  component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default Routes;
