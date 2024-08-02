import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Switch,
  Tag,
  Space,
  Modal,
  Input,
  Checkbox,
  Form as AntForm,
  Card,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction } from "../../slice";
import {
  selectCategories,
  selectPagination,
  selectTotalCategories,
  selectUploadStatus,
  selectUploadedLogo,
} from "../../selectors";
import { debounce } from "lodash";

const { Search } = Input;

const CategorySchema = Yup.object({
  name: Yup.string().required("Category Name is required"),
  logo: Yup.mixed().required("Category Logo is required"),
});

const SubcategorySchema = Yup.object({
  name: Yup.string().required("Subcategory Name is required"),
});

const CategoryManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
    useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [tempSubcategories, setTempSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const dispatch = useDispatch();
  const uploadedLogo = useSelector(selectUploadedLogo);
  const createdCategory = useSelector(selectCategories);
  const logoUploadCompleted = useSelector(selectUploadStatus);
  const categories = useSelector(selectCategories);
  const totalCategories = useSelector(selectTotalCategories);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalCategories,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(
    debounce((current, pageSize, search) => {
      let formattedParamString = `page=${current}&limit=${pageSize}`;
      if (search) {
        formattedParamString += `&search=${search}`;
      }
      dispatch(categoryAction.fetchCategories({ query: formattedParamString }));
    }, 300), // Adjust the debounce delay as needed
    [dispatch]
  );

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, searchTerm);
  }, [fetchProducts, pagination.current, pagination.pageSize, searchTerm]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: totalCategories,
    }));
  }, [totalCategories]);

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: 1,
    }));
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleUpload = async (values) => {
    const formData = new FormData();
    formData.append("file", values.logo);
    await dispatch(categoryAction.uploadCategoryLogo({ files: formData }));
  };

  const handleOk = async (values, { resetForm }) => {
    await setFormValues(values);
    await handleUpload(values);
    resetForm(); // Reset the form after submission
    setFileList([]); // Clear the file list after submission
  };

  useEffect(() => {
    if (logoUploadCompleted) {
      const CategoryData = {
        ...formValues,
        logo: uploadedLogo,
        subcategories: tempSubcategories,
      };
      dispatch(categoryAction.addCategory(CategoryData));
      message.success("Category added successfully!");
      setIsModalVisible(false);
      setCurrentCategory(null);
      setTempSubcategories([]);
    }
  }, [logoUploadCompleted, uploadedLogo]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCategory(null);
    setTempSubcategories([]);
    setFormValues(null);
  };

  const showSubcategoryModal = (subcategory = null, categoryId = null) => {
    setCurrentSubcategory(subcategory);
    setSelectedCategoryId(categoryId);
    setIsSubcategoryModalVisible(true);
  };

  const showAddOneSubcategoryModal = (
    subcategory = null,
    categoryId = null
  ) => {
    setCurrentSubcategory(subcategory);
    setSelectedCategoryId(categoryId);
    setIsSubcategoryModalVisible(true);
  };
  const handleSubcategoryOk = (values, { resetForm }) => {
    if (currentSubcategory) {
      setTempSubcategories(
        tempSubcategories.map((sub) =>
          sub.key === currentSubcategory.key
            ? { ...values, key: currentSubcategory.key }
            : sub
        )
      );
    } else if (selectedCategoryId) {
      dispatch(
        categoryAction.addSubCategory({
          categoryId: selectedCategoryId,
          ...values,
        })
      );
    } else {
      setTempSubcategories([
        ...tempSubcategories,
        { ...values, key: Date.now().toString() },
      ]);
    }
    setIsSubcategoryModalVisible(false);
    setCurrentSubcategory(null);
    resetForm();
  };

  const handleSubcategoryCancel = () => {
    setIsSubcategoryModalVisible(false);
    setCurrentSubcategory(null);
  };

  const deleteSubcategory = (key) => {
    setTempSubcategories(tempSubcategories.filter((sub) => sub.key !== key));
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const renderCategoryName = (category) =>
    `${category.name} (${category.count})`;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, category) => renderCategoryName(category),
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (featured) => (featured ? "✓" : "✗"),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "active",
      render: (status) => <Switch checked={status === "Active"} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showAddOneSubcategoryModal(null, record._id)}>
            Add Subcategory
          </Button>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Button>Delete</Button>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (category) => (
    <div>
      {category.subcategories.map((subcategory) => (
        <Card key={subcategory.key} className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{subcategory.name}</h3>
              <p>{subcategory.products}</p>
              <Tag color={subcategory.status === "Active" ? "green" : "red"}>
                {subcategory.status}
              </Tag>
            </div>
            <Space size="middle">
              <Button onClick={() => showSubcategoryModal(subcategory)}>
                Edit
              </Button>
              <Button onClick={() => deleteSubcategory(subcategory.key)}>
                Delete
              </Button>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          New Category
        </Button>
      </div>
      <Search
        placeholder="Search by name"
        onChange={(e) => handleSearch(e.target.value)}
        value={searchTerm}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={categories}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
        expandable={{ expandedRowRender }}
        rowKey="_id"
      />
      <Modal
        title={currentCategory ? "Edit Category" : "New Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Formik
          initialValues={
            currentCategory || {
              name: "",
              featured: false,
              status: "Active",
              subcategories: [],
              logo: null,
            }
          }
          validationSchema={CategorySchema}
          onSubmit={handleOk}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched, resetForm }) => (
            <Form>
              <AntForm.Item label="Category Name" required>
                <Field name="name" as={Input} />
                {errors.name && touched.name ? (
                  <div className="error">{errors.name}</div>
                ) : null}
              </AntForm.Item>
              <AntForm.Item label="Category Logo" required>
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={(file) => {
                    setFieldValue("logo", file);
                    return false; // Prevent automatic upload
                  }}
                >
                  {fileList.length >= 1 ? null : (
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  )}
                </Upload>
                {errors.logo && touched.logo ? (
                  <div className="error">{errors.logo}</div>
                ) : null}
              </AntForm.Item>
              <AntForm.Item>
                <Field name="featured" type="checkbox" as={Checkbox}>
                  Featured
                </Field>
              </AntForm.Item>
              <AntForm.Item label="Status">
                <Switch
                  checked={values.status === "Active"}
                  onChange={(checked) =>
                    setFieldValue("status", checked ? "Active" : "Inactive")
                  }
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </AntForm.Item>
              <AntForm.Item label="Subcategories">
                {tempSubcategories.length < 10 && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => showSubcategoryModal()}
                  >
                    Add Subcategory
                  </Button>
                )}
                <div className="mt-2">
                  {tempSubcategories.map((sub) => (
                    <div
                      key={sub.key}
                      className="flex justify-between items-center mb-2 p-2 border rounded"
                      style={{ width: "200px" }}
                    >
                      <span>{sub.name}</span>
                      <Space size="small">
                        <EditOutlined
                          onClick={() => showSubcategoryModal(sub)}
                        />
                        <DeleteOutlined
                          onClick={() => deleteSubcategory(sub.key)}
                        />
                      </Space>
                    </div>
                  ))}
                </div>
              </AntForm.Item>
              <div className="flex justify-end">
                <Button type="default" onClick={handleCancel} className="mr-2">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {currentCategory ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        title={currentSubcategory ? "Edit Subcategory" : "New Subcategory"}
        visible={isSubcategoryModalVisible}
        onCancel={handleSubcategoryCancel}
        footer={null}
      >
        <Formik
          initialValues={
            currentSubcategory || {
              name: "",
              featured: false,
              status: "Active",
            }
          }
          validationSchema={SubcategorySchema}
          onSubmit={handleSubcategoryOk}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched, resetForm }) => (
            <Form>
              <AntForm.Item label="Subcategory Name" required>
                <Field name="name" as={Input} />
                {errors.name && touched.name ? (
                  <div className="error">{errors.name}</div>
                ) : null}
              </AntForm.Item>
              <AntForm.Item>
                <Field name="featured" type="checkbox" as={Checkbox}>
                  Featured
                </Field>
              </AntForm.Item>
              <AntForm.Item label="Status">
                <Switch
                  checked={values.status === "Active"}
                  onChange={(checked) =>
                    setFieldValue("status", checked ? "Active" : "Inactive")
                  }
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </AntForm.Item>
              <div className="flex justify-end">
                <Button
                  type="default"
                  onClick={handleSubcategoryCancel}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {currentSubcategory ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
