import { assertEnv, env } from './env.js'
import { createApp, ensureSeed } from './app.js'

assertEnv()

const app = createApp()

ensureSeed()
  .catch((err) => {
    console.warn('Seed skipped:', err.message)
  })
  .finally(() => {
    app.listen(env.port, () => {
      console.log(`Khak API http://127.0.0.1:${env.port}`)
      console.log(`Swagger   http://127.0.0.1:${env.port}/api/docs`)
    })
  })
