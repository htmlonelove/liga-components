import UploadFile from '../UploadFile'
import UploadFilePreview from '../UploadFilePreview/UploadFilePreview'
import type { IUploadOptions } from '../UploadFile.d'

export default class UploadFileDrop {
  #uploadFile: UploadFile
  #dropZone: HTMLElement
  #filePreview: UploadFilePreview

  constructor(parent: UploadFile) {
    this.#uploadFile = parent

    this.#dropZone = this.#uploadFile.querySelector(
      '[data-drop-zone]'
    ) as HTMLElement

    if (this.#dropZone) {
      this.#filePreview = new UploadFilePreview(
        this.#uploadFile,
        this.#dropZone
      )
      this.#dropZone.addEventListener('click', this.#onClickHandler)
      this.#dropZone.addEventListener('dragover', this.#onDragoverHandler)
      this.#dropZone.addEventListener('dragenter', this.#onDragenterHandler)
      this.#dropZone.addEventListener('dragleave', this.#onDragleaveHandler)
      this.#dropZone.addEventListener('drop', this.#onDropHandler)
    }
  }

  #onClickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.dataset.fileName || target.closest('.input-upload__preview')) {
      return
    }

    const clickEvent = new Event('dropzoneclick')
    this.#uploadFile.dispatchEvent(clickEvent)
  }

  #onDragoverHandler = (event: DragEvent) => {
    event.preventDefault()
    this.#dropZone.classList.add('is-drag')
  }

  #onDragenterHandler = (event: DragEvent) => {
    event.preventDefault()
    this.#dropZone.classList.remove('is-drag')
  }

  #onDragleaveHandler = (event: DragEvent) => {
    event.preventDefault()
    this.#dropZone.classList.remove('is-drag')
  }

  #onDropHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    this.#dropZone.classList.remove('is-drag')

    const droppedFiles = event.dataTransfer?.files
    if (!droppedFiles.length) {
      return
    }

    const addFilesEvent = new CustomEvent('filesdroped', {
      detail: { files: droppedFiles }
    })
    this.#uploadFile.dispatchEvent(addFilesEvent)
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
    this.#filePreview.renderFile({ file, options, error })
  }

  reset() {
    this.#filePreview.reset()
  }
}
