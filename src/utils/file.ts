import { Request } from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
export const initFolder = () => {
  const uploadFolderPath = path.resolve('src/uploads')
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true //muc dich la de tao folder nested
    })
  }
}
export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('src/uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 600 * 1024, // 600kb,
    filter: function ({ name, originalFilename, mimetype }) {
      console.log({ name, originalFilename, mimetype })
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files)
    })
  })
}
