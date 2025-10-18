<template>
  <div class="home">
    <div class="welcome-card">
      <h2>🎓 Chào mừng đến với ứng dụng học tiếng Anh!</h2>
      <p>Quản lý bài học và từ vựng của bạn một cách hiệu quả</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📁</div>
        <div class="stat-content">
          <h3>{{ categories.length }}</h3>
          <p>Chuyên mục</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <h3>{{ posts.length }}</h3>
          <p>Bài post</p>
        </div>
      </div>
    </div>

    <div class="recent-posts" v-if="recentPosts.length > 0">
      <h3>📌 Bài post gần đây</h3>
      <div class="posts-grid">
        <div v-for="post in recentPosts" :key="post.id" class="post-card" @click="viewPost(post.id)">
          <div class="post-image" v-if="post.image">
            <img :src="post.image" :alt="post.vocabulary">
          </div>
          <div class="post-content">
            <h4>{{ post.vocabulary }}</h4>
            <span class="post-category">{{ getCategoryName(post.categoryId) }}</span>
            <p class="post-examples">{{ post.examples.length }} câu mẫu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const categories = computed(() => store.getCategories())
const posts = computed(() => store.getPosts())
const recentPosts = computed(() => {
  return [...store.getPosts()].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }).slice(0, 6)
})

const getCategoryName = (categoryId) => {
  const category = store.getCategoryById(categoryId)
  return category ? category.name : 'Không có chuyên mục'
}

const viewPost = (id) => {
  router.push(`/posts/${id}`)
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
.home {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.welcome-card h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
}

.welcome-card p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 3rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2.5rem;
  color: #667eea;
}

.stat-content p {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 1rem;
}

.recent-posts h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.post-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-content h4 {
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

.post-examples {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}
</style>

