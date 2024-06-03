import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productActions } from "../../slice";
import {
  selectAddProductLoading,
  selectAddSuccessModalOpen,
  selectUploadStatus,
  selectUploadedImg,
} from "../../selectors";
import { selectNotification } from "../../../base/notifications/selector";
import ERROR_TYPES from "../../../base/constants/error-types";
import TransactionModal from "../success-Modal";
import { notificationActions } from "../../../base/notifications/slice";
import { PlusOutlined } from "@ant-design/icons";
import {
  Upload,
  Button,
  Input,
  Select,
  InputNumber,
  Image,
  Form as AntForm,
  Skeleton,
} from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notification = useSelector(selectNotification);
  const SuccessModalOpen = useSelector(selectAddSuccessModalOpen);
  const uploadedImages = useSelector(selectUploadedImg);
  const uploadedStatus = useSelector(selectUploadStatus);
  const addProductLoading = useSelector(selectAddProductLoading);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [uploading, setUploading] = useState(false);

  const formRef = useRef();

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleUpload = async (fileList) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    await dispatch(productActions.uploadImg({ files: formData }));
  };

  const handleSubmit = async (values) => {
    setFormValues(values);
    await handleUpload(fileList);
  };

  useEffect(() => {
    if (uploadedStatus && formValues) {
      const productData = {
        ...formValues,
        images: uploadedImages.map((img) => ({ name: img.name, url: img.url })),
      };
      dispatch(productActions.addProduct(productData));
      setFormValues(null);
      setFileList([]);
      dispatch(productActions.clearUploadedImages());
      formRef.current.resetForm();
    }
  }, [uploadedStatus, formValues, uploadedImages, dispatch, formRef]);

  useEffect(() => {
    if (notification?.isEnabled && notification?.type === ERROR_TYPES.SUCCESS) {
      dispatch(productActions.handleToggleAddSuccessModal());
    }
  }, [notification, dispatch]);

  const handleRemove = (file) => {
    dispatch(productActions.deleteImg({ objectId: file.uid, name: file.name }));
  };

  const handleCloseModal = async () => {
    setFormValues(null);
    dispatch(productActions.handleToggleAddSuccessModal());
    dispatch(notificationActions.resetNotification());
    await dispatch(productActions.clearUploadedImages());
  };

  const handleNavigate = async () => {
    setFormValues(null);
    dispatch(productActions.handleToggleAddSuccessModal());
    dispatch(notificationActions.resetNotification());
    await dispatch(productActions.clearUploadedImages());
    navigate("/dashboard");
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter the product name"),
    description: Yup.string().required("Please enter the business description"),
    category: Yup.string().required("Please select the product category"),
    subCategory: Yup.string().required(
      "Please select the product sub category"
    ),
    quality: Yup.string().required("Please select the quality"),
    stock: Yup.number().required("Please enter the stock").min(0),
    price: Yup.number().required("Please enter the price").min(0),
    images: Yup.array()
      .min(1, "Please upload product images")
      .max(5, "Only 5 images"),
  });

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <Formik
        initialValues={{
          name: "",
          description: "",
          category: "",
          subCategory: "",
          quality: "",
          stock: 0,
          price: 0,
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {({ setFieldValue, handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {addProductLoading ? (
                  <Skeleton.Input style={{ width: 400 }} active />
                ) : (
                  <AntForm.Item
                  label="Product Name"
                  help={touched.name && errors.name ? errors.name : ""}
                  validateStatus={touched.name && errors.name ? "error" : ""}
                >
                  <Field
                    name="name"
                    as={Input}
                    placeholder="Leather Jacket Fashion Girl Planner"
                  />
                </AntForm.Item>
                )}

                {addProductLoading ? (
                  <Skeleton.Input
                    style={{ width: 400, height: 80, marginTop: 10 }}
                    active
                  />
                ) : (
                  <AntForm.Item
                    label="Business Description"
                    help={
                      touched.description && errors.description
                        ? errors.description
                        : ""
                    }
                    validateStatus={
                      touched.description && errors.description ? "error" : ""
                    }
                  >
                    <Field
                      name="description"
                      as={Input.TextArea}
                      rows={3}
                      placeholder="We have been doing jacket business for many years together with our partners."
                    />
                  </AntForm.Item>
                )}

                {addProductLoading ? (
                  <Skeleton.Input
                    style={{ width: 400, marginTop: 10 }}
                    active
                  />
                ) : (
                  <AntForm.Item
                    label="Product Category"
                    help={
                      touched.category && errors.category ? errors.category : ""
                    }
                    validateStatus={
                      touched.category && errors.category ? "error" : ""
                    }
                  >
                    <Field name="category">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select a category"
                          onChange={(value) => setFieldValue("category", value)}
                          value={values.category}
                        >
                          <Option value="Outerwear & Winter">
                            Outerwear & Winter
                          </Option>
                          <Option value="Leather Jacket">Leather Jacket</Option>
                        </Select>
                      )}
                    </Field>
                  </AntForm.Item>
                )}

                {addProductLoading ? (
                  <Skeleton.Input
                    style={{ width: 400, marginTop: 10 }}
                    active
                  />
                ) : (
                  <AntForm.Item
                    label="Product Sub Category"
                    help={
                      touched.subCategory && errors.subCategory
                        ? errors.subCategory
                        : ""
                    }
                    validateStatus={
                      touched.subCategory && errors.subCategory ? "error" : ""
                    }
                  >
                    <Field name="subCategory">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select a sub category"
                          onChange={(value) =>
                            setFieldValue("subCategory", value)
                          }
                          value={values.subCategory}
                        >
                          <Option value="Outerwear & Winter">
                            Outerwear & Winter
                          </Option>
                          <Option value="Leather Jacket">Leather Jacket</Option>
                        </Select>
                      )}
                    </Field>
                  </AntForm.Item>
                )}
                {addProductLoading ? (
                  <Skeleton.Input
                    style={{ width: 400, marginTop: 10 }}
                    active
                  />
                ) : (
                  <AntForm.Item
                    label="Quality"
                    help={
                      touched.quality && errors.quality ? errors.quality : ""
                    }
                    validateStatus={
                      touched.quality && errors.quality ? "error" : ""
                    }
                  >
                    <Field name="quality">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select quality"
                          onChange={(value) => setFieldValue("quality", value)}
                          value={values.quality}
                        >
                          <Option value="New">New</Option>
                          <Option value="Second Hand">Second Hand</Option>
                        </Select>
                      )}
                    </Field>
                  </AntForm.Item>
                )}
              </div>

              <div>
                {addProductLoading ? (
                  <Skeleton.Input style={{ width: 400 }} active />
                ) : (
                  <AntForm.Item
                    label="Stock"
                    help={touched.stock && errors.stock ? errors.stock : ""}
                    validateStatus={
                      touched.stock && errors.stock ? "error" : ""
                    }
                  >
                    <Field name="stock">
                      {({ field }) => (
                        <InputNumber
                          {...field}
                          min={0}
                          className="w-full"
                          placeholder="Number of items in stock"
                          onChange={(value) => setFieldValue("stock", value)}
                          value={values.stock}
                        />
                      )}
                    </Field>
                  </AntForm.Item>
                )}
                {addProductLoading ? (
                  <Skeleton.Input
                    style={{ width: 400, marginTop: 10 }}
                    active
                  />
                ) : (
                  <AntForm.Item
                    label="Price"
                    help={touched.price && errors.price ? errors.price : ""}
                    validateStatus={
                      touched.price && errors.price ? "error" : ""
                    }
                  >
                    <Field name="price">
                      {({ field }) => (
                        <InputNumber
                          {...field}
                          min={0}
                          className="w-full"
                          placeholder="Price of the product"
                          onChange={(value) => setFieldValue("price", value)}
                          value={values.price}
                        />
                      )}
                    </Field>
                  </AntForm.Item>
                )}

                {addProductLoading ? (
                  <Skeleton.Input
                    style={{
                      width: 400,
                      marginTop: 10,
                      height: 100,
                      marginBottom: 40,
                    }}
                    active
                  />
                ) : (
                  <div>
                    <AntForm.Item
                      label="Product Images"
                      help={
                        touched.images && errors.images ? errors.images : ""
                      }
                      validateStatus={
                        touched.images && errors.images ? "error" : ""
                      }
                    >
                      <Upload
                        multiple
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        beforeUpload={(file, fileList) => {
                          setFieldValue("images", [...fileList, file]);
                          return false; // Prevent automatic upload
                        }}
                      >
                        {fileList.length >= 5 ? null : uploadButton}
                      </Upload>
                    </AntForm.Item>
                    <AntForm.Item>
                      {previewImage && (
                        <Image
                          wrapperStyle={{
                            display: "none",
                          }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      )}
                    </AntForm.Item>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={addProductLoading}
                    iconPosition="end"
                  >
                    Add Product
                  </Button>
                  <Button
                    type="default"
                    onClick={() => navigate("/product-list")}
                  >
                    Save Product
                  </Button>
                  <Button
                    type="default"
                    danger
                    onClick={() => navigate("/product-list")}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {SuccessModalOpen && (
        <TransactionModal
          isOpen={SuccessModalOpen}
          onClose={handleCloseModal}
          goBack={handleNavigate}
          message={notification?.message}
        />
      )}
    </div>
  );
};

export default AddProduct;
