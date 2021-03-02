import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout, Affix, Spin } from "antd";
import { useMutation } from "@apollo/client";
import { StripeProvider, Elements } from "react-stripe-elements";

import Cities from "./components/Cities";
import Home from "./components/Home";
import Organizer from "./components/Organizer";
import City from "./components/City";
import User from "./components/User";
import SignIn from "./components/SignIn";
import NotFound from "./components/NotFound";
import Header from "./components/Header";

import { Viewer } from "./utils/types";
import { SIGN_IN } from "./graphql/mutations";
import {
  SignIn as SignInData,
  SignInVariables
} from "./graphql/mutations/__generated__/SignIn";
import StripeComponent from "./components/Stripe";

const initialViewer: Viewer = {
  id: null,
  email: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

export const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [signIn, { error, loading }] = useMutation<SignInData, SignInVariables>(
    SIGN_IN,
    {
      onCompleted: (data) => {
        if (data && data.signIn) {
          setViewer(data.signIn);

          if (data.signIn.token) {
            sessionStorage.setItem("token", data.signIn.token);
          } else {
            sessionStorage.removeItem("token");
          }
        }
      }
    }
  );

  const signInRef = useRef(signIn);

  useEffect(() => {
    signInRef.current();
  }, []);

  if (!viewer.didRequest || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <StripeProvider
      apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string}
    >
      <Router>
        <Layout
          style={{
            position: "relative",
            background: "#fff",
            minHeight: "100vh",
            margin: "0 20px"
          }}
        >
          <Affix offsetTop={0}>
            <Header viewer={viewer} setViewer={setViewer} />
          </Affix>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/organizer"
              render={(props) => <Organizer {...props} viewer={viewer} />}
            />
            <Route
              exact
              path="/city/:id"
              render={(props) => (
                <Elements>
                  <City {...props} viewer={viewer} />
                </Elements>
              )}
            />
            <Route exact path="/cities/:location?" component={Cities} />
            <Route
              exact
              path="/signin"
              render={(props) => (
                <SignIn {...props} setViewer={setViewer} viewer={viewer} />
              )}
            />
            <Route
              exact
              path="/stripe"
              render={(props) => (
                <StripeComponent
                  {...props}
                  viewer={viewer}
                  setViewer={setViewer}
                />
              )}
            />
            <Route
              exact
              path="/user/:id"
              render={(props) => (
                <User {...props} viewer={viewer} setViewer={setViewer} />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    </StripeProvider>
  );
};
