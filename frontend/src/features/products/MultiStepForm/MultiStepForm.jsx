import { useEffect, useState } from "react";
import Stepper from "./Stepper";
import ProductInformation from "./ProductInformation";
import PricingInformation from "./PricingInformation";
import Review from "./Review";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../slice";
import { selectUploadStatus, selectUploadedImg } from "../../selectors";
import { message } from "antd";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const uploadedImages = useSelector(selectUploadedImg);
  const uploadedStatus = useSelector(selectUploadStatus);

  const initialFormData = {
    images: [],
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    price: "",
    currency: "USD",
    pricingModel: "",
    promotionName: "",
    validTill: "",
    noEnd: "",
    discountType: "",
    discountValue: "",
    limitType: "",
    type: "",
    billingPeriod: "monthly",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleNext = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = (step) => {
    setCurrentStep(step !== undefined ? step : (prevStep) => prevStep - 1);
  };

  useEffect(() => {
    if (uploadedStatus) {
      const productData = {
        ...formData,
        images: uploadedImages.map((img) => ({ name: img.name, url: img.url })),
      };
      dispatch(productActions.addProduct(productData));
      dispatch(productActions.clearUploadedImages());
      setFormData(initialFormData); // Reset the form data
      setCurrentStep(0); // Reset to the first step
    }
  }, [uploadedStatus, uploadedImages, dispatch]);

  const handleSubmit = async () => {
    // Upload images first
    const formDataObj = new FormData();
    formData.images.forEach((image) => {
      formDataObj.append("file", image.originFileObj);
    });
    await dispatch(productActions.uploadImg({ files: formDataObj }));
    message.success('Category added successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/4 w-full">
            <Stepper current={currentStep} />
          </div>
          <div className="lg:w-3/4 w-full p-4 lg:border-l border-gray-200">
            {currentStep === 0 && (
              <ProductInformation
                data={formData}
                onNext={(data) => handleNext(data)}
              />
            )}
            {currentStep === 1 && (
              <PricingInformation
                data={formData}
                onBack={() => handleBack(0)}
                onNext={(data) => handleNext(data)}
              />
            )}
            {currentStep === 2 && (
              <Review
                data={formData}
                onBack={(step) => handleBack(step)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

