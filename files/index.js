require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const { Server } = require('socket.io')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const profileRoutes = require('./routes/profiles')
const commentRoutes = require('./routes/comments')
const messageRoutes = require('./routes/messages')
const meetingRoutes = require('./routes/meetings')
const contactRoutes = require('./routes/contacts')
const adminRoutes = require('./routes/admin')
const uploadRoutes = require('./routes/upload')

const { errorHandler } = require('./middleware/errorHandler')
const { setupSocket } = require('./socket')
const logger = require('./utils/logger')

const app = express()
const server = http.createServer(app)

// ─── Socket.io ───────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
setupSocket(io)
app.set('io', io)

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
    },
  },
}))

// CORS — only allow frontend origin
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://anandamarga.org.bd',
    'https://www.anandamarga.org.bd',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Compression
app.use(compression())

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// HTTP request logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}))

// ─── Global Rate Limiting ─────────────────────────────────────
const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 200,                    // 200 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'অনেক বেশি request। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
})
app.use('/api', globalLimit)

// ─── Auth Rate Limiting (strict) ─────────────────────────────
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // Only 10 login attempts per 15 min
  message: { error: 'অনেক বেশি চেষ্টা। ১৫ মিনিট পর আবার চেষ্টা করুন।' },
  skipSuccessfulRequests: true,
})

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authLimit, authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/meetings', meetingRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use(errorHandler)

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

module.exports = { app, io }
