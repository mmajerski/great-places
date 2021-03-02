import { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Card, Layout, Typography, Button, Row, Col, Spin } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { Viewer } from "../../utils/types";
import { AUTH_URL } from "../../graphql/queries";
import { AuthUrl } from "../../graphql/queries/__generated__/AuthUrl";
import { SIGN_IN } from "../../graphql/mutations/index";
import {
  SignIn as SignInData,
  SignInVariables
} from "../../graphql/mutations/__generated__/SignIn";
import { Content } from "antd/lib/layout/layout";
import ErrorComponent from "../../utils/ErrorComponent";
import {
  successNotification,
  errorNotification
} from "../../utils/NotificationComponent";

const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
  viewer: Viewer;
}

const SignIn = ({ setViewer, viewer }: Props) => {
  const { loading, error, data } = useQuery<AuthUrl>(AUTH_URL);
  const [
    signIn,
    { data: signInData, error: signInError, loading: signInLoading }
  ] = useMutation<SignInData, SignInVariables>(SIGN_IN, {
    onCompleted: (data) => {
      if (data && data.signIn && data.signIn.token) {
        setViewer(data.signIn);
        sessionStorage.setItem("token", data.signIn.token);
        successNotification("Sign In Success!");
      }
    }
  });
  const signInRef = useRef(signIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      signInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);

  const handleAuthorize = () => {
    if (data) {
      window.location.href = data.authUrl;
    }
  };

  if (signInLoading) {
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

  if (signInData && signInData.signIn) {
    const { id: viewerId } = signInData.signIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  return (
    <Row align="middle">
      {signInError && <ErrorComponent />}
      <Col md={{ span: 12, offset: 6 }}>
        <Card style={{ textAlign: "center" }}>
          <div>
            <Title level={3}>Login with Google</Title>
            <Text>Signing with Google enables you to view more!</Text>
          </div>
          <Button type="primary" onClick={handleAuthorize}>
            <span>Sign in with Google</span>
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
