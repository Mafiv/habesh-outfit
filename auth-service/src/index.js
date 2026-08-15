import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth, mongoClient } from './auth.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL || 'http://localhost:5173',
    ],
    credentials: true,
  })
)

app.all('/api/auth/*', toNodeHandler(auth))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'better-auth' })
})

async function start() {
  await mongoClient.connect()
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`Better Auth service running on http://localhost:${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start auth service:', err)
  process.exit(1)
})
