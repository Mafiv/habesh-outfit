import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { jwt } from 'better-auth/plugins'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stylish'
const client = new MongoClient(mongoUri)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-in-production-min-32-chars!!',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
})

export { client as mongoClient }
