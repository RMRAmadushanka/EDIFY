import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input, Button, Upload, Select as AntdSelect } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories, selectSubCategories } from '../../selectors';
import { productActions } from '../../slice';

const { TextArea } = Input;

const ProductInformation = ({ data, onNext }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(data.category || '');

  const initialFileList = data.images?.map((img, index) => ({
    uid: index,
    name: `image-${index}.png`,
    status: 'done',
    thumbUrl: img.thumbUrl, // Assuming data.image is an array of objects with a url property
    originFileObj: img.originFileObj
  })) || [];

  const initialValues = {
    images: initialFileList,
    name: data.name,
    description: data.description,
    category: data.category,
    subCategory: data.subCategory,
    brand: data.brand,
  };

  useEffect(() => {
    dispatch(productActions.getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(productActions.getSubCategory({ categoryId: selectedCategory }));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    setFilteredSubCategories(subCategories.filter(sub => sub.category === selectedCategory));
  }, [subCategories, selectedCategory]);

  const handleSubmit = (values) => {
    onNext(values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="border p-5 rounded-lg">
              <Field name="images" valuePropName="fileList" getValueFromEvent={normFile}>
                {({ field }) => (
                  <Upload
                    {...field}
                    listType="picture-card"
                    multiple
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFieldValue('images', fileList)}
                    fileList={values.images}
                  >
                    {values.images.length < 5 && (
                      <div className="text-gray-500">
                        <UploadOutlined /> Upload
                      </div>
                    )}
                  </Upload>
                )}
              </Field>
            </div>
            <ErrorMessage name="images" component="div" className="text-red-500 mt-1" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <Field name="name" as={Input} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <Field name="description" as={TextArea} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Category</label>
            <Field name="category">
              {({ field }) => (
                <AntdSelect
                  {...field}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a category"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
                  onChange={(value) => {
                    setFieldValue('category', value);
                    setFieldValue('subCategory', ''); // Reset subCategory
                    setSelectedCategory(value);
                  }}
                  dropdownRender={(menu) => (
                    <div>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {menu}
                      </div>
                    </div>
                  )}
                />
              )}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 mt-1" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Sub Category</label>
            <Field name="subCategory">
              {({ field }) => (
                <AntdSelect
                  {...field}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a subcategory"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={filteredSubCategories.map((sub) => ({ value: sub._id, label: sub.name }))}
                  onChange={(value) => setFieldValue('subCategory', value)}
                  dropdownRender={(menu) => (
                    <div>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {menu}
                      </div>
                    </div>
                  )}
                />
              )}
            </Field>
            <ErrorMessage name="subCategory" component="div" className="text-red-500 mt-1" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Brand</label>
            <Field name="brand" as={Input} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <ErrorMessage name="brand" component="div" className="text-red-500 mt-1" />
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" shape="round">
              Continue
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductInformation;
