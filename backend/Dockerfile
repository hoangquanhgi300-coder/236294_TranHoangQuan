# Sử dụng image Node.js chính thức
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy các file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các gói thư viện production
RUN npm install --production

# Copy toàn bộ mã nguồn backend còn lại vào container
COPY . .

# Khai báo cổng chạy của ứng dụng
EXPOSE 5000

# Lệnh khởi động ứng dụng
CMD ["node", "server.js"]