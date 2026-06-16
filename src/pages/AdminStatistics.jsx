import React, { useEffect, useMemo, useState } from 'react';
import { getAdminStatistics } from '../services/adminStatisticsService';

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} đ`;

const StatCard = ({ label, value, colorClass }) => (
  <div className="col-md-3">
    <div className={`card shadow-sm border-0 border-start border-4 ${colorClass} h-100`}>
      <div className="card-body">
        <p className="text-muted mb-1 text-uppercase fw-bold small">{label}</p>
        <h4 className={`fw-bold mb-0 ${colorClass.replace('border', 'text')}`}>{value}</h4>
      </div>
    </div>
  </div>
);

const RevenueChart = ({ data }) => {
  const points = useMemo(() => {
    const max = Math.max(...data.map((item) => Number(item.tien) || 0), 1);
    const width = 720;
    const height = 260;
    const padX = 36;
    const padY = 24;
    const usableWidth = width - padX * 2;
    const usableHeight = height - padY * 2;

    return data.map((item, index) => {
      const x = data.length === 1 ? width / 2 : padX + (index * usableWidth) / (data.length - 1);
      const y = height - padY - ((Number(item.tien) || 0) / max) * usableHeight;
      return { ...item, x, y };
    });
  }, [data]);

  if (!data.length) {
    return <div className="admin-empty-chart">Không có dữ liệu trong khoảng thời gian này.</div>;
  }

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x} 260 L ${points[0].x} 260 Z`;

  return (
    <div className="admin-chart-scroll">
      <svg className="admin-revenue-chart" viewBox="0 0 720 300" role="img" aria-label="Biểu đồ doanh thu">
        <path d={areaPath} fill="rgba(13, 110, 253, 0.1)" />
        <path d={path} fill="none" stroke="#0d6efd" strokeWidth="3" />
        {points.map((point) => (
          <g key={point.ngay}>
            <circle cx={point.x} cy={point.y} r="5" fill="#0d6efd" />
            <text x={point.x} y="288" textAnchor="middle" className="admin-chart-label">{point.ngay}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const StatusChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const colors = ['#198754', '#0dcaf0', '#ffc107', '#dc3545', '#6c757d', '#6610f2'];

  if (!total) {
    return <div className="admin-empty-chart">Không có dữ liệu.</div>;
  }

  return (
    <div className="admin-status-chart">
      {data.map((item, index) => {
        const percent = Math.round((Number(item.count) / total) * 100);
        return (
          <div className="admin-status-item" key={item.label}>
            <span className="admin-status-dot" style={{ backgroundColor: colors[index % colors.length] }}></span>
            <span className="flex-grow-1">{item.label}</span>
            <strong>{item.count}</strong>
            <small className="text-muted">{percent}%</small>
          </div>
        );
      })}
    </div>
  );
};

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ fromDate: '', toDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = (params = {}) => {
    setLoading(true);
    setError('');
    getAdminStatistics(params)
      .then((data) => {
        setStats(data);
        setFilters({ fromDate: data.start || '', toDate: data.end || '' });
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được dữ liệu thống kê.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadStatistics(filters);
  };

  const handleReset = () => {
    loadStatistics();
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="fw-bold text-dark mb-0">
          <i className="bi bi-calendar-check me-2"></i>Thống kê kinh doanh
        </h3>

        <form onSubmit={handleSubmit} className="d-flex gap-2 shadow-sm p-2 bg-white rounded border">
          <div className="d-flex align-items-center">
            <span className="fw-bold me-2 small text-muted">Từ:</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
            />
          </div>
          <div className="d-flex align-items-center">
            <span className="fw-bold mx-2 small text-muted">đến:</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm fw-bold">
            <i className="bi bi-search"></i> Xem
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" title="Reset về tháng hiện tại" onClick={handleReset}>
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && stats && (
        <>
          <div className="row g-3 mb-4">
            <StatCard label="Doanh thu" value={formatCurrency(stats.doanhThu)} colorClass="border-success" />
            <StatCard label="Đơn hàng" value={stats.donHang} colorClass="border-primary" />
            <StatCard label="Khách mua" value={stats.khachHang} colorClass="border-info" />
            <StatCard label="Sản phẩm bán" value={stats.sanPham} colorClass="border-warning" />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 fw-bold text-primary">
                    <i className="bi bi-graph-up me-2"></i>Biểu đồ doanh thu theo thời gian
                  </h6>
                </div>
                <div className="card-body">
                  <RevenueChart data={stats.listChiTiet || []} />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 fw-bold text-primary">
                    <i className="bi bi-pie-chart-fill me-2"></i>Tỉ lệ đơn hàng
                  </h6>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center">
                  <StatusChart data={stats.statusData || []} />
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 fw-bold text-primary">Chi tiết doanh thu</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive admin-stat-table">
                <table className="table table-hover table-striped mb-0 align-middle">
                  <thead className="bg-light sticky-top">
                    <tr>
                      <th className="py-3 ps-4">Thời gian</th>
                      <th className="py-3 text-end pe-4">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.listChiTiet?.length ? (
                      stats.listChiTiet.map((item) => (
                        <tr key={item.ngay}>
                          <td className="ps-4 fw-bold">{item.ngay}</td>
                          <td className="text-end pe-4 fw-bold text-success">{formatCurrency(item.tien)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-4 text-muted">
                          Không có dữ liệu trong khoảng thời gian này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStatistics;
