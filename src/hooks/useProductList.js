import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const useProductList = (defaultSlug) => {
  const { slug } = useParams(); 
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [pageTitle, setPageTitle] = useState('Đang tải...');
  const [banner, setBanner] = useState('');
  const [take, setTake] = useState(30); 
  const [hienXemThem, setHienXemThem] = useState(false);

  const currentSort = searchParams.get('sort') || 'default';
  const keyword = searchParams.get('keyword') || '';
  
  const activeSlug = slug || defaultSlug || 'tat-ca';
  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeSlug, currentSort, keyword]); 

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/SanPham/danh-sach`, {
      params: {
        slug: activeSlug,
        sort: currentSort,
        keyword: keyword,
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
  }, [activeSlug, currentSort, keyword, take]);

  useEffect(() => {
    setTake(30);
  }, [slug, defaultSlug, keyword]);

  const handleSortChange = (e) => {
    const nextParams = { sort: e.target.value };
    if (keyword) nextParams.keyword = keyword;
    setSearchParams(nextParams);
  };

  const handleLoadMore = () => {
    setTake(prev => prev + 14);
  };

  return {
    products,
    pageTitle,
    keyword,
    banner,
    currentSort,
    hienXemThem,
    API_BASE_URL,
    handleSortChange,
    handleLoadMore
  };
};

export default useProductList;
