import { Modal, Button, Divider, Typography } from "antd";
import moment, { Moment } from "moment";
import {
  CardElement,
  injectStripe,
  ReactStripeElements
} from "react-stripe-elements";
import { useMutation } from "@apollo/client";

import { formatPrice } from "../../utils/formatPrice";
import { CREATE_RESERVATION } from "../../graphql/mutations";
import {
  CreateReservation as CreateReservationData,
  CreateReservationVariables
} from "../../graphql/mutations/__generated__/CreateReservation";
import {
  errorNotification,
  successNotification
} from "../../utils/NotificationComponent";

interface Props {
  id: string;
  price: number;
  startDate: Moment;
  endDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  clearReservationData: () => void;
  handleCityRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

const CityCreateModal = ({
  modalVisible,
  setModalVisible,
  price,
  startDate,
  endDate,
  stripe,
  id,
  clearReservationData,
  handleCityRefetch
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const [createReservation, { loading }] = useMutation<
    CreateReservationData,
    CreateReservationVariables
  >(CREATE_RESERVATION, {
    onCompleted: () => {
      clearReservationData();
      successNotification("Payment successful!");
      handleCityRefetch();
    },
    onError: () => {
      errorNotification("Something went wrong. Please try again");
    }
  });

  const daysReserved = endDate.diff(startDate, "days") + 1;
  const cityPrice = price * daysReserved;
  // const fee = cityPrice * 0.1;
  // const totalPrice = fee + cityPrice;

  const handleCreateReservation = async () => {
    if (!stripe) {
      return errorNotification("Unable to connect with Stripe");
    }

    let { token: stripeToken, error } = await stripe.createToken();
    if (stripeToken) {
      createReservation({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            start: moment(startDate).format("YYYY/MM/DD"),
            end: moment(endDate).format("YYYY/MM/DD")
          }
        }
      });
    } else {
      errorNotification(
        error && error.message ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <>
        <Title level={3}>Make reservation</Title>
        <Text mark strong>
          From: {moment(startDate).format("YYYY/MM/DD")}
        </Text>
        <div>
          <Text mark strong>
            To: {moment(endDate).format("YYYY/MM/DD")}
          </Text>
        </div>
        <Divider />
        <div>
          <Paragraph>
            Price: {formatPrice(price)} * {daysReserved} ={" "}
            <Text strong mark>
              {formatPrice(cityPrice)}
            </Text>
          </Paragraph>
          {/* <Paragraph>
            Fee price: ~<sub>10%</sub>= {formatPrice(fee)}
          </Paragraph>
          <Paragraph>
            <Text mark strong>
              Total price: {formatPrice(totalPrice)}
            </Text>
          </Paragraph> */}
        </div>
        <Divider />
        <CardElement hidePostalCode />
        <div style={{ marginTop: "20px" }}>
          <Button
            loading={loading}
            type="primary"
            size="large"
            onClick={handleCreateReservation}
          >
            Confirm
          </Button>
        </div>
      </>
    </Modal>
  );
};

export const WrappedCityCreateReservationModal = injectStripe(CityCreateModal);

export default CityCreateModal;
