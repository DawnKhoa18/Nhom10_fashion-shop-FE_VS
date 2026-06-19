import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllCategories } from '../services/categoryService';
import { createAdminProduct, getAdminProduct, updateAdminProduct } from '../services/adminProductService';

const initialForm = {
  tenSP: '',
  maDanhMuc: '',
  gia: '',
  soLuongTon: 0,
  chatLieu: '',
  form: '',
  moTaChiTiet: '',
  hienThi: 'true'
};

const AdminProductForm = ({ mode }) => {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    getAdminProduct(id)
      .then((product) => {
        setFormData({
          tenSP: product.tenSP || '',
          maDanhMuc: product.maDanhMuc || '',
          gia: product.gia || '',
          soLuongTon: product.tongTon || 0,
          chatLieu: product.chatLieu || '',
          form: product.form || '',
          moTaChiTiet: product.moTaChiTiet || '',
          hienThi: String(Boolean(product.hienThi))
        });
        setCurrentImage(product.hinhDaiDien || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được thông tin sản phẩm.');
        setLoading(false);
      });
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles?.[0] || null }));
  };

  const buildPayload = () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    Object.entries(files).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isEdit && !files.hinhDaiDien) {
      setError('Ảnh đại diện là bắt buộc.');
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateAdminProduct(id, buildPayload());
      } else {
        await createAdminProduct(buildPayload());
      }
      navigate('/admin/san-pham');
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu sản phẩm thất bại.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4 admin-product-form-card">
        <h3 className="card-title mb-4 text-center fw-bold">
          {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold">Tên sản phẩm</label>
            <input name="tenSP" className="form-control" value={formData.tenSP} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Danh mục</label>
            <select name="maDanhMuc" className="form-select" value={formData.maDanhMuc} onChange={handleChange} required>
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold">Giá sản phẩm</label>
            <input name="gia" className="form-control" type="number" min="0" value={formData.gia} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Số lượng tồn</label>
            <input name="soLuongTon" className="form-control" type="number" min="0" value={formData.soLuongTon} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Chất liệu</label>
            <input name="chatLieu" className="form-control" value={formData.chatLieu} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Form dáng</label>
            <input name="form" className="form-control" value={formData.form} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Mô tả chi tiết</label>
            <textarea name="moTaChiTiet" className="form-control" rows="4" value={formData.moTaChiTiet} onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label className="fw-bold d-block">Hiển thị</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="hienThi"
                id="hienThi1"
                value="true"
                checked={formData.hienThi === 'true'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="hienThi1">Hiển thị</label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="hienThi"
                id="hienThi0"
                value="false"
                checked={formData.hienThi === 'false'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="hienThi0">Ẩn</label>
            </div>
          </div>

          {isEdit && currentImage && (
            <div className="mb-3">
              <label className="fw-bold d-block">Hình đại diện hiện tại</label>
              <img src={`http://localhost:8080/Images/Products/${currentImage}`} alt="Hình đại diện" width="150" />
            </div>
          )}

          <div className="mb-3">
            <label className="fw-bold">Ảnh đại diện</label>
            <input type="file" name="hinhDaiDien" className="form-control" onChange={handleFileChange} required={!isEdit} />
            {isEdit && <small className="text-muted">Nếu không chọn file mới, hình cũ sẽ giữ nguyên.</small>}
          </div>

          <div className="mb-3">
            <label className="fw-bold">Ảnh hover</label>
            <input type="file" name="hinhHover" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Ảnh phụ 1</label>
            <input type="file" name="hinhPhu1" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Ảnh phụ 2</label>
            <input type="file" name="hinhPhu2" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="mb-3">
            <label className="fw-bold">Ảnh phụ 3</label>
            <input type="file" name="hinhPhu3" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="text-center">
            <button type="submit" className={`btn ${isEdit ? 'btn-view' : 'btn-view fw-bold'} px-5 fw-bold`} disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
            </button>
            <Link to="/admin/san-pham" className="btn btn-danger px-4 fw-bold ms-2">
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
