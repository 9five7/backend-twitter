import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import mediasService from '~/services/medias.services'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const URL = await mediasService.uploadImage(req)
  res.json({
    message: USER_MESSAGE.UPLOAD_SUCCESS,
    result: URL
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const URL = await mediasService.uploadVideo(req)
  res.json({
    message: USER_MESSAGE.UPLOAD_SUCCESS,
    result: URL
  })
}
export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    res.status(httpStatus.BAD_REQUEST).send('Range header is required')
    return
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  //1MB =10^6 bytes
  // dung lượng video(bytes)
  const videoSize = fs.statSync(videoPath).size
  // dung lượng  video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6 //1MB
  // lấy giá trị bytes bắt đầu từ header range
  const start = Number(range.replace(/\D/g, ''))
  // lấy giá trị bytes kết thúc từ header range
  const end = Math.min(start + chunkSize, videoSize - 1)
  // dung lượng thực tế của mỗi đoạn stream
  // thường đây là chunkSize trừ đoạn cuối video
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(httpStatus.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
