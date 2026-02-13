import React, { useContext, useEffect } from 'react'
import { IoFastFood } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CgShoppingBag } from "react-icons/cg";
import { dataContext } from '../context/UserContext';
import { useSelector } from 'react-redux';
import { server } from '../helpers/api';
const Nav = () => {
  let { input, setInput, cate, setCate, showCart, setShowCart, foodItems } = useContext(dataContext);


  let items = useSelector(state => state.cart)

  return (
    <div className='w-full h-[80px] flex justify-between items-center px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100'>

      {/* Logo */}
      <div className='flex items-center gap-2'>
        <div className='w-10 h-10 flex bg-green-100 justify-center items-center rounded-xl shadow-sm'>
          <IoFastFood className='w-6 h-6 text-green-700' />
        </div>
        <span className='font-bold font-heading text-xl text-gray-800 hidden md:block tracking-tight'>NoHunger</span>
      </div>

      {/* Search Bar */}
      <div className='flex-1 max-w-xl mx-5'>
        <form className='w-full h-12 bg-gray-50 flex items-center px-4 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all shadow-sm' onSubmit={(e) => e.preventDefault()}>
          <IoSearch className='mr-3 text-gray-400 text-xl' />
          <input
            onChange={(e) => setInput(e.target.value)}
            className='bg-transparent w-full outline-none text-base text-gray-700 placeholder:text-gray-400'
            type="text"
            placeholder='Search for food...'
          />
        </form>
      </div>

      {/* Cart Icon */}
      <button
        onClick={() => { setShowCart(true) }}
        className='relative w-12 h-12 flex justify-center items-center rounded-xl hover:bg-gray-50 transition-colors group'
      >
        <CgShoppingBag className='w-7 h-7 text-gray-600 group-hover:text-green-700 transition-colors' />
        {items.length > 0 && (
          <span className='absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm'>
            {items.length}
          </span>
        )}
      </button>
    </div>
  )
}

export default Nav