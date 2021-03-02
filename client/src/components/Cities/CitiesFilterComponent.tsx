import { Select } from "antd";

import { CitiesFilter } from "../../graphql/globalTypes";

interface Props {
  filter: CitiesFilter;
  setFilter: (filter: CitiesFilter) => void;
}

const { Option } = Select;

const CitiesFilterComponent = ({ filter, setFilter }: Props) => {
  return (
    <>
      <span>Filter by</span>
      <Select
        value={filter}
        onChange={(filter: CitiesFilter) => setFilter(filter)}
      >
        <Option value={CitiesFilter.PRICE_LOW_TO_HIGH}>
          Lowest price first
        </Option>
        <Option value={CitiesFilter.PRICE_HIGH_TO_LOW}>
          Highest price first
        </Option>
      </Select>
    </>
  );
};

export default CitiesFilterComponent;
