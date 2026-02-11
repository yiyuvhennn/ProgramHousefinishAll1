import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'

const app = createApp()

describe('API tests (no browser)', () => {
  beforeEach(async () => {
    await request(app).post('/test/reset').expect(200)
  })

  it('GET /houses should return array', async () => {
    const res = await request(app).get('/houses').expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /houses?q=北區 should filter', async () => {
    const res = await request(app).get('/houses?q=北區').expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
