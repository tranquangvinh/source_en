<template>
  <div class="category-detail">
    <div v-if="shuffledPosts.length > 0" class="content-wrapper">
      <!-- Slider Controls -->
      <div class="slider-controls">
        <button 
          @click="previousCard" 
          :disabled="currentIndex === 0"
          class="slider-btn slider-btn-prev"
        >
          ⬅️
        </button>
        
        <div class="slider-counter">
          {{ currentIndex + 1 }} / {{ shuffledPosts.length }}
        </div>
        
        <button 
          @click="nextCard" 
          :disabled="currentIndex === shuffledPosts.length - 1"
          class="slider-btn slider-btn-next"
        >
          ➡️
        </button>
      </div>

      <!-- Flashcard -->
      <div class="flashcard-slider">
        <div class="flashcard" :key="currentPost.id">
          <!-- Two Column Layout -->
          <div class="two-column-layout">
            <!-- Left Column: Image + Vocabulary -->
            <div class="left-column">
              <!-- Image -->
              <div class="flashcard-image-section">
                <div v-if="currentPost.image" class="flashcard-image">
                  <img :src="currentPost.image" :alt="currentPost.vocabulary">
                </div>
                <div v-else class="flashcard-image-placeholder">
                  <span>📖</span>
                </div>
              </div>

              <!-- Vocabulary with Eye Toggle -->
              <div class="flashcard-vocabulary">
                <div class="section-with-toggle">
                  <h3>Từ vựng</h3>
                  <button 
                    @click="toggleVocabularyVisibility" 
                    class="toggle-eye-btn"
                    :class="{ 'active': showVocabulary }"
                  >
                    {{ showVocabulary ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                
                <div class="vocabulary-content">
                  <div v-if="showVocabulary" class="vocabulary-text-visible">
                    {{ currentPost.vocabulary }}
                  </div>
                  <div v-else class="vocabulary-text-hidden">
                    ● ● ● ● ● ●
                  </div>
                  
                  <button 
                    @click="speakText(currentPost.vocabulary)" 
                    class="btn-speak-inline"
                    title="Đọc từ vựng"
                  >
                    🔊
                  </button>
                </div>
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

              <!-- Examples with Eye Toggle -->
              <div class="flashcard-examples">
                <div class="section-with-toggle">
                  <h3>Câu mẫu ({{ currentPost.examples.length }})</h3>
                  <button 
                    @click="toggleAllExamples" 
                    class="toggle-eye-btn"
                    :class="{ 'active': allExamplesVisible }"
                  >
                    {{ allExamplesVisible ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>

                <div v-if="currentPost.examples.length > 0" class="examples-list-wrapper">
                  <div class="examples-list">
                  <div 
                    v-for="(example, index) in currentPost.examples" 
                    :key="index" 
                    class="example-item"
                  >
                    <div class="example-number">{{ index + 1 }}</div>
                    
                    <div class="example-content">
                      <div v-if="exampleVisibility[index]" class="example-text-visible">
                        {{ example }}
                      </div>
                      <div v-else class="example-text-hidden">
                        ● ● ● ● ● ● ● ●
                      </div>
                    </div>

                    <button 
                      @click="toggleExampleVisibility(index)" 
                      class="toggle-eye-btn-small"
                      :class="{ 'active': exampleVisibility[index] }"
                    >
                      {{ exampleVisibility[index] ? '👁️' : '👁️‍🗨️' }}
                    </button>
                    
                    <button 
                      @click="speakText(example)" 
                      class="btn-speak-small"
                      :class="{ 'speaking': currentSpeaking === example }"
                      title="Đọc câu mẫu"
                    >
                      🔊
                    </button>
                  </div>
                  </div>
                </div>
                <div v-else class="empty-examples">
                  <p>Chưa có câu mẫu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="category" class="empty-state">
      <p>Chưa có bài post nào trong chuyên mục này.</p>
      <button @click="goToPosts" class="btn btn-primary">
        ➕ Thêm bài post
      </button>
    </div>

    <div v-else class="not-found">
      <h2>⚠️ Không tìm thấy chuyên mục</h2>
      <button @click="goBack" class="btn btn-primary">
        Quay lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import store from '../store'

const router = useRouter()
const route = useRoute()

const currentIndex = ref(0)
const showVocabulary = ref(false)
const exampleVisibility = ref([])
const currentSpeaking = ref(null)
const speechRate = ref(0.9)
const shuffledPosts = ref([])

const category = computed(() => {
  const id = parseInt(route.params.id)
  return store.getCategoryById(id)
})

const categoryPosts = computed(() => {
  const id = parseInt(route.params.id)
  return store.getPostsByCategory(id)
})

// Shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const currentPost = computed(() => {
  return shuffledPosts.value[currentIndex.value] || {}
})

const allExamplesVisible = computed(() => {
  if (exampleVisibility.value.length === 0) return false
  return exampleVisibility.value.every(visible => visible)
})

// Watch for category posts changes and shuffle
watch(categoryPosts, (posts) => {
  if (posts.length > 0) {
    shuffledPosts.value = shuffleArray(posts)
    currentIndex.value = 0
  }
}, { immediate: true })

// Initialize example visibility
watch(currentPost, (newPost) => {
  if (newPost.examples) {
    exampleVisibility.value = new Array(newPost.examples.length).fill(false)
  }
  // Reset vocabulary visibility when changing cards
  showVocabulary.value = false
}, { immediate: true })

const toggleVocabularyVisibility = () => {
  showVocabulary.value = !showVocabulary.value
}

const toggleExampleVisibility = (index) => {
  exampleVisibility.value[index] = !exampleVisibility.value[index]
}

const toggleAllExamples = () => {
  const newValue = !allExamplesVisible.value
  exampleVisibility.value = exampleVisibility.value.map(() => newValue)
}

const nextCard = () => {
  if (currentIndex.value < shuffledPosts.value.length - 1) {
    currentIndex.value++
  }
}

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
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
    }
    
    window.speechSynthesis.speak(utterance)
  } else {
    alert('Trình duyệt của bạn không hỗ trợ text-to-speech!')
  }
}

