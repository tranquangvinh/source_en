# 📚 English Learning App

Ứng dụng học tiếng Anh với Vue.js - Quản lý từ vựng và flashcard.

## ✨ Tính năng

### 🗂️ Quản lý chuyên mục
- ➕ Thêm chuyên mục mới
- ✏️ Sửa chuyên mục
- 🗑️ Xóa chuyên mục
- 📊 Hiển thị số lượng bài post trong mỗi chuyên mục

### 📝 Quản lý bài post
- ➕ Thêm bài post với:
  - 🖼️ Hình ảnh flashcard (upload hoặc URL)
  - 📖 Từ vựng
  - 💬 Danh sách câu mẫu
- ✏️ Chỉnh sửa bài post
- 🗑️ Xóa bài post
- 🔍 Lọc bài post theo chuyên mục

### 🎯 Xem chi tiết bài post
- 🖼️ Hiển thị flashcard hình ảnh
- 📖 Từ vựng với chuyên mục
- 💬 Danh sách các câu mẫu
- 🔊 **Text-to-speech**: Nhấn vào icon 🔊 để nghe phát âm tiếng Anh
  - Đọc từ vựng
  - Đọc từng câu mẫu

### 💾 Lưu trữ dữ liệu
- Dữ liệu được lưu vào **file JSON** thông qua **Node.js backend**
- Backend API RESTful với Express.js
- Dữ liệu persistent và có thể backup dễ dàng

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Các bước cài đặt

#### 1. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Chạy server (development với auto-reload)
npm run dev

# Hoặc chạy production
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

#### 2. Cài đặt Frontend

Mở terminal mới:

```bash
# Quay lại thư mục gốc
cd ..

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

### Build cho production

```bash
npm run build
```

Xem trước bản build:
```bash
npm run preview
```

## 📱 Cấu trúc dự án

```
souce_en/
├── backend/                # Node.js Backend
│   ├── data/              # Dữ liệu JSON
│   │   ├── categories.json
│   │   └── posts.json
│   ├── routes/            # API routes
│   │   ├── categories.js
│   │   └── posts.js
│   ├── utils/             # Utilities
│   │   └── fileHelper.js
│   ├── server.js          # Express server
│   ├── package.json
│   └── README.md
│
├── src/                   # Vue Frontend
│   ├── views/              # Các trang chính
│   │   ├── Home.vue        # Trang chủ
│   │   ├── CategoryManager.vue   # Quản lý chuyên mục
│   │   ├── PostManager.vue       # Quản lý bài post
│   │   └── PostDetail.vue        # Xem chi tiết bài post
│   ├── router/             # Cấu hình routing
│   │   └── index.js
│   ├── store/              # Quản lý state & API calls
│   │   └── index.js
│   ├── App.vue             # Component chính
│   ├── main.js             # Entry point
│   └── style.css           # Styles toàn cục
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Công nghệ sử dụng

### Frontend
- **Vue 3** - Framework JavaScript với Composition API
- **Vue Router** - Quản lý routing
- **Vite** - Build tool
- **Web Speech API** - Text-to-speech
- **Fetch API** - Gọi REST API

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **File System** - Lưu trữ dữ liệu JSON

## 📖 Hướng dẫn sử dụng

### 1. Khởi động ứng dụng
- Chạy backend trước: `cd backend && npm run dev`
- Chạy frontend: `npm run dev`
- Mở trình duyệt tại http://localhost:3000

### 2. Thêm chuyên mục
- Vào trang "Quản lý chuyên mục"
- Nhấn nút "➕ Thêm chuyên mục"
- Nhập tên chuyên mục và nhấn "Thêm"

### 3. Thêm bài post
- Vào trang "Quản lý bài post"
- Nhấn nút "➕ Thêm bài post"
- Chọn chuyên mục
- Nhập từ vựng
- Upload hình ảnh hoặc nhập URL hình ảnh
- Thêm các câu mẫu (có thể thêm nhiều câu)
- Nhấn "Thêm"

