import { Router } from 'express'
import { serveVideoStreamController } from '~/controllers/medias.controllers'

const staticsRouter = Router()
staticsRouter.get('/:name', serveVideoStreamController)
export default staticsRouter
