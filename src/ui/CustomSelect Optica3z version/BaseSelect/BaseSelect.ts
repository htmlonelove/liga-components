import { createElement, renderElement } from 'src/scripts/utils/render'
import { mediaMobile } from 'src/scripts/utils/const'
import { enablePageScroll, disablePageScroll } from 'scroll-lock'

export default abstract class BaseSelect {
  protected parent: HTMLElement | null = null
  // eslint-disable-next-line no-undef
  protected selectItems: NodeListOf<HTMLElement> | null = null
  protected button: HTMLElement | null
  protected selectText: HTMLElement | null
  protected selectList: HTMLElement | null
  protected label: HTMLElement | null
  protected listWrapper: HTMLElement | null
  private isOpen: boolean = false
  protected isMultiple: boolean = false
  private isRequired: boolean = false
  protected isMobileSliding: boolean = false
  protected isMobileSlided: boolean = false
  private pageScrollDisabled: boolean = false

  constructor(parent: HTMLElement) {
    this.parent = parent
    this.button = this.parent.querySelector('[data-select-btn]')
    this.listWrapper = this.parent.querySelector('.custom-select__list-wrapper')
    this.selectText = this.parent.querySelector('[data-select-text]')
    this.selectItems = this.listWrapper.querySelectorAll('[data-select-value]')
    this.selectList = this.parent.querySelector('.select-list')
    this.label = this.parent.querySelector('[data-select-label]')
    this.isRequired = this.parent.hasAttribute('data-required')
    this.isMobileSliding = this.parent.hasAttribute('data-slide-mobile')

    this.button.addEventListener('click', this.buttonClickHandler)
    this.button.addEventListener('keydown', this.buttonKeydownHandler)
    this.selectList.addEventListener('click', this.selectListClickHandler)
    this.selectList.addEventListener('keydown', this.selectListKeyboardHandler)

    this.initDocumentEvents()

    if (this.isMobileSliding) {
      this.initMobileSliding()
    }
  }

  openSelect() {
    if (this.isOpen) {
      return
    }

    this.parent.classList.add('is-open')
    this.listWrapper.classList.add('is-open')
    this.isOpen = true

    if (mediaMobile.matches && this.isMobileSliding) {
      disablePageScroll()
      this.pageScrollDisabled = true
    }
  }

  closeSelect() {
    if (!this.isOpen) {
      return
    }

    this.parent.classList.remove('is-open')
    this.listWrapper.classList.remove('is-open')
    this.isOpen = false

    if (this.pageScrollDisabled) {
      enablePageScroll()
      this.pageScrollDisabled = false
    }
  }

  handleCloseSelect() {
    if (!(this.isMobileSliding && mediaMobile.matches)) {
      this.closeSelect()
    }
  }

  resetSelect() {
    this.parent.classList.remove('not-empty', 'is-valid', 'is-invalid')
    this.selectItems.forEach((item: HTMLElement) => {
      item.setAttribute('aria-selected', 'false')
    })

    const options = this.parent.querySelectorAll('option')
    options.forEach((option) => {
      option.removeAttribute('selected')
    })
  }

  protected initDocumentEvents() {
    document.addEventListener('click', this.documentClickHandler)
    this.parent.addEventListener('keydown', this.selectKeydownHandler)
  }

  protected documentClickHandler = (event: MouseEvent) => {
    if (this.isMobileSliding && mediaMobile.matches) {
      return
    }

    const target = event.target as HTMLElement
    if (!target.closest('[data-select]')) this.closeSelect()
  }

