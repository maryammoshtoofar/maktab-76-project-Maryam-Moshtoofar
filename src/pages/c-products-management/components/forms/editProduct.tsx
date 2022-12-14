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
import { useEffect, useState } from "react";
import { addProductRules } from "./validation";
import { UploadOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosPrivate from "../../../../api/http";
import { UPLOAD_ROUTE } from "../../../../config/api";
import { Product } from "../../../../types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/features/hooks";
import {
  fetchProducts,
  updateProduct,
} from "../../../../redux/features/admin/products/productsSlice";
import type { UploadFile } from "antd/es/upload/interface";
import { GenerateImageURLs } from "../../../../utils";
const { Option } = Select;

const EditProductForm = (props: any) => {
  const { product } = useAppSelector((state) => state.products);
  const { selectedProductID, searchParams } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([]);
  const [imgArray, setImgArray] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setImgArray([...product.image]);
    form.setFieldsValue(product);
  }, [product]);

  useEffect(() => {
    setImgArray([...imgArray,...defaultFileList.map((img) => img.url!)]);
  }, [defaultFileList]);

  useEffect(() => {
    console.log(imgArray);
  }, [imgArray]);

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
    const selectedProduct: Product = {
      ...values,
      image: [...imgArray],
      description: description,
    };
    dispatch(
      updateProduct({ id: selectedProductID, editedProduct: selectedProduct })
    )
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
          fileList={defaultFileList}
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
          getValueFromEvent={(event, editor) => {
            const data = editor.getData();
            return data;
          }}
          rules={addProductRules.description}
        >
          <CKEditor
            value={description}
            editor={ClassicEditor}
            onChange={(event: any, editor: any) => {
              setDescription(editor.getData());
            }}
          />
        </Form.Item>
        <Space>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              ?????????? ??????????????
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

export default EditProductForm;
