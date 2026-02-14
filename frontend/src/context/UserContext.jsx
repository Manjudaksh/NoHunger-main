import React, { createContext, useState, useEffect } from "react";
import { api } from "../helpers/api";
export const dataContext = createContext();

export default function UserContext({ children }) {
  let [cate, setCate] = useState([]); // Displayed/Filtered items
  let [foodItems, setFoodItems] = useState([]); // All items from DB
  let [categories, setCategories] = useState([]);
  let [activeCategory, setActiveCategory] = useState("All"); // Lifted state
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
      // Note: We don't setCate here anymore to avoid resetting filters on poll
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  // Initial Fetch & Polling
  useEffect(() => {
    getCategories();
    getFoodItems();

    // Poll every 4 seconds
    const interval = setInterval(() => {
      getCategories();
      getFoodItems();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Unified Filtering Logic
  useEffect(() => {
    let filteredList = [...foodItems];

    // 0. Filter by Active Status (Always filter inactive items for the consumer view)
    filteredList = filteredList.filter((item) => item.active !== false); // Handle undefined as true for legacy items

    // 1. Filter by Category
    if (activeCategory !== "All") {
      filteredList = filteredList.filter(
        (item) => item.categoryId?.name === activeCategory || item.category === activeCategory
      );
    }

    // 2. Filter by Search Input (Global Search)
    if (input) {
      filteredList = filteredList.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      );
    }

    setCate(filteredList);
  }, [foodItems, activeCategory, input, admin]);

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
    setAdmin,
    activeCategory,
    setActiveCategory
  };
  return (
    <dataContext.Provider value={data}>
      {children}
    </dataContext.Provider>
  );
};


