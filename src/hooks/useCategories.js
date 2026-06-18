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

  // Logic lọc cha/con nằm gọn ở đây
  const parentCats = categories.filter(cat => cat.parentId === null);

  return { categories, parentCats, loading };
};