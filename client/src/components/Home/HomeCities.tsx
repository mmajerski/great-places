import { List, Typography } from "antd";

import CityCard from "../../utils/CityCard";
import { Cities } from "../../graphql/queries/__generated__/Cities";

const { Title } = Typography;

interface Props {
  title: string;
  cities: Cities["cities"]["result"];
}

const HomeCities = ({ title, cities }: Props) => {
  return (
    <>
      <Title level={4}>{title}</Title>
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={cities}
        renderItem={(city) => {
          return (
            <List.Item>
              <CityCard city={city} />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default HomeCities;
