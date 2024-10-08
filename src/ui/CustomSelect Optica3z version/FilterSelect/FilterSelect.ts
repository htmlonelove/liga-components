import MultipleSelect from '../MultipleSelect/MultipleSelect'
import { mediaMobile, mediaDesktop } from 'src/scripts/utils/const'
import { createElement, renderElement } from 'src/scripts/utils/render'

export default class FilterSelect extends MultipleSelect {
  constructor(parent: HTMLElement) {
    super(parent)
    this.setButtonText()
    this.closeSelect()

    mediaMobile.addEventListener('change', this.mediaChangeHandler)
  }

  handleCloseSelect(): void {}

  protected setButtonText() {
    this.selectText.innerHTML = mediaMobile.matches
      ? super.getButtonText()
      : this.label.textContent
  }

  private mediaChangeHandler = () => {
    this.setButtonText()

    this.listWrapper.style.maxHeight = mediaMobile.matches ? null : '0px'
  }

  openSelect() {
    super.openSelect()

    if (mediaDesktop.matches) {
      const selectListHeight = this.listWrapper.scrollHeight
      this.listWrapper.style.maxHeight = `${selectListHeight}px`
      return
    }
  }

  protected initDocumentEvents(): void {}

  closeSelect() {
    super.closeSelect()

    if (mediaDesktop.matches) {
      this.listWrapper.style.maxHeight = '0px'
    }
  }

  protected createFooter() {
    renderElement(
      this.listWrapper,
      createElement(
        '<div class="custom-select__list-footer"><button type="submit" data-select-apply class="button custom-select__apply-btn"><span class="button__text">Применить</span></button></div>'
      ),
      'beforeend'
    )
  }

  protected updateApplyBtn() {
    if (this.applyButton) {
      this.applyButton['disabled'] = ![...this.selectItems].some(
        (item, index) =>
          item.getAttribute('aria-selected') !==
          this.state.get(index)?.selected.toString()
      )
    }
  }
}
