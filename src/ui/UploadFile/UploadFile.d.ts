type FileExtension =
  | '.png'
  | '.jpg'
  | '.jpeg'
  | '.webp'
  | '.avif'
  | '.pdf'
  | '.docx'
  | '.xlsx'
type FileFormat =
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'default'
type FileType = 'img' | 'file' | 'img-drop' | 'file-drop' | 'file-drop-preview'

type FileIconFormat = {
  // eslint-disable-next-line no-unused-vars
  [key in FileFormat]?: string
}

interface IFileInfo {
  fileName: boolean
  fileSize: boolean
}

interface IUploadOptions {
  uploadLength: number
  type: FileType
  dropZone: boolean
  preview: boolean
  previewImg: boolean
  maxFileSize: number
  accept: FileExtension[]
  iconFormat: FileIconFormat
  fileInfo: IFileInfo
  emptyMessage: string
  formatMessage: string
  errorMessage: string
}

type WeekUploadOptions = {
  [key in keyof IUploadOptions]?: IUploadOptions[key]
}

type CustomOptions = {
  // eslint-disable-next-line no-unused-vars
  [key in FileType]: WeekUploadOptions
}

export type {
  IUploadOptions,
  FileExtension,
  FileFormat,
  FileType,
  FileIconFormat,
  IFileInfo,
  WeekUploadOptions,
  CustomOptions
}
