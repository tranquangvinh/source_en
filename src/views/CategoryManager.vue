<template>
  <div class="category-manager">
    <div class="page-header">
      <h2>📁 Quản lý chuyên mục</h2>
      <button @click="showAddModal = true" class="btn btn-primary">
        ➕ Thêm chuyên mục
      </button>
    </div>

    <div class="categories-list">
      <div v-for="category in categories" :key="category.id" class="category-item">
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p class="category-posts-count">
            {{ getPostsCount(category.id) }} bài post
          </p>
        </div>
        <div class="category-actions">
          <button @click="viewCategoryDetail(category.id)" class="btn btn-small btn-view">
            👁️ Chi tiết
          </button>
          <button @click="editCategory(category)" class="btn btn-small btn-edit">
            ✏️ Sửa
          </button>
          <button @click="confirmDelete(category)" class="btn btn-small btn-delete">
            🗑️ Xóa
          </button>
        </div>
      </div>

      <div v-if="categories.length === 0" class="empty-state">
        <p>Chưa có chuyên mục nào. Hãy thêm chuyên mục đầu tiên!</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingCategory" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingCategory ? '✏️ Sửa chuyên mục' : '➕ Thêm chuyên mục' }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Tên chuyên mục:</label>
            <input 
              v-model="categoryForm.name" 
              type="text" 
              placeholder="Nhập tên chuyên mục"
              @keyup.enter="saveCategory"
              class="form-input"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Hủy</button>
          <button @click="saveCategory" class="btn btn-primary">
            {{ editingCategory ? 'Cập nhật' : 'Thêm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingCategory" class="modal-overlay" @click.self="deletingCategory = null">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3>⚠️ Xác nhận xóa</h3>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa chuyên mục "<strong>{{ deletingCategory.name }}</strong>"?</p>
          <p class="warning-text">Lưu ý: Các bài post thuộc chuyên mục này vẫn sẽ được giữ lại.</p>
        </div>
        <div class="modal-footer">
          <button @click="deletingCategory = null" class="btn btn-secondary">Hủy</button>
          <button @click="deleteCategory" class="btn btn-delete">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const categories = computed(() => store.getCategories())
const showAddModal = ref(false)
const editingCategory = ref(null)
const deletingCategory = ref(null)
const categoryForm = ref({
  name: ''
})

const getPostsCount = (categoryId) => {
  return store.getPostsByCategory(categoryId).length
}

const viewCategoryDetail = (categoryId) => {
  router.push(`/categories/${categoryId}`)
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value.name = category.name
}

const confirmDelete = (category) => {
  deletingCategory.value = category
}

const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  categoryForm.value.name = ''
}

const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    alert('Vui lòng nhập tên chuyên mục!')
    return
  }

  try {
    if (editingCategory.value) {
      await store.updateCategory(editingCategory.value.id, {
        name: categoryForm.value.name
      })
    } else {
      await store.addCategory({
        name: categoryForm.value.name
      })
    }
    closeModal()
  } catch (error) {
    alert('Có lỗi xảy ra: ' + error.message)
  }
}

const deleteCategory = async () => {
  if (deletingCategory.value) {
    try {
      await store.deleteCategory(deletingCategory.value.id)
      deletingCategory.value = null
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message)
    }
  }
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    store.fetchCategories(),
    store.fetchPosts()
  ])
})
</script>

<style scoped>
.category-manager {
  animation: fadeIn 0.5s ease-in;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-item:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.category-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.3rem;
}

.category-posts-count {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  color: #666;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-view {
  background: #42a5f5;
  color: white;
}

.btn-view:hover {
  background: #1e88e5;
}

.btn-edit {
  background: #ffa726;
  color: white;
}

.btn-edit:hover {
  background: #fb8c00;
}

.btn-delete {
  background: #ef5350;
  color: white;
}

.btn-delete:hover {
  background: #e53935;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-small {
  max-width: 400px;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.warning-text {
  color: #ff9800;
  font-size: 0.9rem;
  margin-top: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

