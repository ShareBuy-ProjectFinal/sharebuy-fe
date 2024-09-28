# Sử dụng image Node.js chính thức
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Cài đặt serve để phục vụ ứng dụng
RUN npm install -g serve

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Chạy ứng dụng với serve
CMD ["serve", "-s", "build", "-l", "3000"]
