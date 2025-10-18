# 🚀 English Learning API - Backend

Backend API cho ứng dụng học tiếng Anh, lưu dữ liệu vào file JSON.

## 📦 Cài đặt

```bash
cd backend
npm install
```

## 🏃 Chạy server

### Development (với nodemon - auto reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

## 📚 API Endpoints

### Categories (Chuyên mục)

#### GET /api/categories
Lấy tất cả chuyên mục
```bash
curl http://localhost:5000/api/categories
```

#### GET /api/categories/:id
Lấy chuyên mục theo ID
```bash
curl http://localhost:5000/api/categories/1
```

#### POST /api/categories
Thêm chuyên mục mới
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Từ vựng nâng cao"}'
```

#### PUT /api/categories/:id
Cập nhật chuyên mục
```bash
curl -X PUT http://localhost:5000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Từ vựng cơ bản mới"}'
```

#### DELETE /api/categories/:id
Xóa chuyên mục
```bash
curl -X DELETE http://localhost:5000/api/categories/1
```

---

### Posts (Bài post)

#### GET /api/posts
Lấy tất cả bài post (có thể filter theo categoryId)
```bash
# Lấy tất cả
curl http://localhost:5000/api/posts

# Filter theo chuyên mục
curl http://localhost:5000/api/posts?categoryId=1
```

#### GET /api/posts/:id
Lấy bài post theo ID
```bash
curl http://localhost:5000/api/posts/1
```

#### POST /api/posts
Thêm bài post mới
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "vocabulary": "Hello",
    "image": "https://example.com/image.jpg",
    "examples": [
      "Hello, how are you?",
      "Hello world!"
    ]
  }'
```

#### PUT /api/posts/:id
Cập nhật bài post
```bash
curl -X PUT http://localhost:5000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "vocabulary": "Hello",
    "image": "https://example.com/new-image.jpg",
    "examples": [
      "Hello, nice to meet you!",
      "Hello everyone!"
    ]
  }'
```

#### DELETE /api/posts/:id
Xóa bài post
```bash
curl -X DELETE http://localhost:5000/api/posts/1
```

---

### Health Check

#### GET /api/health
Kiểm tra trạng thái server
```bash
curl http://localhost:5000/api/health
```

## 📁 Cấu trúc dữ liệu

### Category
```json
{
  "id": 1,
  "name": "Từ vựng cơ bản"
}
```

### Post
```json
{
  "id": 1,
  "categoryId": 1,
  "vocabulary": "Hello",
  "image": "https://example.com/image.jpg",
  "examples": [
    "Hello, how are you?",
    "Hello world!"
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 💾 Lưu trữ dữ liệu

Dữ liệu được lưu trong thư mục `data/`:
- `data/categories.json` - Danh sách chuyên mục
- `data/posts.json` - Danh sách bài post

## 🔧 Cấu hình

### Port
Mặc định: `5000`

Để thay đổi port, set biến môi trường:
```bash
PORT=3001 npm start
```

### CORS
Server đã được cấu hình CORS để cho phép frontend Vue.js (localhost:3000) gọi API.

## 📝 Lưu ý

- Dữ liệu được lưu vào file JSON nên cần đảm bảo quyền ghi file
- Hỗ trợ upload ảnh dạng base64 (limit 10MB)
- API tự động tạo thư mục `data/` nếu chưa tồn tại
- ID được tạo tự động bằng timestamp

## 🔒 Bảo mật

Đây là API đơn giản cho development. Trong production nên thêm:
- Authentication/Authorization
- Rate limiting
- Input validation
- HTTPS
- Database thay vì file JSON

## 🛠️ Công nghệ sử dụng

- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **Node.js File System** - Đọc/ghi file JSON
- **ES Modules** - Modern JavaScript

## 📞 API Response Format

### Success Response
```json
{
  "id": 1,
  "name": "Category name"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

**Happy Coding! 🎉**


