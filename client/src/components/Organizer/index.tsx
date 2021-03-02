import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Layout,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Divider,
  Spin
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";

import { Viewer } from "../../utils/types";
import {
  errorNotification,
  successNotification
} from "../../utils/NotificationComponent";
import { CREATE_CITY } from "../../graphql/mutations";
import {
  CreateCity as CreateCityData,
  CreateCityVariables
} from "../../graphql/mutations/__generated__/CreateCity";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage || !fileIsValidSize) {
    errorNotification("Invalid size or type");
    return false;
  }

  return fileIsValidSize && fileIsValidImage;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const Organizer = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [createCity, { loading, data }] = useMutation<
    CreateCityData,
    CreateCityVariables
  >(CREATE_CITY, {
    onCompleted: () => {
      successNotification("City added sucessfully!");
    },
    onError: () => {
      errorNotification("Could not add city. Please try again");
    }
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content>
        <>
          <Title level={3}>
            You need to connect with stripe to create new city
          </Title>
          <Button type="primary">
            <Link to={`/user/${viewer.id}`}>Connect with stripe</Link>
          </Button>
        </>
      </Content>
    );
  }

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const onFinish = (values: any) => {
    const input = {
      ...values,
      image: imageBase64Value,
      price: values.price * 100
    };

    createCity({
      variables: {
        input
      }
    });
  };

  return (
    <Content
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Title level={3}>Create new city that people can visit!</Title>
        <Item
          name="name"
          rules={[{ required: true, message: "Field required" }]}
          label="Name"
          extra="Max length 45"
        >
          <Input maxLength={45} placeholder="Name" />
        </Item>
        <Item
          name="description"
          rules={[{ required: true, message: "Field required" }]}
          label="Description"
          extra="Max length 400"
        >
          <Input.TextArea rows={3} maxLength={400} placeholder="Description" />
        </Item>
        <Item
          name="address"
          rules={[{ required: true, message: "Field required" }]}
          label="Address"
        >
          <Input placeholder="Address" />
        </Item>
        <Item
          name="price"
          rules={[{ required: true, message: "Field required" }]}
          label="Price"
        >
          <InputNumber min={0} placeholder="1000" />
        </Item>
        <Item
          name="maxVisitors"
          rules={[{ required: true, message: "Field required" }]}
          label="Max Visitors"
        >
          <InputNumber min={0} placeholder="4" />
        </Item>
        <Item
          name="image"
          rules={[{ required: true, message: "Field required" }]}
          label="Image"
          extra="Max size 1MB, type JPG or PNG"
        >
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            customRequest={dummyRequest}
            beforeUpload={beforeImageUpload}
            onChange={handleImageUpload}
          >
            {imageBase64Value ? (
              <img
                src={imageBase64Value}
                alt="City"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text>City Image</Text>
            )}
          </Upload>
        </Item>
        <Divider />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Content>
  );
};

export default Organizer;
