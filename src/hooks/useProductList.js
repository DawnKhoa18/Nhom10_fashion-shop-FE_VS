import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const useProductList = (defaultSlug) => {
  // 1. Đổi id thành slug để lấy đúng tham số từ Route /danh-muc/:slug
  const { slug } = useParams(); 
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [pageTitle, setPageTitle] = useState('Đang tải...');
  const [banner, setBanner] = useState('');
  const [take, setTake] = useState(30); 
  const [hienXemThem, setHienXemThem] = useState(false);

  const currentSort = searchParams.get('sort') || 'default';
  
  // 2. Cập nhật activeSlug dựa trên slug lấy từ useParams()
  const activeSlug = slug || defaultSlug || 'tat-ca';
  const API_BASE_URL = "http://localhost:8080";

  // --- CHỈ THÊM ĐOẠN NÀY ĐỂ CUỘN LÊN ĐẦU TRANG ---
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Cuộn mượt lên đầu trang
    });
  }, [activeSlug, currentSort]); 
  // ----------------------------------------------

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/SanPham/danh-sach`, {
      params: {
        slug: activeSlug,
        sort: currentSort,
        take: take
      }
    })
    .then(res => {
      setProducts(res.data.products);
      setPageTitle(res.data.titlePage);
      setBanner(res.data.banner);
      setHienXemThem(res.data.hienXemThem); 
    })
    .catch(err => console.error("Lỗi lấy danh sách sản phẩm: ", err));
  }, [activeSlug, currentSort, take]);

  // 3. Reset số lượng sản phẩm hiển thị khi chuyển danh mục
  useEffect(() => {
    setTake(30);
  }, [slug, defaultSlug]);

  const handleSortChange = (e) => {
    setSearchParams({ sort: e.target.value });
  };

  const handleLoadMore = () => {
    setTake(prev => prev + 14);
  };

  return {
    products,
    pageTitle,
    banner,
    currentSort,
    hienXemThem,
    API_BASE_URL,
    handleSortChange,
    handleLoadMore
  };
};

export default useProductList;