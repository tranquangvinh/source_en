<template>
  <div class="post-manager">
    <div class="page-header">
      <h2>📝 Quản lý bài post</h2>
      <button @click="showAddModal = true" class="btn btn-primary">
        ➕ Thêm bài post
      </button>
    </div>

    <!-- Filter by category -->
    <div class="filter-section">
      <label>Lọc theo chuyên mục:</label>
      <select v-model="selectedCategory" class="form-select">
        <option :value="null">Tất cả</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="posts-list">
      <div v-for="post in filteredPosts" :key="post.id" class="post-item">
        <div class="post-image-preview" v-if="post.image">
          <img :src="post.image" :alt="post.vocabulary">
        </div>
        <div class="post-info">
          <h3>{{ post.vocabulary }}</h3>
          <span class="post-category">{{ getCategoryName(post.categoryId) }}</span>
          <p class="post-examples-count">{{ post.examples.length }} câu mẫu</p>
        </div>
        <div class="post-actions">
          <button @click="viewPost(post.id)" class="btn btn-small btn-view">
            👁️ Xem
          </button>
          <button @click="editPost(post)" class="btn btn-small btn-edit">
            ✏️ Sửa
          </button>
          <button @click="confirmDelete(post)" class="btn btn-small btn-delete">
            🗑️ Xóa
          </button>
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="empty-state">
        <p>{{ selectedCategory ? 'Không có bài post nào trong chuyên mục này.' : 'Chưa có bài post nào. Hãy thêm bài post đầu tiên!' }}</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingPost" class="modal-overlay" @click.self="closeModal">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>{{ editingPost ? '✏️ Sửa bài post' : '➕ Thêm bài post' }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Chuyên mục: *</label>
            <select v-model="postForm.categoryId" class="form-select">
              <option :value="null">Chọn chuyên mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Từ vựng: *</label>
            <input 
              v-model="postForm.vocabulary" 
              type="text" 
              placeholder="Nhập từ vựng"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Hình ảnh (URL hoặc base64):</label>
            <input 
              v-model="postForm.image" 
              type="text" 
              placeholder="https://example.com/image.jpg hoặc upload file"
              class="form-input"
            >
            <input 
              type="file" 
              @change="handleImageUpload" 
              accept="image/*"
              class="form-file"
            >
            <div v-if="postForm.image" class="image-preview">
              <img :src="postForm.image" alt="Preview">
            </div>
          </div>

          <div class="form-group">
            <label>Câu mẫu:</label>
            <div class="examples-list">
              <div v-for="(example, index) in postForm.examples" :key="index" class="example-item">
                <input 
                  v-model="postForm.examples[index]" 
                  type="text" 
                  placeholder="Nhập câu mẫu"
                  class="form-input"
                >
                <button @click="removeExample(index)" class="btn-remove">🗑️</button>
              </div>
            </div>
            <button @click="addExample" class="btn btn-secondary btn-small">
              ➕ Thêm câu mẫu
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Hủy</button>
          <button @click="savePost" class="btn btn-primary">
            {{ editingPost ? 'Cập nhật' : 'Thêm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingPost" class="modal-overlay" @click.self="deletingPost = null">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3>⚠️ Xác nhận xóa</h3>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa bài post "<strong>{{ deletingPost.vocabulary }}</strong>"?</p>
        </div>
        <div class="modal-footer">
          <button @click="deletingPost = null" class="btn btn-secondary">Hủy</button>
          <button @click="deletePost" class="btn btn-delete">Xóa</button>
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
const posts = computed(() => store.getPosts())
const selectedCategory = ref(null)
const showAddModal = ref(false)
const editingPost = ref(null)
const deletingPost = ref(null)
const postForm = ref({
  categoryId: null,
  vocabulary: '',
  image: '',
  examples: ['']
})

const filteredPosts = computed(() => {
  if (selectedCategory.value) {
    return posts.value.filter(post => post.categoryId === selectedCategory.value)
  }
  return posts.value
})

const getCategoryName = (categoryId) => {
  const category = store.getCategoryById(categoryId)
  return category ? category.name : 'Không có chuyên mục'
}

const viewPost = (id) => {
  router.push(`/posts/${id}`)
}

const editPost = (post) => {
  editingPost.value = post
  postForm.value = {
    categoryId: post.categoryId,
    vocabulary: post.vocabulary,
    image: post.image,
    examples: [...post.examples]
  }
}

const confirmDelete = (post) => {
  deletingPost.value = post
}

const closeModal = () => {
  showAddModal.value = false
  editingPost.value = null
  postForm.value = {
    categoryId: null,
    vocabulary: '',
    image: '',
    examples: ['']
  }
}

const addExample = () => {
  postForm.value.examples.push('')
}

const removeExample = (index) => {
  postForm.value.examples.splice(index, 1)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      postForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const savePost = async () => {
  if (!postForm.value.categoryId) {
    alert('Vui lòng chọn chuyên mục!')
    return
  }
  if (!postForm.value.vocabulary.trim()) {
    alert('Vui lòng nhập từ vựng!')
    return
  }

  // Filter out empty examples
  const examples = postForm.value.examples.filter(ex => ex.trim())

  try {
    if (editingPost.value) {
      await store.updatePost(editingPost.value.id, {
        categoryId: postForm.value.categoryId,
        vocabulary: postForm.value.vocabulary,
        image: postForm.value.image,
        examples: examples
      })
    } else {
      await store.addPost({
        categoryId: postForm.value.categoryId,
        vocabulary: postForm.value.vocabulary,
        image: postForm.value.image,
        examples: examples
      })
    }
    closeModal()
  } catch (error) {
    alert('Có lỗi xảy ra: ' + error.message)
  }
}

const deletePost = async () => {
  if (deletingPost.value) {
    try {
      await store.deletePost(deletingPost.value.id)
      deletingPost.value = null
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
.post-manager {
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

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.post-image-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.post-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
}

.post-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.3rem;
}

.post-category {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.post-examples-count {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.post-actions {
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
  overflow-y: auto;
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-large {
  max-width: 900px;
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
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
}

.form-file {
  margin-top: 0.5rem;
  width: 100%;
}

.image-preview {
  margin-top: 1rem;
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.example-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.example-item .form-input {
  flex: 1;
}

.btn-remove {
  background: #ef5350;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-remove:hover {
  background: #e53935;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

