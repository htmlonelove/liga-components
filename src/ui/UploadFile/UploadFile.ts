import { createElement, renderElement } from 'src/scripts/utils/render'
import type { IUploadOptions, FileType, FileExtension } from './UploadFile.d'
import UploadFilePreview from './UploadFilePreview/UploadFilePreview'
import UploadFileDrop from './UploadFileDrop/UploadFileDrop.ts'
import { defaultOptions, customOptions } from './UploadFile.config'

export default class UploadFile extends HTMLElement {
  #input: HTMLInputElement
  #options: IUploadOptions
  #files: File[] = []
  #fileDrop = null
  #filePreview = null
  #maxFullSize = 0
  #message = null

  connectedCallback() {
    this.#input = this.querySelector('input')

    const type = this.getAttribute('data-upload') as FileType
    this.#options = { ...defaultOptions, ...customOptions[type] }
    this.#maxFullSize = this.#options.maxFileSize * this.#options.uploadLength

    if (this.#options.uploadLength > 1) {
      this.#input.setAttribute('multiple', '')
    }

    if (this.#options.accept.length) {
      this.#input.setAttribute('accept', this.#options.accept.join(','))
    }

    this.#filePreview = this.#options.preview
      ? new UploadFilePreview(this)
      : null
    this.#fileDrop = this.#options.dropZone ? new UploadFileDrop(this) : null

    this.#input.addEventListener('change', this.#inputChangeHandler)
    this.addEventListener('dragover', this.#inputDragOverHandler)
    this.addEventListener('drop', this.#inputDropHandler)
    this.addEventListener('dropzoneclick', this.#dropZoneClickHandler)
    this.addEventListener('filesdroped', (event: CustomEvent) =>
      this.#filesDropHandler(event.detail.files)
    )
    this.addEventListener('fileremoved', (event: CustomEvent) =>
      this.#fileRemoveHandler(event.detail.fileName)
    )
  }

  #inputChangeHandler = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files.length) {
      return
    }

    this.#files = [...this.#files, ...target.files].slice(
      -1 * this.#options.uploadLength
    )
    this.#renderFiles()
  }

  #inputDragOverHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  #inputDropHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const files = event.dataTransfer?.files
    if (!files?.length) {
      return
    }

    this.#files = [...this.#files, ...files].slice(
      -1 * this.#options.uploadLength
    )
    this.#renderFiles()
  }

  #renderFiles(): void {
    this.#files = this.#filterFiles()
    this.#updateFileList(this.#files)
    this.#updateErrorState()

    if (this.#filePreview) {
      this.#filePreview.reset()
      this.#files.forEach((file) => {
        this.#filePreview.renderFile({
          file,
          options: this.#options,
          error: !this.#checkMaxFileSize(file)
        })
      })
    }

    if (this.#fileDrop) {
      this.#fileDrop.reset()
      this.#files.forEach((file) => {
        this.#fileDrop.renderFile({
          file,
          options: this.#options,
          error: !this.#checkMaxFileSize(file)
        })
      })
    }
  }

  #filterFiles(): File[] {
    if (this.#options.accept.length) {
      return this.#files.filter((file) =>
        this.#options.accept.includes(
          ('.' + file.name.split('.').pop()) as FileExtension
        )
      )
    }

    return this.#files
  }

  #updateFileList(files: File[]): void {
    const dataTransfer = new DataTransfer()
    files.forEach((file: File) => dataTransfer.items.add(file))
    this.#input.files = dataTransfer.files
  }

  #checkMaxSize(): boolean {
    const fullSize = this.#files.reduce((acc, file) => acc + file.size, 0)
    return (
      fullSize <= this.#maxFullSize &&
      this.#files.every((file) => file.size <= this.#options.maxFileSize)
    )
  }

  #checkMaxFileSize(file: File): boolean {
    return file.size <= this.#options.maxFileSize
  }

  #updateErrorState(): void {
    const error = !this.#checkMaxSize()

    if (this.#message) {
      this.#message.remove()
      this.#message = null
    }

    if (error) {
      this.#message = createElement(
        `<div class="upload-file__message">${this.#options.errorMessage}</div>`
      )
      renderElement(this, this.#message)
      this.classList.add('is-invalid')
    } else {
      this.classList.remove('is-invalid')
    }
  }

  #fileRemoveHandler = (fileName: string) => {
    this.#files = this.#files.filter((item) => item.name !== fileName)
    this.#renderFiles()
  }

  #filesDropHandler = (files: FileList) => {
    this.#files = [...this.#files, ...files].slice(
      -1 * this.#options.uploadLength
    )
    this.#renderFiles()
  }

  #dropZoneClickHandler = () => {
    this.#input.click()
  }
}