const goBack = () => {
  router.push('/categories')
}

const goToPosts = () => {
  router.push('/posts')
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (event.key === 'ArrowLeft') {
    previousCard()
  } else if (event.key === 'ArrowRight') {
    nextCard()
  } else if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault()
    toggleVocabularyVisibility()
  }
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
  
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
.category-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.8rem;
  box-sizing: border-box;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.slider-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}

.slider-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.slider-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.slider-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.slider-counter {
  font-size: 0.75rem;
  font-weight: 700;
  color: #667eea;
  min-width: 50px;
  text-align: center;
}

.flashcard-slider {
  perspective: 1000px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.flashcard {
  background: white;
  border-radius: 8px;
  padding: 0.6rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  animation: slideIn 0.5s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  gap: 0.5rem;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.flashcard-image-section {
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.flashcard-image {
  max-width: 100%;
  max-height: 250px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.flashcard-image-placeholder {
  width: 100%;
  max-width: 300px;
  height: 250px;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.flashcard-vocabulary {
  padding: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  color: white;
  flex-shrink: 0;
}

.flashcard-examples {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-with-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}

.section-with-toggle h3 {
  margin: 0;
  font-size: 0.75rem;
}


.examples-list-wrapper::-webkit-scrollbar {
  width: 4px;
}

.examples-list-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.examples-list-wrapper::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.examples-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.flashcard-examples .section-with-toggle h3 {
  color: #333;
}

.toggle-eye-btn {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.flashcard-examples .toggle-eye-btn {
  background: white;
  border-color: #667eea;
  color: #667eea;
}

.toggle-eye-btn:hover,
.toggle-eye-btn.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.flashcard-examples .toggle-eye-btn:hover,
.flashcard-examples .toggle-eye-btn.active {
  background: #667eea;
  color: white;
}

.vocabulary-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.vocabulary-text-visible {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  padding: 0.3rem;
  animation: fadeIn 0.3s ease;
}

.vocabulary-text-hidden {
  flex: 1;
  font-size: 1.1rem;
  text-align: center;
  padding: 0.3rem;
  opacity: 0.5;
  letter-spacing: 0.25rem;
}

.btn-speak-inline {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.35rem;
  border-radius: 50%;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-speak-inline:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-item {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border-left: 2px solid #667eea;
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

.example-content {
  flex: 1;
  min-height: 16px;
}

.example-text-visible {
  font-size: 0.75rem;
  color: #333;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;
}

.example-text-hidden {
  font-size: 0.75rem;
  color: #999;
  opacity: 0.5;
  letter-spacing: 0.15rem;
}

.toggle-eye-btn-small {
  background: white;
  border: 1.5px solid #667eea;
  color: #667eea;
  padding: 0.25rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-eye-btn-small:hover,
.toggle-eye-btn-small.active {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.btn-speak-small {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.25rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-speak-small:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.btn-speak-small.speaking {
  animation: pulse 1s infinite;
  background: #42a5f5;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.empty-examples {
  padding: 0.6rem;
  text-align: center;
  color: #999;
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

.empty-state {
  background: white;
  padding: 3rem 1.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  margin: 0 0 1.2rem 0;
  color: #666;
  font-size: 1rem;
}

.not-found {
  background: white;
  padding: 3rem 1.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  margin: 0 0 1.5rem 0;
  color: #ef5350;
  font-size: 1.5rem;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .slider-container {
    max-width: 100%;
  }

  .slider-controls {
    gap: 0.6rem;
  }

  .slider-btn {
    padding: 0.35rem 0.5rem;
    font-size: 0.75rem;
  }

  .slider-counter {
    font-size: 0.75rem;
    min-width: 50px;
  }

  .flashcard {
    padding: 0.8rem;
  }

  .vocabulary-text-visible,
  .vocabulary-text-hidden {
    font-size: 1.1rem;
  }

  .example-item {
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.4rem;
  }

  .category-header h2 {
    font-size: 1.1rem;
  }

  .example-text-visible,
  .example-text-hidden {
    font-size: 0.7rem;
  }

  .flashcard-image,
  .flashcard-image img {
    max-height: 110px;
  }

  .flashcard-image-placeholder {
    height: 110px;
    font-size: 2rem;
  }

  .speed-control {
    padding: 0.6rem;
  }

  .speed-btn {
    padding: 0.3rem 0.4rem;
    font-size: 0.65rem;
  }
}
</style>

