import React, { createContext, useState, useEffect } from "react";
import { api } from "../helpers/api";
export const dataContext = createContext();

export default function UserContext({ children }) {
  let [cate, setCate] = useState([]); // Displayed/Filtered items
  let [foodItems, setFoodItems] = useState([]); // All items from DB
  let [categories, setCategories] = useState([]);
  let [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("user")));
  let [input, setInput] = useState("");
  let [showCart, setShowCart] = useState(false);
  let [login, setLogin] = useState(false); // Authentication state

  const getCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getFoodItems = async () => {
    try {
      const res = await api.get("/foods");
      setFoodItems(res.data);
      setCate(res.data); // Initialize displayed items with all foods
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  useEffect(() => {
    getCategories();
    getFoodItems();
  }, []);

  let data = {
    input,
    setInput,
    cate,
    setCate,
    showCart,
    setShowCart,
    login,
    setLogin,
    categories,
    setCategories,
    foodItems,
    setFoodItems,
    admin,
    setAdmin
  };
  return (
    <dataContext.Provider value={data}>
      {children}
    </dataContext.Provider>
  );
};


