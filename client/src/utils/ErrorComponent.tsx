import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}

const ErrorComponent = ({
  message = "Something went wrong!",
  description = "Please try again"
}) => {
  return (
    <Alert
      banner
      closable
      message={message}
      description={description}
      type="error"
    />
  );
};

export default ErrorComponent;
