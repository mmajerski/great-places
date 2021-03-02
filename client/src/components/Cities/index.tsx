import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Layout, List, Spin } from "antd";

import CityCard from "../../utils/CityCard";
import { CITIES } from "../../graphql/queries";
import {
  Cities as CitiesData,
  CitiesVariables
} from "../../graphql/queries/__generated__/Cities";
import { CitiesFilter } from "../../graphql/globalTypes";
import CitiesFilterComponent from "./CitiesFilterComponent";
import CitiesPagination from "./CitiesPagination";

const { Content } = Layout;

const SKIP_LIMIT = 8;

const Cities = ({ match }: any) => {
  const [filter, setFilter] = useState(CitiesFilter.PRICE_LOW_TO_HIGH);
  const [skip, setSkip] = useState(1);
  const locationRef = useRef(match.params.location);
  const { data, loading } = useQuery<CitiesData, CitiesVariables>(CITIES, {
    skip: locationRef.current !== match.params.location && skip !== 1,
    variables: {
      location: match.params.location,
      filter,
      limit: SKIP_LIMIT,
      skip: 1
    }
  });

  useEffect(() => {
    setSkip(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

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

  const cities = data ? data.cities : null;
  const citiesElem = cities ? (
    <>
      <CitiesFilterComponent filter={filter} setFilter={setFilter} />
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={cities.result}
        renderItem={(city) => {
          return (
            <List.Item>
              <CityCard city={city} />
            </List.Item>
          );
        }}
      />
      <CitiesPagination
        total={cities.total}
        skip={skip}
        limit={SKIP_LIMIT}
        setSkip={setSkip}
      />
    </>
  ) : null;

  return <Content>{citiesElem}</Content>;
};

export default Cities;
