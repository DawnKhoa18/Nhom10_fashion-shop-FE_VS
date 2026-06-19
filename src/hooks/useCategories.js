import { useState, useEffect } from 'react';
import { getAllCategories } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllCategories();
      setCategories(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const parentCats = categories.filter(cat => cat.parentId === null);

  return { categories, parentCats, loading };
};