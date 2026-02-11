import express from 'express'
import cors from 'cors'

import testRouter from './reset'
import housesRouter from './houses'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/test', testRouter)
  app.use('/houses', housesRouter)

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })
  app.get("/", (_req, res) => {
    res.send("API server is running");
  });

  return app
}
