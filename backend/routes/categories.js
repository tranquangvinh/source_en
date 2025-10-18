import express from 'express'
import { readJSONFile, writeJSONFile } from '../utils/fileHelper.js'

const router = express.Router()
const CATEGORIES_FILE = 'categories.json'

// GET - Lấy tất cả categories
router.get('/', async (req, res) => {
  try {
    const categories = await readJSONFile(CATEGORIES_FILE)
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET - Lấy category theo ID
router.get('/:id', async (req, res) => {
  try {
    const categories = await readJSONFile(CATEGORIES_FILE)
    const category = categories.find(c => c.id === parseInt(req.params.id))
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    res.json(category)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

// POST - Thêm category mới
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    
    const categories = await readJSONFile(CATEGORIES_FILE)
    
    const newCategory = {
      id: Date.now(),
      name: name.trim()
    }
    
    categories.push(newCategory)
    await writeJSONFile(CATEGORIES_FILE, categories)
    
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// PUT - Cập nhật category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body
    const id = parseInt(req.params.id)
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    
    const categories = await readJSONFile(CATEGORIES_FILE)
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    categories[index] = {
      ...categories[index],
      name: name.trim()
    }
    
    await writeJSONFile(CATEGORIES_FILE, categories)
    
    res.json(categories[index])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' })
  }
})

// DELETE - Xóa category
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const categories = await readJSONFile(CATEGORIES_FILE)
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    categories.splice(index, 1)
    await writeJSONFile(CATEGORIES_FILE, categories)
    
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router

