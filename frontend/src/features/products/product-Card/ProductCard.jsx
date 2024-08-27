import { ShoppingCart } from 'lucide-react';
import React from 'react';

const ProductCard = ({ imageUrl, title }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md relative max-w-xs">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={imageUrl} // replace with actual image URL
          alt="Nano Tape Double-Sided" 
          className="w-full h-auto rounded-t-lg" 
        />
        <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
          <ShoppingCart/>
       
       
        </button>
      </div>

      {/* Product Information */}
      <div className="pt-4">
        <h2 className="text-sm font-medium text-gray-700 truncate">
          {title}
        </h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <div className="flex items-center">
            <span className="text-yellow-500">★★★★★</span>
            <span className="ml-2">100K+ sold</span>
          </div>
          <span className="ml-auto bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">Top Selling</span>
        </div>

        <div className="mt-3">
          <span className="text-lg font-bold text-red-500">LKR 353.70</span>
          <span className="line-through text-sm text-gray-400 ml-2">LKR 1,178.44</span>
        </div>

        <div className="flex items-center mt-2">
          <span className="bg-red-200 text-red-600 px-2 py-1 rounded text-xs mr-2">SuperDeals</span>
          <span className="text-xs text-gray-600">Extra 1% off with...</span>
        </div>

        <div className="mt-1">
          <span className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded text-xs">Choice</span>
          <span className="text-xs text-gray-600 ml-2">Free shipping over LKR 3,008.47</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
