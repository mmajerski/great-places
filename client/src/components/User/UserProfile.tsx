import { useMutation } from "@apollo/client";
import { Avatar, Card, Divider, Typography, Button, Tag, Spin } from "antd";

import { DISCONNECT_STRIPE } from "../../graphql/mutations";
import { DisconnectStripe as DisconnectStripeData } from "../../graphql/mutations/__generated__/DisconnectStripe";
import { User as UserData } from "../../graphql/queries/__generated__/User";
import { formatPrice } from "../../utils/formatPrice";
import { successNotification } from "../../utils/NotificationComponent";
import { Viewer } from "../../utils/types";

interface Props {
  user: UserData["user"];
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  viewerIsUser: boolean;
  handleUserRefetch: () => void;
}

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

const { Paragraph, Text, Title } = Typography;

const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleUserRefetch
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          successNotification("Disconnected from Stripe successfully!");
        }
        handleUserRefetch();
      }
    }
  );

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

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const stripeDetails = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color="purple">Stripe</Tag>
        <Paragraph>
          Reservations income:{" "}
          <Text strong>{user.income ? formatPrice(user.income) : " 0"}</Text>
        </Paragraph>
        <Button
          type="primary"
          loading={loading}
          onClick={() => disconnectStripe()}
        >
          Disconnect from Stripe
        </Button>
      </Paragraph>
    </>
  ) : (
    <>
      <Paragraph>Register Stripe to start earning!</Paragraph>
      <Button onClick={redirectToStripe} type="primary">
        Connect with Stripe
      </Button>
    </>
  );

  const extraSection = viewerIsUser ? (
    <>
      <Divider />
      <Title level={4}>Extra Details</Title>
      {stripeDetails}
    </>
  ) : null;

  return (
    <>
      <Card>
        <Avatar size={120} src={user.avatar} />
        <Divider />
        <Title level={4}>Info About</Title>
        <Paragraph>
          Name: <Text strong>{user.name}</Text>
        </Paragraph>
        <Paragraph>
          Email: <Text strong>{user.email}</Text>
        </Paragraph>
        {extraSection}
      </Card>
    </>
  );
};

export default UserProfile;
