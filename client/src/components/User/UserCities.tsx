import { List, Typography } from "antd";

import CityCard from "../../utils/CityCard";
import { User } from "../../graphql/queries/__generated__/User";

interface Props {
  userCities: User["user"]["cities"];
  citiesSkip: number;
  limit: number;
  setCitiesSkip: (skip: number) => void;
}

const { Paragraph, Title } = Typography;

const UserCities = ({
  userCities,
  citiesSkip,
  limit,
  setCitiesSkip
}: Props) => {
  const { total, result } = userCities;

  const userCitiesList = (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={result}
      locale={{ emptyText: "Nothing to show" }}
      pagination={{
        position: "bottom",
        current: citiesSkip,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (skip: number) => setCitiesSkip(skip)
      }}
      renderItem={(userCity) => {
        return (
          <List.Item>
            <CityCard city={userCity} />
          </List.Item>
        );
      }}
    />
  );

  return (
    <>
      <Title>Cities</Title>
      <Paragraph>
        Information about cities that are being hosted by this user
      </Paragraph>
      {userCitiesList}
    </>
  );
};

export default UserCities;
