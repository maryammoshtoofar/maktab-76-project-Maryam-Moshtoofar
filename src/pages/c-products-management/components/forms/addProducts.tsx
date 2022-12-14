import {
  Button,
  Form,
  Input,
  message,
  Progress,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { useState } from "react";
import { addProductRules } from "./validation";
import { UploadOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosPrivate from "../../../../api/http";
import { UPLOAD_ROUTE } from "../../../../config/api";
import { Product } from "../../../../types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/features/hooks";
import {
  createProduct,
  fetchProducts,
} from "../../../../redux/features/admin/products/productsSlice";
import { useSearchParams } from "react-router-dom";
const { Option } = Select;

const AddProductForm = (props: any) => {
  const { product } = useAppSelector((state) => state.products);

  const { modalOptions, searchParams } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [imgArray, setImgArray] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const dispatch = useAppDispatch();

  const handleOnChange = (options: any) => {
    setDefaultFileList(options.fileList);
  };

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("image", file);
    try {
      const res = await axiosPrivate.post(UPLOAD_ROUTE, fmData, config);
      onSuccess("Ok");
      setImgArray([...imgArray, res.data.filename]);
      message.success(`?????????? ?????????? ????`);
    } catch (err) {
      message.error(`??????`);
      onError({ err });
    }
  };

  const handleOk = () => {
    message.loading("Action in progress..");
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };

  const onFinish = (values: any) => {
    const newProduct: Product = {
      ...values,
      image: imgArray,
      createdAt: new Date(),
      description: description,
    };
    dispatch(createProduct(newProduct))
      .then(() => dispatch(fetchProducts(searchParams)))
      .then(() => {
        setImgArray([]);
        setDefaultFileList([]);
      });
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="?????? ????????"
        rules={addProductRules.productName}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="category"
        label="???????? ????????"
        rules={addProductRules.category}
      >
        <Select placeholder="???????????? ???????? ????????" allowClear>
          <Option value={1}>???????? ??????</Option>
          <Option value={2}>???????? ?????? ?? ????????????</Option>
          <Option value={3}>?????????? ?????????? ????????</Option>
          <Option value={4}>???????? ???????? ?? ??????????</Option>
        </Select>
      </Form.Item>
      <Form.Item
        valuePropName="fileList"
        label="???????????? ?????? ????"
        rules={addProductRules.images}
      >
        <Upload
          accept="image/*"
          customRequest={handleUpload}
          onChange={handleOnChange}
          listType="picture-card"
          defaultFileList={defaultFileList}
        >
          {defaultFileList.length >= 5 ? null : (
            <Button>{<UploadOutlined />}??????????</Button>
          )}
        </Upload>
        {progress > 0 ? <Progress percent={progress} /> : null}
      </Form.Item>
      <Form.Item name="price" label="????????" rules={addProductRules.price}>
        <Input />
      </Form.Item>
      <Form.Item name="quantity" label="??????????" rules={addProductRules.quantity}>
        <Input />
      </Form.Item>
      <Row>
        <Form.Item
          name="description"
          label="??????????????"
          valuePropName="data"
          getValueFromEvent={(_, editor) => {
            const data = editor.getData();
            return data;
          }}
          rules={addProductRules.description}
        >
          <CKEditor
            value={description}
            editor={ClassicEditor}
            onChange={(_: any, editor: any) => {
              setDescription(editor.getData());
            }}
          />
        </Form.Item>
        <Space>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              ?????????? ?????????? ????????
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="button">????????</Button>
          </Form.Item>
        </Space>
      </Row>
    </Form>
  );
};

export default AddProductForm;
