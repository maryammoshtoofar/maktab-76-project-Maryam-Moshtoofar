import { Table, TablePaginationConfig, Image, Button, Space } from "antd";
import { useEffect, useState } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../redux/features/hooks";
import {
  fetchProducts,
  fetchSingleProduct,
} from "../../../../redux/features/admin/products/productsSlice";
import { ColumnsType, SorterResult } from "antd/lib/table/interface";
import { Product } from "../../../../types";
import { fetchCategories } from "../../../../redux/features/admin/categories/categoriesSlice";
import { BASE_URL } from "../../../../config/api";
import DeleteModal from "../deleteModal";
import { useSearchParams } from "react-router-dom";

const ProductTable = (props: any) => {
  const {
    selectedProductID,
    setSelectedProductID,
    setShowModal,
    setEditMode,
    searchParams,
    setSearchParams,
  } = props;

  const state = useAppSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories } = useAppSelector((state) => state.categories);
  const { queryParams } = useAppSelector((state) => state.products);
  const { loading } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts(searchParams));
    dispatch(fetchCategories());
  }, [searchParams]);

  const showCategory = (productCat: string) => {
    const cat = categories.find((category) => category.id === productCat);
    return cat?.name;
  };
  const handleEdit = (productID: string) => {
    setSelectedProductID(productID);
    dispatch(fetchSingleProduct(productID))
      .then(() => setEditMode(true))
      .then(() => setShowModal(true));
  };

  const handleDelete = (productID: string) => {
    setSelectedProductID(productID);
    setIsModalOpen(true);
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    sorter: SorterResult<Product> | SorterResult<Product[]>
  ) => {
    // if (sorter.order) {
    //   const order = sorter.order?.substring(0, sorter.order?.length - 3);
    //   searchParams.set("_order", order);
    // } else searchParams.delete("_order");
    searchParams.set("_page", String(newPagination.current));
    setSearchParams(searchParams);
    dispatch(fetchProducts(searchParams));
  };

  const columns: ColumnsType<Product> = [
    {
      title: "????????",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (__, _, index) => <>{index + 1}</>,
    },
    {
      title: "??????????",
      dataIndex: "image",
      key: "image",
      render: (_: string, record: Product) => (
        <Image width={200} src={`${BASE_URL}/files/${record.image[0]}`} />
      ),
    },
    {
      title: "?????? ????????",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "???????? ????????",
      dataIndex: "category",
      key: "category",
      sorter: (a: any, b: any) => b.category - a.category,
      render: (_: any, record: Product) => showCategory(record.category),
    },
    {
      title: "????????????",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            {" "}
            ????????????
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            {" "}
            ??????
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={[...state.products]}
        rowKey={(product) => product.id}
        pagination={queryParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <DeleteModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProduct={selectedProductID}
      />
    </>
  );
};

export default ProductTable;
