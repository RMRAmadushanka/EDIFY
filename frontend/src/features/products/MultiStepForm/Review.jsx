import React from 'react';
import { Button, Progress } from 'antd';

const Review = ({ data, onBack, onSubmit }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150';
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Progress percent={100} showInfo={false} className="mb-6" />
      <div className="flex flex-col items-center mb-6">
        <div className="w-full mb-4">
          <div className="grid grid-cols-3 gap-4">
            {data.images.length > 0 ? (
              <>
                {data.images.map((img, index) => (
                  <div key={index} className="h-40 overflow-hidden">
                    <img
                      src={img.thumbUrl || img.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-3 h-36">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        <h2 className="text-xl font-bold">{data.name}</h2>
        <Button type="link" className="mt-2" onClick={() => onBack(0)}>Edit Images</Button>
      </div>
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <p className="mb-2"><strong>Product Name:</strong> {data.name}</p>
        <p className="mb-2"><strong>Product Description:</strong> {data.description}</p>
        <p className="mb-2"><strong>Category:</strong> {data.category}</p>
        <p className="mb-2"><strong>Brand:</strong> {data.brand}</p>
        <Button type="link" onClick={() => onBack(0)}>Edit Details</Button>
      </div>
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
        <p className="mb-2"><strong>Price:</strong> {data.price} {data.currency}</p>
        <p className="mb-2"><strong>Pricing Model:</strong> {data.pricingModel}</p>
        <p className="mb-2"><strong>Type:</strong> {data.type}</p>
        <p className="mb-2"><strong>Billing Period:</strong> {data.billingPeriod}</p>
        <Button type="link" onClick={() => onBack(1)}>Edit Pricing</Button>
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={() => onBack(1)}>Back</Button>
        <Button type="primary" onClick={onSubmit}>Create Product</Button>
      </div>
    </div>
  );
};

export default Review;
