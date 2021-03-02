import { Button, Card, Divider, Typography, DatePicker } from "antd";
import moment, { Moment } from "moment";

import { formatPrice } from "../../utils/formatPrice";
import { errorNotification } from "../../utils/NotificationComponent";
import { Viewer } from "../../utils/types";
import { City as CityData } from "../../graphql/queries/__generated__/City";

const { Paragraph, Text, Title } = Typography;

interface Props {
  viewer: Viewer;
  owner: CityData["city"]["owner"];
  price: number;
  startDate: Moment | null;
  endDate: Moment | null;
  setStartDate: (startDate: Moment | null) => void;
  setEndDate: (endDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}

const CityCreateReservation = ({
  viewer,
  owner,
  price,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setModalVisible
}: Props) => {
  const disabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

      return dateIsBeforeEndOfDay;
    } else {
      return false;
    }
  };

  const verifyAndSetEndDate = (endDate: Moment | null) => {
    if (startDate && endDate) {
      if (moment(endDate).isBefore(startDate, "days")) {
        return errorNotification("Cannot set end date before start date");
      }
    }

    setEndDate(endDate);
  };

  const viewerIsOwner = viewer.id === owner.id;
  const startInputDisabled = !viewer.id || viewerIsOwner || !owner.hasWallet;
  const endInputDisabled = startInputDisabled || !startDate;
  const buttonDisabled = !startDate || !endDate;

  let buttonMessage = "You won't be charged yet";
  if (!viewer.id) {
    buttonMessage = "You must be signed in to make reservation";
  } else if (viewerIsOwner) {
    buttonMessage = "You are owner of this city";
  } else if (!viewer.hasWallet) {
    buttonMessage =
      "Owner of this city has disabled account to receive payment";
  }

  return (
    <>
      <Card>
        <Title>Create reservation</Title>
        <Paragraph>
          <Title level={2}>{formatPrice(price)}</Title>
        </Paragraph>
        <Divider />
        <Paragraph strong>Start</Paragraph>
        <DatePicker
          showToday={false}
          disabled={startInputDisabled}
          value={startDate}
          format={"YYYY/MM/DD"}
          disabledDate={disabledDate}
          onChange={(dateValue) => setStartDate(dateValue)}
          // onOpenChange={() => setStartDate(null)}
        />
        <Paragraph strong>End</Paragraph>
        <DatePicker
          showToday={false}
          disabled={endInputDisabled}
          value={endDate}
          format={"YYYY/MM/DD"}
          disabledDate={disabledDate}
          onChange={(dateValue) => verifyAndSetEndDate(dateValue)}
        />
        <Divider />
        <Button
          onClick={() => setModalVisible(true)}
          disabled={buttonDisabled}
          size="large"
          type="primary"
        >
          Proceed
        </Button>
        <div>
          <Text type="secondary" mark>
            {buttonMessage}
          </Text>
        </div>
      </Card>
    </>
  );
};

export default CityCreateReservation;
