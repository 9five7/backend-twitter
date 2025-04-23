import { config } from 'dotenv'
import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRouter from '~/routes/medias.routes'
import usersRouter from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
import { initFolder } from '~/utils/file'
config()
const app = express()
const port = process.env.PORT || 5000
// tạo folder upload nếu chưa có
initFolder()
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
databaseServices.connect()
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
