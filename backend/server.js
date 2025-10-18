import express from 'express'
import cors from 'cors'
import { ensureDataDir } from './utils/fileHelper.js'
import categoriesRouter from './routes/categories.js'
import postsRouter from './routes/posts.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' })) // Hỗ trợ upload ảnh base64

// Đảm bảo thư mục data tồn tại
await ensureDataDir()

// Routes
app.use('/api/categories', categoriesRouter)
app.use('/api/posts', postsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'English Learning API is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation:`)
  console.log(`   - GET    /api/categories`)
  console.log(`   - GET    /api/categories/:id`)
  console.log(`   - POST   /api/categories`)
  console.log(`   - PUT    /api/categories/:id`)
  console.log(`   - DELETE /api/categories/:id`)
  console.log(`   - GET    /api/posts`)
  console.log(`   - GET    /api/posts/:id`)
  console.log(`   - POST   /api/posts`)
  console.log(`   - PUT    /api/posts/:id`)
  console.log(`   - DELETE /api/posts/:id`)
})


