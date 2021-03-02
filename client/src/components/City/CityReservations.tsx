import { List, Typography, Avatar, Divider } from "antd";
import { Link } from "react-router-dom";

import { City } from "../../graphql/queries/__generated__/City";

interface Props {
  cityReservations: City["city"]["reservations"];
  reservationsSkip: number;
  limit: number;
  setReservationsSkip: (skip: number) => void;
}

const { Title, Text } = Typography;

const CityReservations = ({
  cityReservations,
  reservationsSkip,
  limit,
  setReservationsSkip
}: Props) => {
  const total = cityReservations ? cityReservations.total : null;
  const result = cityReservations ? cityReservations.result : null;

  const cityReservationsList = cityReservations ? (
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
      renderItem={(cityReservation) => {
        const reservationHistory = (
          <div>
            <div>
              Start: <Text strong>{cityReservation.start}</Text>
            </div>
            <div>
              End: <Text strong>{cityReservation.end}</Text>
            </div>
          </div>
        );

        return (
          <>
            <Title>Reservations</Title>
            <List.Item>
              {reservationHistory}
              <Link to={`/user/${cityReservation.reservedBy.id}`}>
                <Avatar
                  src={cityReservation.reservedBy.avatar}
                  size={64}
                  shape="square"
                />
              </Link>
            </List.Item>
          </>
        );
      }}
    />
  ) : null;

  const cityReservationsElem = cityReservationsList ? (
    <>
      <Title>Reservations</Title>
      {cityReservationsList}
    </>
  ) : null;

  return cityReservationsElem;
};

export default CityReservations;
