import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Tag, Space, Modal, Input, Checkbox, Form as AntForm, Card, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction } from "../../slice";
import { selectCategories, selectUploadStatus, selectUploadedLogo } from "../../selectors";

const initialCategories = [
  {
    key: "1",
    name: "Clothes",
    count: 14,
    featured: false,
    products: "3 products",
    status: "Active",
    logo: null,
    subcategories: [
      {
        key: "1-1",
        name: "Clothes for women",
        count: 7,
        featured: true,
        products: "5 products",
        status: "Inactive",
      },
      {
        key: "1-2",
        name: "Clothes for Kids",
        count: 2,
        featured: true,
        products: "",
        status: "Active",
        subcategories: [
          {
            key: "1-2-1",
            name: "Fall-Winter 2017",
            count: null,
            featured: false,
            products: "",
            status: "Active",
          },
          {
            key: "1-2-2",
            name: "Spring-Summer 2018",
            count: null,
            featured: false,
            products: "",
            status: "Active",
          },
        ],
      },
      {
        key: "1-3",
        name: "Clothes for men",
        count: 6,
        featured: false,
        products: "9 products",
        status: "Active",
      },
    ],
  },
  // Additional categories...
];

const CategorySchema = Yup.object({
  name: Yup.string().required("Category Name is required"),
  logo: Yup.mixed().required("Category Logo is required"),
});

const SubcategorySchema = Yup.object({
  name: Yup.string().required("Subcategory Name is required"),
});

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
    useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [tempSubcategories, setTempSubcategories] = useState([]);
  const [addingSubcategory, setAddingSubcategory] = useState(false); // New state for tracking subcategory addition within category modal
  const dispatch = useDispatch();
  const uploadedLogo = useSelector(selectUploadedLogo);
  const createdCategory = useSelector(selectCategories);
  const logoUploadCompleted = useSelector(selectUploadStatus);

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

  const showSubcategoryModal = (subcategory = null) => {
    setCurrentSubcategory(subcategory);
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
          <Button onClick={() => showSubcategoryModal()}>
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
      <Table
        columns={columns}
        dataSource={categories}
        pagination={{ pageSize: 12 }}
        expandable={{ expandedRowRender }}
        rowKey="key"
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
                {tempSubcategories.length < 10 && !addingSubcategory && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setAddingSubcategory(true)}
                  >
                    Add Subcategory
                  </Button>
                )}
                <div className="mt-2">
                  {tempSubcategories.map((sub) => (
                    <div
                      key={sub.key}
                      className="flex inline-flex justify-between ml-2 items-center mb-2 p-2 border rounded"
                    >
                      <span className="p-2">{sub.name}</span>
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
              {addingSubcategory && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">
                    New Subcategory
                  </h2>
                  <Formik
                    initialValues={{
                      name: "",
                      featured: false,
                      status: "Active",
                    }}
                    validationSchema={SubcategorySchema}
                    onSubmit={(values, actions) => {
                      handleSubcategoryOk(values, actions);
                      setAddingSubcategory(false);
                    }}
                    enableReinitialize
                  >
                    {({
                      values,
                      setFieldValue,
                      errors,
                      touched,
                      resetForm,
                    }) => (
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
                              setFieldValue(
                                "status",
                                checked ? "Active" : "Inactive"
                              )
                            }
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                          />
                        </AntForm.Item>
                        <div className="flex justify-end">
                          <Button
                            type="default"
                            onClick={() => setAddingSubcategory(false)}
                            className="mr-2"
                          >
                            Cancel
                          </Button>
                          <Button type="primary" htmlType="submit">
                            Add Subcategory
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
              <div className="flex justify-end mt-4">
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
