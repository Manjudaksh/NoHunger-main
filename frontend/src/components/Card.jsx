import React from 'react'
import { BiFoodTag } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { AddItem } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';

const Card = ({ name = "Unknown Item", image, id, price, type = "veg" }) => {
  let dispatch = useDispatch();

  return (
    <div className='w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group flex flex-col'>

      {/* Image Container with Zoom Effect */}
      <div className='w-full h-[180px] overflow-hidden relative'>
        <img
          src={image || "https://placehold.co/600x400?text=No+Image"}
          alt={name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold font-heading shadow-sm z-10'>
          {(type && type.toLowerCase() === "veg") ? (
            <div className='flex items-center gap-1 text-green-700'><BiFoodTag /> VEG</div>
          ) : (
            <div className='flex items-center gap-1 text-red-600'><BiFoodTag /> NON-VEG</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col flex-1 gap-3'>
        <div className='flex-1'>
          <h3 className='text-lg font-bold font-heading text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors capitalize'>{name}</h3>
          <p className='text-sm text-gray-500 mt-1 line-clamp-2 font-body'>Delicious {name?.toLowerCase() || "item"} prepared fresh for you.</p>
        </div>

        <div className='flex items-center justify-between mt-2 pt-3 border-t border-gray-100'>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-400 font-medium font-heading uppercase'>Price</span>
            <span className='font-bold text-xl text-gray-900 font-heading'>₹{price || 0}</span>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg hover:shadow-green-200 transition-all active:scale-95 flex items-center justify-center group"
            onClick={() => {
              dispatch(AddItem({ id: id, name: name, price: price, image: image, qty: 1 }));
              toast.success(`${name} Added to Cart!`)
            }}
          >
            <FaShoppingCart className='text-lg' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card