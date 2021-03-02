import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Moment } from "moment";

import { CITY } from "../../graphql/queries";
import {
  City as CityData,
  CityVariables
} from "../../graphql/queries/__generated__/City";
import { Spin, Col, Row, Divider } from "antd";
import CityDetails from "./CityDetails";
import { Content } from "antd/lib/layout/layout";
import CityReservations from "./CityReservations";
import CityCreateReservation from "./CityCreateReservation";
import { Viewer } from "../../utils/types";
import { WrappedCityCreateReservationModal as CityCreateModal } from "./CityCreateModal";

interface Props {
  match: any;
  viewer: Viewer;
}

const SKIP_LIMIT = 3;

const City = ({ match, viewer }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reservationsSkip, setReservationsSkip] = useState(1);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const { data, loading, error, refetch } = useQuery<CityData, CityVariables>(
    CITY,
    {
      variables: {
        id: match.params.id,
        reservationsSkip,
        limit: SKIP_LIMIT
      }
    }
  );

  const clearReservationData = () => {
    setModalVisible(false);
    setStartDate(null);
    setEndDate(null);
  };

  const handleCityRefetch = async () => {
    await refetch();
  };

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

  const city = data ? data.city : null;
  const cityReservations = city ? city.reservations : null;

  const cityDetailsElem = city ? <CityDetails city={city} /> : null;
  const cityReservationsElem = cityReservations ? (
    <CityReservations
      cityReservations={cityReservations}
      reservationsSkip={reservationsSkip}
      limit={SKIP_LIMIT}
      setReservationsSkip={setReservationsSkip}
    />
  ) : null;
  const cityCreateReservationElem = city ? (
    <CityCreateReservation
      viewer={viewer}
      owner={city.owner}
      price={city.price}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      setModalVisible={setModalVisible}
    />
  ) : null;
  const cityCreateReservationModalElem = city && startDate && endDate && (
    <CityCreateModal
      id={city.id}
      price={city.price}
      startDate={startDate}
      endDate={endDate}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      clearReservationData={clearReservationData}
      handleCityRefetch={handleCityRefetch}
    />
  );

  return (
    <Content
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Row gutter={24} justify="space-between">
        <Col>
          {cityDetailsElem}
          <Divider />
          {cityReservationsElem}
          {cityCreateReservationElem}
        </Col>
      </Row>
      {cityCreateReservationModalElem}
    </Content>
  );
};

export default City;
