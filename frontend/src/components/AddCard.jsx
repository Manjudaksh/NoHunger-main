import React from "react";
import image1 from "../assets/image1.jpg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { RemoveItem } from "../redux/cartSlice";
import { IncrementQty } from "../redux/cartSlice";
import { DecrementQty } from "../redux/cartSlice";

const AddCard = ({ name, id, price, image, qty }) => {

  let dispatch = useDispatch()
  return (
    <div className="w-full h-[120px] p-2 shadow-lg flex justify-between">
      <div className="w-[60%] h-full flex gap-5">
        <div className="w-[60%] h-full overflow-hidden rounded-md">
          <img className="object-cover rounded-md" src={image} alt="" />
        </div>
        <div className="w-[40%] h-full flex flex-col gap-3">
          <div className="text-md text-gray-600 font-semibold font-heading ml-2 capitalize">{name}</div>
          <div className="w-[100px] h-[40px] bg-slate-400 flex mr-5 rounded-lg shadow-lg overflow-hidden border-2 border-gray-400">
            <button className="w-[30%] text-3xl h-full bg-white hover:bg-gray-200 flex items-center justify-center" onClick={() => {
              qty > 1 ? dispatch(DecrementQty(id)) : qty
            }}>-</button>
            <span className="w-[40%] text-xl font-heading h-full bg-slate-300 flex items-center justify-center">{qty}</span>
            <button className="w-[30%] text-2xl h-full bg-white hover:bg-gray-200 flex items-center justify-center" onClick={() => {
              dispatch(IncrementQty(id))
            }}>+</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-end gap-6">
        <span className="text-lg text-[#1c1c1c] font-semibold font-heading">₹ {price}/-</span>
        <RiDeleteBin6Line className="text-2xl text-red-700 hover:text-red-600 cursor-pointer" onClick={() => dispatch(RemoveItem(id))} />

      </div>
    </div>
  );
};

export default AddCard;
