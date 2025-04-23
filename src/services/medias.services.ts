import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { isProduction } from '~/constants/config'

import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'

class MediasService {
  async uploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  
  // async uploadVideo(req: Request) {
  //   const files = await handleUploadVideo(req)
  //   const file = files[0]
  //   if (!file) throw new Error('No video uploaded')

  //   const newName = getNameFromFullname(file.newFilename)
  //   const newPath = path.resolve(UPLOAD_VIDEO_DIR, `${newName}.mp4`)

  //   // Di chuyển file từ thư mục tạm sang thư mục lưu trữ
  //   await fs.promises.rename(file.filepath, newPath)

  //   return {
  //     url: isProduction
  //       ? `${process.env.HOST}/static/video/${newName}.mp4`
  //       : `http://localhost:${process.env.PORT}/static/video/${newName}.mp4`,
  //     type: MediaType.Video
  //   }
  // }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_VIDEO_DIR, `${newName}.mp4`)

        await fs.promises.rename(file.filepath, newPath)

        return {
          url: isProduction
            ? `${process.env.HOST}/static/video/${newName}.mp4`
            : `http://localhost:${process.env.PORT}/static/video/${newName}.mp4`,
          type: MediaType.Video
        }
      })
    )

    return result
  }
}

const mediasService = new MediasService()
export default mediasService
