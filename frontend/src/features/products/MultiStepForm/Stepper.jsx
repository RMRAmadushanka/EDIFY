import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const Stepper = ({ current }) => {
  return (
    <div className="flex justify-center lg:justify-start">
      <Steps
        direction="vertical lg:horizontal" 
        current={current}
        className="w-full lg:w-auto"
      >
        <Step title="Product Information" />
        <Step title="Pricing Information" />
        <Step title="Review" />
      </Steps>
    </div>
  );
};

export default Stepper;
