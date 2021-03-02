import { List, Typography } from "antd";

import CityCard from "../../utils/CityCard";
import { User } from "../../graphql/queries/__generated__/User";

interface Props {
  userReservations: User["user"]["reservations"];
  reservationsSkip: number;
  limit: number;
  setReservationsSkip: (skip: number) => void;
}

const { Paragraph, Title, Text } = Typography;

const UserReservations = ({
  userReservations,
  reservationsSkip,
  limit,
  setReservationsSkip
}: Props) => {
  const total = userReservations ? userReservations.total : null;
  const result = userReservations ? userReservations.result : null;

  const userReservationsList = userReservations ? (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "Nothing to show" }}
      pagination={{
        position: "bottom",
        current: reservationsSkip,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (skip: number) => setReservationsSkip(skip)
      }}
      renderItem={(userReservation) => {
        const reservationHistory = (
          <div>
            <div>
              Start: <Text strong>{userReservation.start}</Text>
            </div>
            <div>
              End: <Text strong>{userReservation.end}</Text>
            </div>
          </div>
        );

        return (
          <List.Item>
            {reservationHistory}
            <CityCard city={userReservation.city} />
          </List.Item>
        );
      }}
    />
  ) : null;

  const userReservationsElem = userReservationsList ? (
    <>
      <Title>Reservations</Title>
      <Paragraph>Information about reservations</Paragraph>
      {userReservationsList}
    </>
  ) : null;

  return userReservationsElem;
};

export default UserReservations;
