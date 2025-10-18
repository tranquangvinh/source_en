<template>
  <div class="post-detail">
    <div v-if="post" class="post-card">
      <!-- Two Column Layout -->
      <div class="two-column-layout">
        <!-- Left Column: Image -->
        <div class="left-column">
          <div class="flashcard-section">
            <h3>🖼️ Flashcard</h3>
            <div class="flashcard">
              <div v-if="post.image" class="flashcard-image">
                <img :src="post.image" :alt="post.vocabulary">
              </div>
              <div v-else class="flashcard-placeholder">
                <p>Không có hình ảnh</p>
              </div>
            </div>
          </div>

          <!-- Vocabulary -->
          <div class="vocabulary-section">
            <div class="section-header">
              <h3>📖 Từ vựng</h3>
              <button @click="speakText(post.vocabulary)" class="btn-speak" title="Đọc từ vựng">
                🔊
              </button>
            </div>
            <p class="vocabulary-text">{{ post.vocabulary }}</p>
            <span class="category-badge">{{ getCategoryName(post.categoryId) }}</span>
          </div>
        </div>

        <!-- Right Column: Speed Control + Examples -->
        <div class="right-column">
          <!-- Speed Control Compact -->
          <div class="speed-control-compact">
            <div class="speed-inline">
              <button @click="decreaseSpeed" class="speed-btn-mini" :disabled="speechRate <= 0.5">−</button>
              <input 
                type="range" 
                v-model.number="speechRate" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                class="speed-slider-compact"
              >
              <span class="speed-display">{{ speechRate }}x</span>
              <button @click="increaseSpeed" class="speed-btn-mini" :disabled="speechRate >= 2.0">+</button>
            </div>
          </div>

          <!-- Example Sentences -->
          <div class="examples-section">
            <h3>💬 Câu mẫu ({{ post.examples.length }})</h3>
            <div v-if="post.examples.length > 0" class="examples-list">
              <div v-for="(example, index) in post.examples" :key="index" class="example-card">
                <div class="example-number">{{ index + 1 }}</div>
                <div class="example-text">{{ example }}</div>
                <button 
                  @click="speakText(example)" 
                  class="btn-speak-example" 
                  title="Đọc câu mẫu"
                  :class="{ 'speaking': currentSpeaking === example }"
                >
                  🔊
                </button>
              </div>
            </div>
            <div v-else class="empty-examples">
              <p>Chưa có câu mẫu nào</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>⚠️ Không tìm thấy bài post</h2>
      <button @click="goBack" class="btn btn-primary">
        Quay lại danh sách
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import store from '../store'

const router = useRouter()
const route = useRoute()
const currentSpeaking = ref(null)
const speechRate = ref(0.9)

const post = computed(() => {
  const id = parseInt(route.params.id)
  return store.getPostById(id)
})

const getCategoryName = (categoryId) => {
  const category = store.getCategoryById(categoryId)
  return category ? category.name : 'Không có chuyên mục'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const increaseSpeed = () => {
  if (speechRate.value < 2.0) {
    speechRate.value = Math.round((speechRate.value + 0.1) * 10) / 10
    localStorage.setItem('speechRate', speechRate.value.toString())
  }
}

const decreaseSpeed = () => {
  if (speechRate.value > 0.5) {
    speechRate.value = Math.round((speechRate.value - 0.1) * 10) / 10
    localStorage.setItem('speechRate', speechRate.value.toString())
  }
}

const resetSpeed = () => {
  speechRate.value = 1.0
  localStorage.setItem('speechRate', speechRate.value.toString())
}

const speakText = (text) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    currentSpeaking.value = text
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = speechRate.value
    utterance.pitch = 1
    
    utterance.onend = () => {
      currentSpeaking.value = null
    }
    
    utterance.onerror = () => {
      currentSpeaking.value = null
      console.error('Speech synthesis error')
    }
    
    window.speechSynthesis.speak(utterance)
  } else {
    alert('Trình duyệt của bạn không hỗ trợ text-to-speech!')
  }
}

const goBack = () => {
  router.push('/posts')
}

onMounted(async () => {
  await Promise.all([
    store.fetchCategories(),
    store.fetchPosts()
  ])
  
  // Load saved speech rate
  const savedRate = localStorage.getItem('speechRate')
  if (savedRate) {
    speechRate.value = parseFloat(savedRate)
  }
  
  if (!post.value) {
    console.warn('Post not found')
  }
})
</script>

<style scoped>
.post-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.8rem;
  box-sizing: border-box;
}

.post-card {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.two-column-layout {
  display: flex;
  gap: 1rem;
  height: 100%;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.flashcard-section {
  flex-shrink: 0;
}

.flashcard-section h3 {
  margin: 0 0 0.4rem 0;
  color: #333;
  font-size: 0.75rem;
}

.flashcard {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  min-height: 250px;
}

.flashcard-image {
  max-width: 100%;
  max-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flashcard-image img {
  max-width: 100%;
  max-height: 250px;
  width: auto;
  height: auto;
  object-fit: contain;
}

.flashcard-placeholder {
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
  padding: 3rem;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  width: 100%;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vocabulary-section {
  padding: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  color: white;
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.section-header h3 {
  margin: 0;
  font-size: 0.75rem;
}

.vocabulary-text {
  margin: 0 0 0.4rem 0;
  font-size: 1rem;
  font-weight: 700;
}

.category-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
}

.examples-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.examples-section h3 {
  margin: 0 0 0.4rem 0;
  color: #333;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.example-card {
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 2px solid #667eea;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;
}

.example-card:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.example-number {
  background: #667eea;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.example-text {
  flex: 1;
  font-size: 0.75rem;
  color: #333;
  line-height: 1.4;
}

.btn-speak, .btn-speak-example {
  background: white;
  border: none;
  padding: 0.3rem;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-speak:hover, .btn-speak-example:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.btn-speak-example {
  background: #667eea;
  font-size: 0.7rem;
}

.btn-speak-example.speaking {
  animation: pulse 1s infinite;
  background: #42a5f5;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.empty-examples {
  padding: 0.8rem;
  text-align: center;
  color: #999;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.7rem;
}

.speed-control-compact {
  flex-shrink: 0;
  padding: 0.4rem 0.6rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.speed-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.speed-btn-mini {
  background: #667eea;
  color: white;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.speed-btn-mini:hover:not(:disabled) {
  background: #5568d3;
  transform: scale(1.05);
}

.speed-btn-mini:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.speed-slider-compact {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(to right, #e0e0e0 0%, #667eea 50%, #e0e0e0 100%);
  outline: none;
  -webkit-appearance: none;
}

.speed-slider-compact::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.4);
}

.speed-slider-compact::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.4);
}

.speed-display {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 35px;
  text-align: center;
  flex-shrink: 0;
}

.not-found {
  background: white;
  padding: 2rem 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  margin: 0 auto;
}

.not-found h2 {
  margin: 0 0 1rem 0;
  color: #ef5350;
  font-size: 1.2rem;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