  protected selectKeydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.closeSelect()
  }

  protected buttonClickHandler = () => {
    if (this.isOpen) {
      this.closeSelect()
    } else {
      this.openSelect()
    }
  }

  protected buttonKeydownHandler = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key === 'Tab' && this.isOpen) {
      this.closeSelect()
    }
  }

  private selectListClickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const selectItem = target.closest('[data-select-value]') as HTMLElement
    if (selectItem) {
      this.selectItemHandler(selectItem)
    }
  }

  private selectListKeyboardHandler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const selectItem = target.closest('[data-select-value]') as HTMLElement
    if (selectItem && event.key === 'Enter') {
      this.selectItemHandler(selectItem)
    }

    const lastSelectItem = this.selectItems[this.selectItems.length - 1]
    if (event.key === 'Tab' && this.isOpen && lastSelectItem === selectItem) {
      this.onLastSelectItemTab()
    }
  }

  // eslint-disable-next-line no-unused-vars
  protected selectItemHandler(selectItem: HTMLElement) {
    const parentMessage = this.parent.querySelector('.input-message')
    if (parentMessage) {
      parentMessage.remove()
    }

    this.parent.classList.remove('is-invalid')

    this.parent.dispatchEvent(new Event('change'))
    this.parent.dispatchEvent(new Event('input'))
  }

  protected onLastSelectItemTab() {}

  protected createNativeSelect() {
    if (this.parent.querySelector('select')) {
      return
    }

    renderElement(
      this.parent,
      createElement(
        this.createNativeSelectMarkup(
          this.parent.dataset.id || '',
          this.parent.dataset.name || ''
        )
      )
    )
  }

  private createNativeSelectMarkup(id: string, name: string): string {
    return `<select ${id ? `id="${id}"` : ''} ${name ? `name="${name}"` : ''} ${
      this.isMultiple ? 'multiple' : ''
    } ${this.isRequired ? 'required' : ''} tabindex="-1" aria-hidden="true">
        <option value="" label="empty"></option>
        ${[...this.selectItems]
    .map(
      (item) => `
          <option value="${item.dataset.selectValue || ''}" ${
  item.getAttribute('aria-selected') === 'true' ? 'selected' : ''
}>${item.textContent}</option>`
    )
    .join('\n')}
      </select>`
  }

  protected initMobileSliding() {
    this.updateMobileSliding()
    mediaMobile.addEventListener('change', this.updateMobileSliding)
  }

  protected updateMobileSliding = () => {
    if (mediaMobile.matches) {
      this.createMobileSliding()
    } else {
      this.destroyMobileSliding()
    }
    this.closeSelect()
  }

  protected createMobileSliding() {
    if (this.isMobileSlided) {
      return
    }

    let listContainer = this.getListContainer()
    renderElement(listContainer, this.listWrapper)

    this.createHeading()

    const backBtn = this.listWrapper.querySelector('[data-select-close]')
    backBtn?.addEventListener('click', () => {
      this.backButtonClickHandler()
    })

    this.isMobileSlided = true
  }

  protected destroyMobileSliding() {
    if (!this.isMobileSlided) {
      return
    }

    renderElement(this.parent, this.listWrapper)
    this.destroyHeading()

    this.isMobileSlided = false
  }

  protected getListContainer(): HTMLElement {
    let listContainer = document.querySelector(
      '.custom-select-container'
    ) as HTMLElement
    if (!listContainer) {
      listContainer = createElement(
        '<div class="custom-select-container"></div>'
      )
      renderElement(document.body.querySelector('main'), listContainer)
    }

    return listContainer
  }

  protected createHeading() {
    const text = this.label?.textContent.replace(/\*/g, '')
    renderElement(
      this.listWrapper,
      createElement(
        `<div class="custom-select__list-heading"><button type="button" data-select-close class="button button--simple button--extra-big custom-select__back"><span class="button__icon"><img src="/images/arrow-left-2.svg" width="32" height="32" alt=""></span><span class="button__text">${text}</span></button></div>`
      ),
      'prepend'
    )
  }

  protected destroyHeading() {
    this.listWrapper.querySelector('.custom-select__list-heading')?.remove()
  }

  protected backButtonClickHandler() {
    this.closeSelect()
  }
}
