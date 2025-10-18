import { reactive } from 'vue'

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api'

// Store state
const state = reactive({
  categories: [],
  posts: [],
  loading: false,
  error: null
})

// API Helper functions
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    state.error = error.message
    throw error
  }
}

// Store actions
const store = {
  // Categories
  async fetchCategories() {
    try {
      state.loading = true
      state.error = null
      const data = await apiCall(`${API_BASE_URL}/categories`)
      state.categories = data
      return data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    } finally {
      state.loading = false
    }
  },

  getCategories() {
    return state.categories
  },

  getCategoryById(id) {
    return state.categories.find(cat => cat.id === id)
  },

  async addCategory(category) {
    try {
      state.loading = true
      state.error = null
      const newCategory = await apiCall(`${API_BASE_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify({ name: category.name })
      })
      state.categories.push(newCategory)
      return newCategory
    } catch (error) {
      console.error('Failed to add category:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  async updateCategory(id, updates) {
    try {
      state.loading = true
      state.error = null
      const updatedCategory = await apiCall(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      const index = state.categories.findIndex(cat => cat.id === id)
      if (index !== -1) {
        state.categories[index] = updatedCategory
      }
      return updatedCategory
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  async deleteCategory(id) {
    try {
      state.loading = true
      state.error = null
      await apiCall(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      })
      const index = state.categories.findIndex(cat => cat.id === id)
      if (index !== -1) {
        state.categories.splice(index, 1)
      }
      return true
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  // Posts
  async fetchPosts() {
    try {
      state.loading = true
      state.error = null
      const data = await apiCall(`${API_BASE_URL}/posts`)
      state.posts = data
      return data
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      return []
    } finally {
      state.loading = false
    }
  },

  getPosts() {
    return state.posts
  },

  getPostById(id) {
    return state.posts.find(post => post.id === parseInt(id))
  },

  getPostsByCategory(categoryId) {
    return state.posts.filter(post => post.categoryId === categoryId)
  },

  async addPost(post) {
    try {
      state.loading = true
      state.error = null
      const newPost = await apiCall(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify({
          categoryId: post.categoryId,
          vocabulary: post.vocabulary,
          image: post.image || '',
          examples: post.examples || []
        })
      })
      state.posts.push(newPost)
      return newPost
    } catch (error) {
      console.error('Failed to add post:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  async updatePost(id, updates) {
    try {
      state.loading = true
      state.error = null
      const updatedPost = await apiCall(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      const index = state.posts.findIndex(post => post.id === id)
      if (index !== -1) {
        state.posts[index] = updatedPost
      }
      return updatedPost
    } catch (error) {
      console.error('Failed to update post:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  async deletePost(id) {
    try {
      state.loading = true
      state.error = null
      await apiCall(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE'
      })
      const index = state.posts.findIndex(post => post.id === id)
      if (index !== -1) {
        state.posts.splice(index, 1)
      }
      return true
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    } finally {
      state.loading = false
    }
  },

  // Utility
  getState() {
    return state
  }
}

export default store
