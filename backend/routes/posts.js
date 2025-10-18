import express from 'express'
import { readJSONFile, writeJSONFile } from '../utils/fileHelper.js'

const router = express.Router()
const POSTS_FILE = 'posts.json'

// GET - Lấy tất cả bài post
router.get('/', async (req, res) => {
  try {
    const posts = await readJSONFile(POSTS_FILE)
    const { categoryId } = req.query
    
    if (categoryId) {
      const filtered = posts.filter(post => post.categoryId === parseInt(categoryId))
      return res.json(filtered)
    }
    
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// GET - Lấy bài post theo ID
router.get('/:id', async (req, res) => {
  try {
    const posts = await readJSONFile(POSTS_FILE)
    const post = posts.find(p => p.id === parseInt(req.params.id))
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// POST - Thêm bài post mới
router.post('/', async (req, res) => {
  try {
    const { categoryId, vocabulary, image, examples } = req.body
    
    if (!categoryId || !vocabulary || !vocabulary.trim()) {
      return res.status(400).json({ error: 'Category ID and vocabulary are required' })
    }
    
    const posts = await readJSONFile(POSTS_FILE)
    
    const newPost = {
      id: Date.now(),
      categoryId: parseInt(categoryId),
      vocabulary: vocabulary.trim(),
      image: image || '',
      examples: examples || [],
      createdAt: new Date().toISOString()
    }
    
    posts.push(newPost)
    await writeJSONFile(POSTS_FILE, posts)
    
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// PUT - Cập nhật bài post
router.put('/:id', async (req, res) => {
  try {
    const { categoryId, vocabulary, image, examples } = req.body
    const id = parseInt(req.params.id)
    
    if (!categoryId || !vocabulary || !vocabulary.trim()) {
      return res.status(400).json({ error: 'Category ID and vocabulary are required' })
    }
    
    const posts = await readJSONFile(POSTS_FILE)
    const index = posts.findIndex(p => p.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    posts[index] = {
      ...posts[index],
      categoryId: parseInt(categoryId),
      vocabulary: vocabulary.trim(),
      image: image || '',
      examples: examples || [],
      updatedAt: new Date().toISOString()
    }
    
    await writeJSONFile(POSTS_FILE, posts)
    
    res.json(posts[index])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// DELETE - Xóa bài post
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const posts = await readJSONFile(POSTS_FILE)
    const index = posts.findIndex(p => p.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    posts.splice(index, 1)
    await writeJSONFile(POSTS_FILE, posts)
    
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router



