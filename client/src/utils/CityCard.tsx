import { Link } from "react-router-dom";
import { Card, Divider, Typography, Image } from "antd";

import { formatPrice } from "./formatPrice";

interface Props {
  city: {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    maxVisitors: number;
  };
}

const { Text, Title } = Typography;

const CityCard = ({ city }: Props) => {
  const { id, name, image, description, price, maxVisitors } = city;

  return (
    <Card
      style={{ width: 300 }}
      hoverable
      // cover={<div style={{ backgroundImage: `url(${image})` }} />}
    >
      <Link to={`/city/${id}`}>
        <Image width={250} src={image} preview={false} />
      </Link>
      <Title level={4}>{formatPrice(price)}</Title>
      <div>
        <Text strong ellipsis>
          {name}
        </Text>
      </div>
      <div>
        <Text ellipsis style={{ width: "100%" }}>
          {description}
        </Text>
      </div>
      <div>
        <Text>Max visitors: {maxVisitors}</Text>
      </div>
    </Card>
  );
};

export default CityCard;
