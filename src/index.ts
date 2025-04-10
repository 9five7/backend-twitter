import express, { NextFunction, Request, Response } from 'express'
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('lỗi là ', err.message)
  res.status(400).json({ error: err.message })
  next()
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
