import { createElement, renderElement } from 'src/scripts/utils/render'
import type UploadFile from '../UploadFile'
import type { IUploadOptions } from '../UploadFile.d'

const postfixes = ['B', 'KB', 'MB', 'GB', 'TB']

export default class UploadFilePreview {
  #uploadFile: UploadFile
  #previewBlock: HTMLElement
  #container: HTMLElement

  constructor(parent: UploadFile, container: HTMLElement = null) {
    this.#uploadFile = parent
    this.#container = container || this.#uploadFile
    this.#previewBlock = createElement(
      '<div class="upload-file__preview"></div>'
    )
    renderElement(this.#container, this.#previewBlock)
    this.#previewBlock.addEventListener('click', this.#previewClickHandler)
  }

  #previewClickHandler = (event: Event) => {
    const target = event.target as HTMLElement
    const fileName = target.dataset?.fileName as string
    if (!fileName) {
      return
    }

    const removeEvent = new CustomEvent('fileremoved', { detail: { fileName } })
    this.#uploadFile.dispatchEvent(removeEvent)
  }

  renderFile({
    file,
    options,
    error
  }: {
    file: File
    options: IUploadOptions
    error: boolean
  }) {
    const fileReader = new FileReader()
    fileReader.addEventListener('load', (readerEvent) => {
      renderElement(
        this.#previewBlock,
        createElement(
          this.#createPreviewMarkup({ file, readerEvent, options, error })
        )
      )
    })
    fileReader.readAsDataURL(file)
  }

  reset() {
    this.#previewBlock.innerHTML = ''
  }

  #createPreviewMarkup({
    file,
    readerEvent,
    options,
    error
  }: {
    file: File
    readerEvent: ProgressEvent<FileReader>
    options: IUploadOptions
    error: boolean
  }) {
    const nameArray = file.name.split('.')
    const extension = nameArray[nameArray.length - 1]

    const errorClass = error ? 'is-invalid' : ''

    return `<div class="upload-file__preview-item ${errorClass}">
            <button class="upload-file__preview-item-remove" type="button" data-file-name="${
  file.name
}">&times;</button>
            ${
  options.previewImg
    ? `<img class="upload-file__preview-img" src="${readerEvent.target.result}" alt="${file.name}" />`
    : ''
}
            ${
  options.iconFormat
    ? `<img class="upload-file__preview-icon" src="${
      options.iconFormat[extension]
        ? options.iconFormat[extension]
        : options.iconFormat.default
    }" alt="" />`
    : ''
}
            ${
  options.fileInfo
    ? `<div class="upload-file__preview-file-info" />
              ${
  options.fileInfo.fileName
    ? `<span class="upload-file__preview-file-name" />
                ${file.name}
              </span>`
    : ''
}
              ${
  options.fileInfo.fileSize
    ? `<span class="upload-file__preview-file-size" />
                ${this.#bytesToSize(file.size)}
              </span>`
    : ''
}
            </div>`
    : ''
}
          </div>`
  }

  #bytesToSize(bytes: number): string {
    let result = bytes

    let i = 0
    while (result > 1024) {
      result /= 1024
      i++
    }

    return `${Math.round(result)}${postfixes[i]}`
  }
}
