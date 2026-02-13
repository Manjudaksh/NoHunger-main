import { useState, useEffect, useCallback } from 'react';
import { api } from '../helpers/api';
import { toast } from 'react-toastify';

const usePagination = (endpoint, initialLimit = 10) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const separator = endpoint.includes('?') ? '&' : '?';
            const res = await api.get(`${endpoint}${separator}page=${page}&limit=${limit}`);
            // Handle different response structures from standard vs paginated endpoints
            // Backend returns { categories: [], total, totalPages, currentPage } OR { foods: [], ... }

            let fetchedData = [];

            // Check keys to find the array data
            if (res.data.categories) fetchedData = res.data.categories;
            else if (res.data.foods) fetchedData = res.data.foods;
            else if (res.data.orders) fetchedData = res.data.orders;
            else if (Array.isArray(res.data)) fetchedData = res.data; // Fallback if no specific key
            else fetchedData = []; // Should not happen with current backend

            console.log("usePagination API Response:", res.data);
            console.log("Determined fetchedData:", fetchedData);

            setData(fetchedData);
            setTotalPages(res.data.totalPages || 1);
            setTotalItems(res.data.total || fetchedData.length);
        } catch (err) {
            console.error(`Failed to fetch data from ${endpoint}:`, err);
            setError(err.message || "Failed to fetch data");
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const nextPage = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const jumpToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) setPage(pageNum);
    };

    const refresh = () => {
        fetchData();
    };

    return {
        data,
        loading,
        error,
        page,
        limit,
        totalPages,
        totalItems,
        nextPage,
        prevPage,
        jumpToPage,
        setPage,
        setLimit,
        setPage,
        setLimit,
        refresh,
        setData
    };
};

export default usePagination;
