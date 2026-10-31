# Hệ thống quản lý thiết bị phòng học

Sinh viên: Trần Hoàng Quân - MSSV: 236294

## Mô tả đề tài

Ứng dụng quản lý thiết bị phòng học: xem, tìm kiếm, thêm, cập nhật, xóa thiết bị và theo dõi tình trạng sử dụng.

## Công nghệ sử dụng

React (Vite), Node.js, Express, MongoDB Atlas, Docker, Docker Hub, Render, Git/GitHub.

## Cấu trúc dự án

```
236294_TranHoangQuan/
├── backend/    # Express API
├── frontend/   # React app
├── .gitignore
└── README.md
```

## Hướng dẫn cài đặt và chạy

### Backend

```
cd backend
npm install
copy .env.example .env
npm start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

Hoàn thành tạo database Câu 2

## Hướng dẫn chạy Backend bằng Docker

1. Kéo Docker image từ Docker Hub:

   ```bash
   docker pull hoangquan21102005/device-backend:latest
   ```

2. Chạy container với biến môi trường MongoDB:

   ```bash
   docker run -d -p 5000:5000 -e MONGO_URI="mongodb+srv://<username>:<password>@cluster0.vnprtks.mongodb.net/236294_TranHoangQuan?appName=Cluster0" hoangquan21102005/device-backend:latest
   ```

## Hướng dẫn chạy Frontend bằng Docker

1. Kéo Docker image từ Docker Hub:

   ```bash
   docker pull hoangquan21102005/device-frontend:latest
   ```

## Link Triển Khai (Live Demo)

- Frontend URL: `https://two36294-tranhoangquan-frontend.onrender.com`
- Backend API URL: `https://two36294-tranhoangquan-backend.onrender.com/api/students`