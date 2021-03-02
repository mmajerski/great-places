import { useEffect, useRef } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Spin } from "antd";

import { CONNECT_STRIPE } from "../../graphql/mutations";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables
} from "../../graphql/mutations/__generated__/ConnectStripe";
import { Viewer } from "../../utils/types";
import { successNotification } from "../../utils/NotificationComponent";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const StripeComponent = ({
  viewer,
  setViewer,
  history
}: Props & RouteComponentProps) => {
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        successNotification("Stripe connected successfully!");
      }
    }
  });
  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code }
        }
      });
    } else {
      history.replace("/login");
    }
  }, [history]);

  if (loading) {
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

  if (error) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  return null;
};

export default StripeComponent;
