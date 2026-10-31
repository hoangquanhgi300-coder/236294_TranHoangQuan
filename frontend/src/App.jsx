import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Địa chỉ gốc của backend. Nếu VITE_API_URL lỡ có đuôi /api hoặc /api/devices thì tự cắt bỏ.
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/api.*$/, '')
  .replace(/\/+$/, '');

// Lấy danh sách: GET /api/students
const API_URL = `${API_BASE}/api/students`;
// Thêm, sửa, xóa: /api/devices
const DEVICES_URL = `${API_BASE}/api/devices`;

const EMPTY_FORM = {
  deviceId: '', name: '', deviceType: '', room: '', brand: '', model: '', quantity: 1, status: 'Đang sử dụng', description: ''
};

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho form thêm/sửa thiết bị
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách thiết bị: GET /api/students
  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_URL}?search=${encodeURIComponent(keyword)}` : API_URL;
      const response = await axios.get(url);
      setDevices(response.data);
    } catch (err) {
      setError('Không thể kết nối đến máy chủ Backend. Hãy chắc chắn rằng bạn đã chạy server.js!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // 2. Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(search);
  };

  // 3. Thêm hoặc Cập nhật thiết bị
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${DEVICES_URL}/${editingId}`, formData);
        alert('Cập nhật thiết bị thành công!');
      } else {
        await axios.post(DEVICES_URL, formData);
        alert('Thêm thiết bị mới thành công!');
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      fetchDevices();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  // 4. Xóa thiết bị
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này không?')) {
      try {
        await axios.delete(`${DEVICES_URL}/${id}`);
        fetchDevices();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  // 5. Đưa thông tin lên form để sửa
  const handleEdit = (device) => {
    setFormData(device);
    setEditingId(device._id);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 text-primary fw-bold">HỆ THỐNG QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h2>

      {/* Hiển thị lỗi nếu có */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form Thêm / Sửa thiết bị */}
      <div className="card shadow mb-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">{editingId ? 'Cập nhật thông tin thiết bị' : 'Thêm thiết bị mới'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Mã thiết bị (deviceId)</label>
              <input type="text" className="form-control" required value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Tên thiết bị</label>
              <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Loại thiết bị</label>
              <input type="text" className="form-control" required value={formData.deviceType} onChange={e => setFormData({...formData, deviceType: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Phòng học</label>
              <input type="text" className="form-control" required value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Số lượng</label>
              <input type="number" min="1" className="form-control" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Tình trạng</label>
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Hư hỏng">Hư hỏng</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option>
                <option value="Ngừng sử dụng">Ngừng sử dụng</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Mô tả / Ghi chú</label>
              <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'} w-100 me-2`}>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary w-50" onClick={() => { setEditingId(null); setFormData(EMPTY_FORM); }}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <form onSubmit={handleSearch} className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nhập từ khóa tìm kiếm (Mã thiết bị, tên, loại, phòng học)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-primary" type="submit">Tìm kiếm</button>
        <button className="btn btn-outline-secondary" type="button" onClick={() => { setSearch(''); fetchDevices(); }}>Làm mới</button>
      </form>

      {/* Bảng hiển thị danh sách thiết bị */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Danh sách thiết bị phòng học</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Phòng</th>
                    <th>Số lượng</th>
                    <th>Tình trạng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-3">Không tìm thấy thiết bị nào.</td></tr>
                  ) : (
                    devices.map(device => (
                      <tr key={device._id}>
                        <td className="fw-bold">{device.deviceId}</td>
                        <td>{device.name}</td>
                        <td>{device.deviceType}</td>
                        <td>{device.room}</td>
                        <td>{device.quantity}</td>
                        <td>
                          <span className={`badge ${
                            device.status === 'Đang sử dụng' ? 'bg-success' :
                            device.status === 'Hư hỏng' ? 'bg-danger' :
                            device.status === 'Đang sửa chữa' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                            {device.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(device)}>Sửa</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(device._id)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
