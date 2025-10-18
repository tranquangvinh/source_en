# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy ứng dụng English Learning App.

## ⚡ Chạy ứng dụng trong 3 bước

### Bước 1: Cài đặt Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend đang chạy tại: http://localhost:5000

### Bước 2: Cài đặt Frontend
Mở terminal mới:
```bash
cd /Users/4dvnpartner/Desktop/souce_en
npm install
npm run dev
```
✅ Frontend đang chạy tại: http://localhost:3000

### Bước 3: Mở trình duyệt
Truy cập: **http://localhost:3000**

---

## 📋 Checklist

- [ ] Node.js đã được cài đặt (node -v)
- [ ] Backend đang chạy (terminal 1)
- [ ] Frontend đang chạy (terminal 2)
- [ ] Trình duyệt mở http://localhost:3000

---

## 🎯 Các lệnh quan trọng

### Backend
```bash
cd backend
npm run dev       # Chạy với auto-reload
npm start         # Chạy production mode
```

### Frontend
```bash
npm run dev       # Development mode
npm run build     # Build production
npm run preview   # Preview production build
```

---

## 🔥 Sử dụng nhanh

1. **Tạo chuyên mục**: Vào "Quản lý chuyên mục" → Thêm chuyên mục
2. **Tạo bài post**: Vào "Quản lý bài post" → Thêm bài post
3. **Xem và học**: Click vào bài post → Nhấn 🔊 để nghe phát âm

---

## ⚠️ Troubleshooting

### Backend không chạy?
```bash
# Kiểm tra port 5000
lsof -i :5000

# Hoặc đổi port
PORT=3001 npm start
```

### Frontend không kết nối API?
- Đảm bảo backend đang chạy
- Kiểm tra console browser (F12)
- URL API: http://localhost:5000/api

### Lỗi "Cannot find module"?
```bash
# Cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Dữ liệu

Dữ liệu được lưu tại: `backend/data/`
- `categories.json` - Chuyên mục
- `posts.json` - Bài post

Backup: Copy thư mục `backend/data/`

---

**Happy Learning! 🎓✨**


