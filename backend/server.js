globalThis.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Device = require('./models/Device');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
    .catch(err => console.error('Lỗi kết nối CSDL:', err));

// 1. Endpoint /health kiểm tra trạng thái
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend đang hoạt động ổn định' });
});

// 2. API Lấy danh sách & Tìm kiếm thiết bị (GET /api/devices)
app.get('/api/devices', async (req, res) => {
    try {
        const search = req.query.search;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { deviceId: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { deviceType: { $regex: search, $options: 'i' } },
                    { room: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        const devices = await Device.find(query);
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy dữ liệu', error: error.message });
    }
});

// Route dự phòng cho đường dẫn /api/students theo yêu cầu của bạn
app.get('/api/students', async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy dữ liệu', error: error.message });
    }
});

// 3. API Xem thông tin một thiết bị (GET /api/devices/:id)
app.get('/api/devices/:id', async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị này' });
        res.status(200).json(device);
    } catch (error) {
        res.status(400).json({ message: 'ID thiết bị không hợp lệ', error: error.message });
    }
});

// 4. API Thêm thiết bị mới (POST /api/devices)
app.post('/api/devices', async (req, res) => {
    try {
        const newDevice = new Device(req.body);
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Mã thiết bị (deviceId) này đã tồn tại!' });
        }
        res.status(400).json({ message: 'Kiểm tra dữ liệu đầu vào thất bại', error: error.message });
    }
});

// 5. API Cập nhật thông tin thiết bị (PUT /api/devices/:id)
app.put('/api/devices/:id', async (req, res) => {
    try {
        const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDevice) return res.status(404).json({ message: 'Không tìm thấy thiết bị để cập nhật' });
        res.status(200).json(updatedDevice);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Mã thiết bị (deviceId) mới bị trùng lặp!' });
        }
        res.status(400).json({ message: 'Lỗi cập nhật dữ liệu', error: error.message });
    }
});

// 6. API Xóa thiết bị (DELETE /api/devices/:id)
app.delete('/api/devices/:id', async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) return res.status(404).json({ message: 'Không tìm thấy thiết bị để xóa' });
        res.status(200).json({ message: 'Đã xóa thiết bị thành công' });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi hệ thống khi xóa', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server backend đang chạy tại cổng ${PORT}`);
});