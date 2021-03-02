import { Avatar, Divider, Tag, Typography, Image } from "antd";
import { Link } from "react-router-dom";

import { City as CityData } from "../../graphql/queries/__generated__/City";

interface Props {
  city: CityData["city"];
}

const { Paragraph, Title } = Typography;

const CityDetails = ({ city }: Props) => {
  const {
    name,
    description,
    image,
    address,
    country,
    maxVisitors,
    owner
  } = city;

  return (
    <div>
      {/* <div style={{ backgroundImage: `url(${image})` }} /> */}
      <Link to={`/user/${owner.id}`}>
        <Avatar src={owner.avatar} size={64} />
      </Link>
      <Title>{owner.name}</Title>
      <Title level={3}>{name}</Title>
      <Paragraph type="secondary" ellipsis>
        {address}
      </Paragraph>
      <Divider />
      <Image width={200} src={image} preview={false} />
      <Title level={4}>About</Title>
      <Tag color="magenta">Max Visitors: {maxVisitors}</Tag>
      <div style={{ maxWidth: "500px", flexWrap: "wrap" }}>
        <Paragraph>{description}</Paragraph>
      </div>
    </div>
  );
};

export default CityDetails;
