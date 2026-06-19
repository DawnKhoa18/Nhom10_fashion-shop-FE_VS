import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { analyzeFashionImage, rankSimilarProducts } from '../services/imageSearchService';

const ImageSearchPage = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const firstFileRef = useRef(location.state?.imageFile || null);
  const latestRequestRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) searchByImage(file);
  };

  const searchByImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn đúng file hình ảnh.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Hình ảnh không được lớn hơn 8MB.');
      return;
    }

    const requestId = Date.now();
    latestRequestRef.current = requestId;
    setLoading(true);
    setProgress(0);
    setError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    try {
      const [imageAnalysis, response] = await Promise.all([
        analyzeFashionImage(file),
        axios.get('http://localhost:8080/api/SanPham/danh-sach', {
          params: { slug: 'tat-ca', sort: 'default', take: 1000 }
        })
      ]);
      setPreviewUrl(imageAnalysis.previewUrl);
      setAnalysis(imageAnalysis);
      const rankedProducts = await rankSimilarProducts(
        response.data.products || [],
        imageAnalysis,
        setProgress
      );
      if (latestRequestRef.current !== requestId) {
        URL.revokeObjectURL(imageAnalysis.previewUrl);
        return;
      }
      setProducts(rankedProducts);
    } catch (searchError) {
      console.error('Lỗi tìm kiếm bằng hình ảnh:', searchError);
      setError('Không thể tìm kiếm từ hình ảnh này. Vui lòng thử lại.');
    } finally {
      if (latestRequestRef.current === requestId) setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstFileRef.current) {
      searchByImage(firstFileRef.current);
      firstFileRef.current = null;
    }

    const handleHeaderImageSearch = (event) => {
      const imageFile = event.detail?.imageFile;
      if (imageFile) searchByImage(imageFile);
    };
    window.addEventListener('imageSearchRequested', handleHeaderImageSearch);
    return () => window.removeEventListener('imageSearchRequested', handleHeaderImageSearch);
  }, []);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="image-search-page">
      <section className="image-search-intro">
        <div>
          <span className="image-search-tag"><i className="bi bi-camera me-2" />TÌM KIẾM HÌNH ẢNH</span>
          <h1>Tìm sản phẩm bằng hình ảnh</h1>
          <p>Tải lên một hình ảnh để khám phá những sản phẩm có kiểu dáng và màu sắc phù hợp trong cửa hàng.</p>
        </div>
        <button type="button" className="btn image-upload-btn" onClick={openFilePicker} disabled={loading}>
          <i className="bi bi-camera-fill me-2" />
          {analysis ? 'Chọn ảnh khác' : 'Chọn hình ảnh'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={handleFileChange}
        />
      </section>

      {loading && (
        <div className="image-search-loading">
          <div className="spinner-border text-warning" role="status" />
          <h4>Đang tìm sản phẩm phù hợp...</h4>
          <p>{progress > 0 ? `Đã so sánh ${progress}% hình ảnh sản phẩm` : 'Đang chuẩn bị dữ liệu hình ảnh...'}</p>
        </div>
      )}

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {!loading && !analysis && (
        <button type="button" className="image-drop-zone" onClick={openFilePicker}>
          <i className="bi bi-cloud-arrow-up" />
          <strong>Nhấn để tải hình sản phẩm</strong>
          <span>Hỗ trợ JPG, PNG, WEBP — tối đa 8MB</span>
        </button>
      )}

      {!loading && analysis && (
        <>
          <section className="image-selected-card">
            <img src={previewUrl} alt="Ảnh dùng để tìm kiếm" />
            <div>
              <span className="image-search-tag">HÌNH ẢNH ĐÃ CHỌN</span>
              <h3>Kết quả phù hợp với hình ảnh</h3>
              <p>Chúng tôi đã chọn những sản phẩm gần nhất với mẫu bạn đang tìm.</p>
              <button type="button" className="btn btn-outline-dark" onClick={openFilePicker}>
                <i className="bi bi-arrow-repeat me-2" />Tìm bằng ảnh khác
              </button>
            </div>
          </section>

          <div className="d-flex align-items-center justify-content-center my-5">
            <div className="line-gradient"></div>
            <div className="text-center mx-3">
              <h2 className="fw-bold mb-1 text-uppercase">Sản phẩm tương tự</h2>
              <p className="text-muted mb-0">{products.length} sản phẩm được đề xuất cho bạn.</p>
            </div>
            <div className="line-gradient" style={{ transform: 'rotate(180deg)' }}></div>
          </div>

          {products.length > 0 ? (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="image-no-result">
              <i className="bi bi-image" />
              <h4>Chưa tìm thấy sản phẩm đủ tương đồng</h4>
              <p>Hãy thử ảnh rõ trang phục hơn hoặc ảnh có nền đơn giản.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageSearchPage;
