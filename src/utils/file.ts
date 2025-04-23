import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_TEMP_IMAGE_DIR, UPLOAD_TEMP_VIDEO_DIR } from '~/constants/dir'
export const initFolder = () => {
  ;[UPLOAD_TEMP_IMAGE_DIR, UPLOAD_TEMP_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //muc dich la de tao folder nested
      })
    }
  })
}
export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_IMAGE_DIR,
    maxFiles: 10, // số file nguoi dung upload
    keepExtensions: true, // giu nguyen duoi file
    maxFileSize: 300 * 1024, // 300kb,
    maxTotalFileSize: 300 * 1024 * 4, // 1.2MB
    filter: function ({ name, originalFilename, mimetype }) {
      console.log({ name, originalFilename, mimetype })
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}
export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_VIDEO_DIR,
    maxFiles: 4, // số file nguoi dung upload
    keepExtensions: true, // giu nguyen duoi file
    maxFileSize: 600 * 1024 * 1024, // 600MB
    filter: function ({ name, originalFilename, mimetype }) {
      return true
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.video as File[])
    })
  })
}
export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
