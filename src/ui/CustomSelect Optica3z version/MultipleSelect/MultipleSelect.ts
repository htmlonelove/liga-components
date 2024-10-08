import BaseSelect from '../BaseSelect/BaseSelect'
import { getContext } from 'src/scripts/utils/utils'
import CustomSelect from '../CustomSelect'
import { createElement, renderElement } from 'src/scripts/utils/render'
import { mediaMobile } from 'src/scripts/utils/const'
import { resizeObserver } from 'src/scripts/utils/init-resize-observer'

interface IOptionState {
  selected: boolean
}

export default class MultipleSelect extends BaseSelect {
  protected state = new Map<number, IOptionState>()
  protected applyButton: HTMLElement | null = null

  constructor(parent: HTMLElement) {
    super(parent)
    this.isMultiple = true
    super.createNativeSelect()

    const activeItems = this.listWrapper.querySelectorAll(
      '[data-select-value][aria-selected="true"]'
    )

    if (activeItems.length) {
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

      const activeText = this.createMultiString(activeItems)
      this.parent.classList.add('not-empty')
      this.selectText.innerHTML = this.checkStringLength(
        activeText,
        this.selectText
      )
        ? activeText
        : `Выбрано: ${activeItems.length}`
    }

    resizeObserver.subscribe(this.onResize)
  }

  openSelect(): void {
    CustomSelect.closeAllSelects()
    super.openSelect()

    this.state.clear()
    this.selectItems.forEach((item, index) => {
      this.state.set(index, {
        selected: item.getAttribute('aria-selected') === 'true'
      })
    })

    this.updateApplyBtn()
  }

  resetSelect(): void {
    super.resetSelect()
    this.setButtonText()
  }

  // eslint-disable-next-line no-undef
  protected createMultiString(arr: NodeListOf<Element>): string {
    return [...arr]
      .map((element: HTMLElement) => element.textContent)
      .join(', ')
      .trim()
  }

  private checkStringLength(text: string, container: HTMLElement): boolean {
    const context = getContext()
    const computedStyles = window.getComputedStyle(container)
    context.font = computedStyles.font
      ? computedStyles.font
      : `${computedStyles.fontSize} "${computedStyles.fontFamily}"`
    const maxWidth = computedStyles.width
      ? parseInt(computedStyles.width, 10)
      : container.offsetWidth
    return context.measureText(text).width < maxWidth
  }

  protected onLastSelectItemTab() {
    this.closeSelect()
  }

  protected selectItemHandler(selectItem: HTMLElement): void {
    const isSelected = selectItem.getAttribute('aria-selected') === 'true'
    const index = [...this.selectItems].indexOf(selectItem)
    selectItem.setAttribute('aria-selected', isSelected ? 'false' : 'true')
    this.updateApplyBtn()

    if (!(this.isMobileSliding && mediaMobile.matches)) {
      const options = [...this.parent.querySelectorAll('option')]

      if (!isSelected) {
        options[index + 1].setAttribute('selected', '')
      } else {
        options[index + 1].removeAttribute('selected')
      }

      const activeItems = this.listWrapper.querySelectorAll(
        '[data-select-value][aria-selected="true"] .select-list__item-text'
      )

      this.setButtonText()
      this.toggleEmptyState(activeItems.length > 0)
    }
  }

  protected getButtonText() {
    const activeItems = this.listWrapper.querySelectorAll(
      '[data-select-value][aria-selected="true"] .select-list__item-text'
    )

    const activeText = this.createMultiString(activeItems)
    return this.checkStringLength(activeText, this.selectText)
      ? activeText
      : `Выбрано: ${activeItems.length}`
  }

  protected setButtonText() {
    this.selectText.innerHTML = this.getButtonText()
  }

  private toggleEmptyState(hasValue: boolean) {
    if (hasValue) {
      this.parent.classList.add('not-empty', 'is-valid')
      this.parent.classList.remove('is-invalid')
    } else {
      this.parent.classList.remove('not-empty', 'is-valid')
    }
  }

  protected createMobileSliding() {
    super.createMobileSliding()
    this.createFooter()

    setTimeout(() => {
      this.applyButton = this.listWrapper.querySelector('[data-select-apply]')
      this.applyButton?.addEventListener('click', () => {
        this.applyButtonClickHandler()
      })
    })
  }

  protected destroyMobileSliding(): void {
    super.destroyMobileSliding()
    this.destroyFooter()
    this.applyButton = null
  }

  protected createFooter() {
    renderElement(
      this.listWrapper,
      createElement(
        '<div class="custom-select__list-footer"><button type="button" data-select-apply class="button custom-select__apply-btn"><span class="button__text">Применить</span></button></div>'
      ),
      'beforeend'
    )
  }

  protected destroyFooter() {
    this.listWrapper.querySelector('.custom-select__list-footer')?.remove()
  }

  protected backButtonClickHandler() {
    this.selectItems.forEach((item, index) => {
      item.setAttribute(
        'aria-selected',
        this.state.get(index)?.selected ? 'true' : 'false'
      )
    })
    this.state.clear()

    super.backButtonClickHandler()
  }

  protected applyButtonClickHandler() {
    const options = [...this.parent.querySelectorAll('option')]
    this.selectItems.forEach((item, index) => {
      const isSelected = item.getAttribute('aria-selected') === 'true'
      if (isSelected) {
        options[index + 1].setAttribute('selected', '')
      } else {
        options[index + 1].removeAttribute('selected')
      }
    })

    const activeItems = this.listWrapper.querySelectorAll(
      '[data-select-value][aria-selected="true"]'
    )

    this.setButtonText()
    this.toggleEmptyState(activeItems.length > 0)

    this.closeSelect()
  }

  protected updateApplyBtn() {
    if (this.applyButton) {
      const activeItems = this.listWrapper.querySelectorAll(
        '[data-select-value][aria-selected="true"]'
      )

      const buttonText = this.applyButton.querySelector('.button__text')
      if (activeItems.length > 0) {
        buttonText.innerHTML = `Выбрать (${activeItems.length})`
      } else if (
        [...this.selectItems].some(
          (item, index) =>
            item.getAttribute('aria-selected') !==
            this.state.get(index)?.selected.toString()
        )
      ) {
        buttonText.innerHTML = 'Применить'
      } else {
        buttonText.innerHTML = 'Отмена'
      }
    }
  }

  onResize = () => {
    this.setButtonText()
  }
}
