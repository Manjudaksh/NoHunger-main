import React, { useContext, useState } from "react";
import Nav from "../components/Nav";
import Categories from "../Category";
import Card from "../components/Card";
import { food_items } from "../food";
import { dataContext } from "../context/UserContext";
import { IoClose } from "react-icons/io5";
import AddCard from "../components/AddCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Home = () => {
  let { cate, setCate, input, showCart, setShowCart } = useContext(dataContext);

  function filter(category) {
    if (category === "All") {
      setCate(food_items);
    } else {
      let newList = food_items.filter(
        (item) => item.food_category === category
      );
      setCate(newList);
    }
  }

  let items = useSelector((state) => state.cart);

  let subtotal = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  console.log(subtotal);
  let deliveryFee = 20;
  let taxes = (subtotal * 0.5) / 100;
  let total = Math.floor(subtotal + deliveryFee + taxes);

  return (
    <div className="bg-[#b7b3b3] w-full h-screen flex overflow-hidden">
      {/* LEFT SIDE - CATEGORIES (20%) */}
      {!input && (
        <div className="w-[20%] h-full p-4 flex flex-col gap-5 bg-[#b7b3b3] overflow-y-auto border-r-1">
          {Categories.map((item) => (
            <div
              key={item.name}
              className="bg-white w-full h-[100px] rounded-md shadow-xl flex flex-col items-center gap-2 justify-center hover:bg-gray-300 cursor-pointer transition-all duration-200 shrink-0"
              onClick={() => filter(item.name)}
            >
              <div className="w-[50px] h-[50px] flex items-center justify-center">
                {item.icon}
              </div>
              <div className="text-[14px] font-semibold text-gray-600">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT SIDE - NAV & ITEMS (80%) */}
      <div className="w-[80%] h-full flex flex-col bg-[#b7b3b3]">
        <Nav />
        <div className="flex-1 overflow-y-auto pb-10 px-5">
          <div className="w-full flex flex-wrap gap-5 justify-center items-center mt-8">
            {cate.length > 0 ? (
              cate.map((item) => (
                <Card
                  key={item.id}
                  name={item.food_name}
                  image={item.food_image}
                  price={item.price}
                  type={item.food_type}
                  id={item.id}
                />
              ))
            ) : (
              <div className="font-semibold text-emerald-800 text-xl">
                No Dish Found
              </div>
            )}
          </div>
        </div>
      </div>



      <div
        className={`w-full md:w-[40vw] h-[100%] fixed right-0 top-0 bg-white shadow-xl p-5 transition-all duration-500 overflow-auto ${showCart ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <header className="w-[100%] flex justify-between items-center">
          <span className="text-[18px] font-semibold text-gray-600">
            Order items
          </span>
          <IoClose
            onClick={() => setShowCart(false)}
            className="w-[30px] h-[30px] text-[15px] text-gray-600 cursor-pointer hover:text-gray-500"
          />
        </header>

        {items.length > 0 ? <>
          <div className="w-full mt-8 flex flex-col gap-6">
            {items.map((item) => (
              <AddCard
                name={item.name}
                price={item.price}
                id={item.id}
                image={item.image}
                qty={item.qty}
              />
            ))}
          </div>
          <div className="w-full border-t-2 border-b-2 border-gray-400 mt-5 flex flex-col gap-2 p-5">
            <div className="w-full flex justify-between items-center">
              <span className="text-md text-gray-600 font-semibold">
                Subtotal
              </span>
              <span className="text-md font-semibold text-[#1c1c1c]">
                ₹ {subtotal}/-
              </span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-md text-gray-600 font-semibold">
                Delivery Free
              </span>
              <span className="text-md font-semibold text-[#1c1c1c]">
                ₹ {deliveryFee}/-
              </span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-md text-gray-600 font-semibold">Taxes</span>
              <span className="text-md font-semibold text-[#1c1c1c]">
                ₹ {taxes}/-
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between items-center p-5">
            <span className="text-md text-gray-600 font-semibold">Total</span>
            <span className="text-md font-semibold text-[#1c1c1c]">
              ₹ {total}/-
            </span>
          </div>
          <button className=" w-full text-white font-semibold border-2 rounded-md border-green-700 bg-green-700 hover:bg-green-600 hover:border-green-600 mt-3" onClick={() => {
            toast.success("Order Placer")
          }}>
            Place Order
          </button>
        </> : <div className="text-center mt-8 text-emerald-700 font-bold text-xl">Empty Cart</div>
        }

      </div>
    </div>
  );
};

export default Home;
