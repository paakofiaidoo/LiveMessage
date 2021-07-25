import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Messages from "./screens/Messages";
import Login from "./screens/Login";
import Layout from "./components/Layout";
import { AppProvider } from "./services/context";

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/" component={Messages} />
          </Switch>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
