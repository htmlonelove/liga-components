import type {
  IUploadOptions,
  WeekUploadOptions,
  CustomOptions
} from './UploadFile.d'

const defaultOptions: IUploadOptions = {
  uploadLength: 1,
  type: 'file',
  dropZone: false,
  preview: false,
  previewImg: false,
  maxFileSize: 4194304,
  accept: [],
  iconFormat: {},
  fileInfo: {
    fileName: true,
    fileSize: true
  },
  emptyMessage: 'Добавление файла обязательно',
  formatMessage: 'Недопустимый формат файла',
  errorMessage: 'Размер выбранных файлов превышает лимит'
}

const imageUploadOptions: WeekUploadOptions = {
  type: 'img',
  preview: true,
  previewImg: true,
  accept: ['.png', '.jpg', '.jpeg', '.webp'],
  iconFormat: {
    png: '/images/file/icon-file-png.png',
    jpg: '/images/file/icon-file-jpg.png',
    jpeg: '/images/file/icon-file-jpg.png',
    webp: '/images/file/icon-file-webp.png',
    default: '/images/file/icon-file-jpg.png'
  }
}

const fileUploadOptions: WeekUploadOptions = {
  type: 'file',
  preview: true,
  accept: ['.pdf', '.docx', '.xlsx'],
  iconFormat: {
    xlsx: '/images/file/icon-file-xls.png',
    docx: '/images/file/icon-file-doc.png',
    pdf: '/images/file/icon-file-pdf.png',
    default: '/images/file/icon-file-doc.png'
  }
}

const imgDropOptions: WeekUploadOptions = {
  type: 'img-drop',
  dropZone: true,
  previewImg: true,
  uploadLength: 4,
  accept: ['.png', '.jpg', '.jpeg', '.webp'],
  fileInfo: {
    fileName: false,
    fileSize: false
  },
  iconFormat: {
    png: '/images/file/icon-file-png.png',
    jpg: '/images/file/icon-file-jpg.png',
    jpeg: '/images/file/icon-file-jpg.png',
    webp: '/images/file/icon-file-webp.png',
    default: '/images/file/icon-file-jpg.png'
  }
}

const fileDropOptions: WeekUploadOptions = {
  type: 'file-drop',
  dropZone: true,
  uploadLength: 4,
  accept: ['.pdf', '.docx', '.xlsx'],
  iconFormat: {
    xlsx: '/images/file/icon-file-xls.png',
    docx: '/images/file/icon-file-doc.png',
    pdf: '/images/file/icon-file-pdf.png',
    default: '/images/file/icon-file-doc.png'
  }
}

const fileDropPreviewOptions: WeekUploadOptions = {
  type: 'file-drop-preview',
  dropZone: true,
  preview: true,
  uploadLength: 4,
  accept: ['.pdf', '.docx', '.xlsx'],
  iconFormat: {
    xlsx: '/images/file/icon-file-xls.png',
    docx: '/images/file/icon-file-doc.png',
    pdf: '/images/file/icon-file-pdf.png',
    default: '/images/file/icon-file-doc.png'
  }
}

const customOptions: CustomOptions = {
  'img': imageUploadOptions,
  'file': fileUploadOptions,
  'img-drop': imgDropOptions,
  'file-drop': fileDropOptions,
  'file-drop-preview': fileDropPreviewOptions
}

export { defaultOptions, customOptions }
