import BaseSelect from '../BaseSelect/BaseSelect'
import CustomSelect from '../CustomSelect'

export default class SingleSelect extends BaseSelect {
  constructor(parent: HTMLElement) {
    super(parent)
    super.createNativeSelect()

    const activeItem = this.listWrapper.querySelector(
      '[data-select-value][aria-selected="true"]'
    )

    if (activeItem) {
      this.selectText.style.transition = '0s'
      if (this.label) {
        this.label.style.transition = '0s'
      }

      setTimeout(() => {
        if (this.label) {
          this.label.style.transition = null
        }
        this.selectText.style.transition = null
      }, 300)

      this.parent.classList.add('not-empty')
      this.selectText.innerHTML = activeItem.textContent
    }
  }

  openSelect(): void {
    CustomSelect.closeAllSelects()
    super.openSelect()
  }

  protected onLastSelectItemTab() {
    this.closeSelect()
  }

  protected selectItemHandler(selectItem: HTMLElement): void {
    super.selectItemHandler(selectItem)

    const selectedOption = this.parent.querySelector('option[selected]')
    const activeItem = this.listWrapper.querySelector(
      '[data-select-value][aria-selected="true"]'
    )
    const options = [...this.parent.querySelectorAll('option')]
    const index = [...this.selectItems].indexOf(selectItem)

    activeItem?.setAttribute('aria-selected', 'false')
    selectItem.setAttribute('aria-selected', 'true')
    this.selectText.innerHTML = selectItem.innerText
    options[index + 1].setAttribute('selected', '')
    selectedOption?.removeAttribute('selected')

    this.parent.classList.add('not-empty', 'is-valid')
    this.closeSelect()
  }
}
