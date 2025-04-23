import { NextFunction, Request, Response } from 'express'
import { USER_MESSAGE } from '~/constants/message'
import mediasService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const URL = await mediasService.handleUploadSingleImage(req)
  res.json({
    message: USER_MESSAGE.UPLOAD_SUCCESS,
    result: URL
  })
}
