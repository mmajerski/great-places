import { message, notification } from "antd";

export const successNotification = (message: string, description?: string) => {
  return notification["success"]({
    message,
    description,
    placement: "topRight",
    style: {
      marginTop: 50
    }
  });
};

export const errorNotification = (error: string) => {
  return message.error(error);
};
