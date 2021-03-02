import { Pagination } from "antd";

interface Props {
  total: number;
  skip: number;
  limit: number;
  setSkip: (skip: number) => void;
}

const CitiesPagination = ({ total, skip, limit, setSkip }: Props) => {
  return (
    <Pagination
      current={skip}
      total={total}
      onChange={(skip: number) => setSkip(skip)}
      defaultPageSize={limit}
      hideOnSinglePage
      showLessItems
    />
  );
};

export default CitiesPagination;
