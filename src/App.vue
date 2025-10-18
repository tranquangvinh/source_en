<template>
  <div id="app">
    <header class="app-header">
      <button @click="toggleMenu" class="menu-toggle">
        ☰
      </button>
      <h1>📚 English Learning App</h1>
    </header>

    <!-- Side Navigation Menu -->
    <div v-if="showMenu" class="menu-overlay" @click="toggleMenu">
      <nav class="side-nav" @click.stop>
        <div class="nav-header">
          <h2>Menu</h2>
          <button @click="toggleMenu" class="close-btn">✕</button>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link" @click="toggleMenu">
            🏠 Trang chủ
          </router-link>
          <router-link to="/categories" class="nav-link" @click="toggleMenu">
            📁 Quản lý chuyên mục
          </router-link>
          <router-link to="/posts" class="nav-link" @click="toggleMenu">
            📝 Quản lý bài post
          </router-link>
        </div>
      </nav>
    </div>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.6rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.menu-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app-header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  animation: slideInLeft 0.3s ease;
  display: flex;
  flex-direction: column;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.8rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-links {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  display: block;
}

.nav-link:hover {
  background: #667eea;
  color: white;
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}
</style>

