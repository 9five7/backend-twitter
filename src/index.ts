import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
const app = express()
const port = 5000
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
databaseServices.connect()
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
