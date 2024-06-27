import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input, Button, Select, DatePicker, Switch, InputNumber } from "antd";
import { pricingInformationSchema } from "../../validation/product-validation";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const PricingInformation = ({ data, onBack, onNext }) => {
  const initialValues = {
    pricingModel: data.pricingModel,
    price: data.price,
    currency: data.currency,
    billingPeriod: data.billingPeriod,
    promotionName: data.promotionName,
    validTill: data.validTill,
    noEnd: data.noEnd,
    discountType: data.discountType,
    discountValue: data.discountValue,
    limitType: data.limitType,
  };

  const [showDiscountFields, setShowDiscountFields] = useState(
    initialValues.pricingModel === "discounted"
  );

  const handleSubmit = (values) => {
    onNext(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Pricing Model
            </label>
            <Field name="pricingModel">
              {({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Select pricing model"
                  onChange={(value) => {
                    setFieldValue("pricingModel", value);
                    setShowDiscountFields(value === "discounted");
                  }}
                >
                  <Option value="standard">Standard pricing</Option>
                  <Option value="discounted">Discounted pricing</Option>
                </Select>
              )}
            </Field>
            <ErrorMessage
              name="pricingModel"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Price
            </label>
            <Field name="price" as={Input} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Currency
            </label>
            <Field name="currency">
              {({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Select currency"
                  onChange={(value) => setFieldValue("currency", value)}
                >
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              )}
            </Field>
            <ErrorMessage
              name="currency"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Billing Period
            </label>
            <Field name="billingPeriod">
              {({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Select billing period"
                  onChange={(value) => setFieldValue("billingPeriod", value)}
                >
                  <Option value="monthly">Monthly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              )}
            </Field>
            <ErrorMessage
              name="billingPeriod"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>

          {showDiscountFields && (
            <div className="space-y-6">
              <div className="md:flex md:items-end md:space-x-4">
                <div className="w-full md:w-1/3">
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Promotion Name
                  </label>
                  <Field name="promotionName" as={Input} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <ErrorMessage
                    name="promotionName"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Valid Till
                  </label>
                  <Field name="validTill">
                    {({ field }) => (
                      <DatePicker
                        {...field}
                        format="YYYY-MM-DD"
                        value={values.validTill ? moment(values.validTill, "YYYY-MM-DD") : null}
                        onChange={(date, dateString) =>
                          setFieldValue("validTill", dateString)
                        }
                        disabled={values.noEnd}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="validTill"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
                <div className="flex items-center md:items-end mt-4 md:mt-0 md:w-auto">
                  <Field name="noEnd" type="checkbox">
                    {({ field }) => (
                      <Switch
                        {...field}
                        checked={values.noEnd}
                        onChange={(checked) => setFieldValue("noEnd", checked)}
                      />
                    )}
                  </Field>
                  <label className="ml-2 text-lg font-medium text-gray-700">No end</label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Promotion Details:
                </label>
                <div className="md:flex md:space-x-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <Field name="discountType">
                      {({ field }) => (
                        <Select
                          {...field}
                          style={{ width: "100%" }}
                          placeholder="Select discount type"
                          onChange={(value) =>
                            setFieldValue("discountType", value)
                          }
                        >
                          <Option value="percentage">Percentage discount</Option>
                          <Option value="fixed">Fixed amount discount</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="discountType"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                  <div className="w-full md:w-1/3 mt-4 md:mt-0">
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <Field name="discountValue">
                      {({ field }) => (
                        <InputNumber
                          {...field}
                          min={0}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            setFieldValue("discountValue", value)
                          }
                          formatter={(value) =>
                            values.discountType === "percentage"
                              ? `${value}%`
                              : `${value}`
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="discountValue"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                  <div className="w-full md:w-1/3 mt-4 md:mt-0">
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                      Limit Type
                    </label>
                    <Field name="limitType">
                      {({ field }) => (
                        <Select
                          {...field}
                          style={{ width: "100%" }}
                          placeholder="Select limit type"
                          onChange={(value) =>
                            setFieldValue("limitType", value)
                          }
                        >
                          <Option value="minimumFee">Minimum fee</Option>
                          <Option value="noLimit">No limits</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="limitType"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={onBack}>Back</Button>
            <Button type="primary" htmlType="submit" shape="round">
              Continue
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PricingInformation;
