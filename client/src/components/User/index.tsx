import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Col, Divider, Layout, Row, Spin } from "antd";

import { USER } from "../../graphql/queries/index";
import {
  User as UserData,
  UserVariables
} from "../../graphql/queries/__generated__/User";
import { Viewer } from "../../utils/types";
import UserProfile from "./UserProfile";
import UserCities from "./UserCities";
import UserReservations from "./UserReservations";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  match: any;
}

const PAGE_LIMIT = 4;

const User = ({ viewer, match, setViewer }: Props) => {
  const [citiesSkip, setCitiesSkip] = useState(1);
  const [reservationsSkip, setReservationsSkip] = useState(1);

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id: match.params.id,
        citiesSkip,
        reservationsSkip,
        limit: PAGE_LIMIT
      }
    }
  );

  const handleUserRefetch = async () => {
    await refetch();
  };

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

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;

  const userCities = user ? user.cities : null;
  const userReservations = user ? user.reservations : null;

  const userProfile = user ? (
    <UserProfile
      user={user}
      viewerIsUser={viewerIsUser}
      setViewer={setViewer}
      viewer={viewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userCitiesElem = userCities ? (
    <UserCities
      userCities={userCities}
      citiesSkip={citiesSkip}
      limit={PAGE_LIMIT}
      setCitiesSkip={setCitiesSkip}
    />
  ) : null;

  const userReservationsElem = userReservations ? (
    <UserReservations
      userReservations={userReservations}
      reservationsSkip={reservationsSkip}
      limit={PAGE_LIMIT}
      setReservationsSkip={setReservationsSkip}
    />
  ) : null;

  return (
    <Content>
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfile}</Col>
        <Divider />
        <Col xs={24}>
          {userCitiesElem}
          <Divider />
          {userReservationsElem}
        </Col>
      </Row>
    </Content>
  );
};

export default User;
