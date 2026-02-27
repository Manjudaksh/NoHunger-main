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
  let [debouncedInput, setDebouncedInput] = useState("");
  let [showCart, setShowCart] = useState(false);
  let [login, setLogin] = useState(false); // Authentication state

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const getCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getFoodItems = async (category = "All", search = "") => {
    try {
      let url = "/foods?";
      if (category !== "All") url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      setFoodItems(res.data);
      setCate(res.data); // Update displayed items directly with backend results
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  // Initial Fetch for Categories
  useEffect(() => {
    getCategories();
  }, []);

  // Fetch Food Items when category or search changes
  useEffect(() => {
    getFoodItems(activeCategory, debouncedInput);
  }, [activeCategory, debouncedInput]);

  // Additional necessary local filtering can be applied here, like active status
  // Otherwise, backend results are directly used in setCate in getFoodItems.
  useEffect(() => {
    let filteredList = [...foodItems];
    // 0. Filter by Active Status (Always filter inactive items for the consumer view)
    filteredList = filteredList.filter((item) => item.active !== false); // Handle undefined as true for legacy items
    setCate(filteredList);
  }, [foodItems, admin]);

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