### 4. Xem và học từ vựng
- Nhấn vào bài post muốn xem
- Xem flashcard, từ vựng và câu mẫu
- Nhấn icon 🔊 để nghe phát âm

### 5. Chỉnh sửa hoặc xóa
- Trong danh sách chuyên mục hoặc bài post
- Nhấn nút "✏️ Sửa" để chỉnh sửa
- Nhấn nút "🗑️ Xóa" để xóa

## 🌟 Tính năng nổi bật

### Backend API
- RESTful API với Express.js
- Lưu trữ dữ liệu vào file JSON
- CRUD operations cho categories và posts
- Hỗ trợ upload ảnh base64
- Auto-create data directory

### Text-to-Speech
Ứng dụng sử dụng Web Speech API để đọc:
- Từ vựng tiếng Anh
- Các câu mẫu tiếng Anh

Yêu cầu:
- Trình duyệt hỗ trợ Web Speech API (Chrome, Edge, Safari)
- Kết nối internet (một số trình duyệt)

### Responsive Design
- Giao diện tự động điều chỉnh theo kích thước màn hình
- Hỗ trợ mobile, tablet và desktop

### Modern UI/UX
- Thiết kế hiện đại với gradient và animations
- Transitions mượt mà
- Icons trực quan
- Feedback tức thì cho người dùng
- Loading states và error handling

## 🔧 API Endpoints

### Categories
- `GET /api/categories` - Lấy tất cả chuyên mục
- `GET /api/categories/:id` - Lấy chuyên mục theo ID
- `POST /api/categories` - Thêm chuyên mục mới
- `PUT /api/categories/:id` - Cập nhật chuyên mục
- `DELETE /api/categories/:id` - Xóa chuyên mục

### Posts
- `GET /api/posts` - Lấy tất cả bài post
- `GET /api/posts?categoryId=1` - Lọc theo chuyên mục
- `GET /api/posts/:id` - Lấy bài post theo ID
- `POST /api/posts` - Thêm bài post mới
- `PUT /api/posts/:id` - Cập nhật bài post
- `DELETE /api/posts/:id` - Xóa bài post

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

Chi tiết API xem tại: [backend/README.md](backend/README.md)

## 🔧 Tùy chỉnh

### Thay đổi cổng backend
Chỉnh sửa file `backend/server.js` hoặc set biến môi trường:
```bash
PORT=3001 npm start
```

### Thay đổi API URL frontend
Chỉnh sửa `src/store/index.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

### Thay đổi màu sắc
Chỉnh sửa các giá trị màu trong các file `.vue` hoặc `style.css`

## 📝 Lưu ý

### Dữ liệu
- Dữ liệu được lưu trong `backend/data/*.json`
- Có thể backup bằng cách copy thư mục `data`
- Có thể edit trực tiếp file JSON nếu cần

### Vận hành
- Cần chạy cả backend và frontend
- Backend phải chạy trước khi frontend gọi API
- Đảm bảo port 5000 (backend) và 3000 (frontend) không bị chiếm dụng

### Bảo mật
Đây là ứng dụng đơn giản cho development/personal use. Trong production nên thêm:
- Authentication/Authorization
- Input validation & sanitization
- Rate limiting
- HTTPS
- Database thay vì file JSON
- Environment variables cho cấu hình

## 🐛 Xử lý lỗi

### Backend không chạy
```bash
# Kiểm tra port 5000 có bị chiếm không
lsof -i :5000

# Đổi sang port khác
PORT=3001 npm start
```

### Frontend không kết nối được backend
- Kiểm tra backend đang chạy
- Kiểm tra URL API trong `src/store/index.js`
- Kiểm tra CORS settings

### Lỗi khi upload ảnh
- Đảm bảo file ảnh < 10MB
- Backend hỗ trợ base64 encoding

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License

---

**Tạo bởi Vue.js + Node.js + ❤️**
