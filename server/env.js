import dotenv from 'dotenv'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd,
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  jwtSecret: process.env.JWT_SECRET || (isProd ? '' : 'khak-dev-only-secret'),
  corsOrigins: String(process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  hfToken: process.env.HF_TOKEN || '',
  hfModel: process.env.HF_MODEL || 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
  hfTimeoutMs: Number(process.env.HF_TIMEOUT_MS || 20000),
}

export function assertEnv() {
  if (isProd && (!env.jwtSecret || env.jwtSecret.length < 24)) {
    throw new Error('JWT_SECRET must be set to a long random value in production.')
  }
  if (isProd && env.jwtSecret.includes('change-me')) {
    throw new Error('Replace the placeholder JWT_SECRET before deploying.')
  }
}
