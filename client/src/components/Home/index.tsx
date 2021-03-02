import { useQuery } from "@apollo/client";
import { Layout, Spin } from "antd";

import {
  Cities as CitiesData,
  CitiesVariables
} from "../../graphql/queries/__generated__/Cities";
import { CitiesFilter } from "../../graphql/globalTypes";
import { CITIES } from "../../graphql/queries";
import HomeCities from "./HomeCities";

const LIMIT = 4;
const SKIP = 1;

const Home = () => {
  const { data, loading } = useQuery<CitiesData, CitiesVariables>(CITIES, {
    variables: {
      filter: CitiesFilter.PRICE_HIGH_TO_LOW,
      limit: LIMIT,
      skip: SKIP
    }
  });

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

  const renderCities = () => {
    if (data) {
      return <HomeCities title="The Best Ones" cities={data.cities.result} />;
    }

    return null;
  };

  return (
    <Layout.Content
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {renderCities()}
    </Layout.Content>
  );
};

export default Home;
