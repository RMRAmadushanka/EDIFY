import React from 'react';

const CategoryCard = ({ imageUrl, title }) => {
  return (
    <div className="relative w-72 h-80 overflow-hidden group">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition duration-300 ease-in-out transform group-hover:scale-110"
      />

      {/* Gray Overlay */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>

      {/* Text and Arrow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-xl text-white">&#8594;</span>
      </div>
    </div>
  );
};

export default CategoryCard;
