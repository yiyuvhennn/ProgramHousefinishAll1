import { createApp } from "./app"
import { seedDemoIfEmpty } from "./seedDemo"

async function bootstrap() {
  await seedDemoIfEmpty()

  const app = createApp()
  const port = Number(process.env.PORT) || 3001

  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`)
  })
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
