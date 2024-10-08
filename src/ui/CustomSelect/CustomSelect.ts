import { createElement, renderElement } from 'src/scripts/utils/render'

interface IItemInfo {
  text: string
  value: string
}

interface IOptions {
  items: IItemInfo[]
  activeIndexes?: number[]
  name: string | boolean
  id: string | boolean
  required: boolean
  multiple: boolean
  insert?: boolean
}

let activeIndex: number[] | null = []

function initCustomSelect() {
  document.querySelectorAll('[data-select]').forEach((select: HTMLElement) => {
    createSelectStructure(select)
    setSelectAction(select)
  })
}

// eslint-disable-next-line no-undef
function createMultiString(arr: NodeListOf<Element>): string {
  return [...arr].map((element: HTMLElement) => element.innerText).join(', ')
}

function setSelectActiveState(
  selectContainer: HTMLElement,
  isMultiple: boolean,
  isInsert: boolean
): void {
  const buttonTextBlock = selectContainer.querySelector(
    '[data-select-text]'
  ) as HTMLElement
  const activeItems = selectContainer.querySelectorAll(
    '[data-select-value][aria-selected="true"]'
  )
  const label = selectContainer.querySelector(
    '[data-select-label]'
  ) as HTMLElement
  const activeText = createMultiString(activeItems)

  buttonTextBlock.style.transition = '0s'
  if (label) {
    label.style.transition = '0s'
  }

  setTimeout(() => {
    if (label) {
      label.style.transition = null
    }
    buttonTextBlock.style.transition = null
  }, 300)

  if (isMultiple && isInsert) {
    selectContainer.classList.add('not-empty')
    buttonTextBlock.innerHTML = activeText
  } else if (!isMultiple) {
    selectContainer.classList.add('not-empty')
    buttonTextBlock.innerHTML = activeItems[0].innerHTML
  }
}

function closeSelect(): void {
  const activeSelect = document.querySelector('[data-select].is-open')
  activeSelect?.classList.remove('is-open')

  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onEscapePress)
}

function openSelect(selectContainer: HTMLElement): void {
  selectContainer.classList.add('is-open')

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onEscapePress)
}

function handleSelectOptionClick(element: HTMLElement, index: number): void {
  const parentSelect = element.closest('[data-select]') as HTMLElement
  const multiple = parentSelect.hasAttribute('data-multiple')
  const insert = parentSelect.hasAttribute('data-insert')
  const options = [...parentSelect.querySelectorAll('option')]

  const parentMessage = parentSelect.querySelector('.input-message')
  if (parentMessage) {
    parentMessage.remove()
  }

  if (multiple) {
    toggleMultipleSelection({
      parent: parentSelect,
      element,
      index,
      isInsert: insert,
      options
    })
  } else {
    setSingleSelection({ parent: parentSelect, element, index, options })
    closeSelect()
  }

  triggerChangeEvent(parentSelect.querySelector('select'))
}

function toggleMultipleSelection({
  parent,
  element,
  index,
  isInsert,
  options
}: {
  parent: HTMLElement
  element: HTMLElement
  index: number
  isInsert: boolean
  options: HTMLOptionElement[]
}) {
  const buttonTextBlock = parent.querySelector(
    '[data-select-text]'
  ) as HTMLElement

  const isSelected = element.getAttribute('aria-selected') === 'true'
  element.setAttribute('aria-selected', isSelected ? 'false' : 'true')
  if (!isSelected) {
    options[index + 1].setAttribute('selected', '')
  } else {
    options[index + 1].removeAttribute('selected')
  }

  if (isInsert) {
    const activeItems = parent.querySelectorAll(
      '[data-select-value][aria-selected="true"]'
    )
    const activeText = createMultiString(activeItems)
    buttonTextBlock.innerHTML = activeText
    toggleEmptyState(parent, activeText.length > 0)
  }
}

function toggleEmptyState(parent: HTMLElement, hasValue: boolean) {
  if (hasValue) {
    parent.classList.add('not-empty', 'is-valid')
  } else {
    parent.classList.remove('not-empty', 'is-valid')
  }
}

function setSingleSelection({
  parent,
  element,
  index,
  options
}: {
  parent: HTMLElement
  element: HTMLElement
  index: number
  options: HTMLOptionElement[]
}) {
  const buttonTextBlock = parent.querySelector(
    '[data-select-text]'
  ) as HTMLElement
  const activeItem = parent.querySelector(
    '[data-select-value][aria-selected="true"]'
  )
  const selectedOption = parent.querySelector('option[selected]')

  activeItem?.setAttribute('aria-selected', 'false')
  element.setAttribute('aria-selected', 'true')
  buttonTextBlock.innerHTML = element.innerText
  options[index + 1].setAttribute('selected', '')
  selectedOption?.removeAttribute('selected')

  parent.classList.add('not-empty', 'is-valid')
}

function triggerChangeEvent(select: HTMLSelectElement | null) {
  if (!select) return

  const changeEvent = new Event('change')
  const inputEvent = new Event('input')
  select.dispatchEvent(changeEvent)
  select.dispatchEvent(inputEvent)
}

function onDocumentClick(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('[data-select]')) closeSelect()
}

function onEscapePress(evt: KeyboardEvent) {
  if (evt.key === 'Escape') closeSelect()
}

function onSelectItemClick(element: HTMLElement, index: number): void {
  handleSelectOptionClick(element, index)
}

function onSelectItemKeydown(
  evt: KeyboardEvent,
  element: HTMLElement,
  index: number
): void {
  const isEnter = evt.key === 'Enter'
  if (isEnter) {
    handleSelectOptionClick(element, index)
  }
}

function onLastItemKeydown(evt: KeyboardEvent): void {
  const isTab = evt.key === 'Tab'
  if (isTab) {
    closeSelect()
  }
}

function onSelectClick(evt: MouseEvent): void {
  const select = (evt.target as HTMLElement).closest(
    '[data-select]'
  ) as HTMLElement

  select.classList.remove('is-invalid')

  if (select.classList.contains('is-open')) {
    closeSelect()
    return
  }

  openSelect(select)
}

function onSelectKeydown(evt: KeyboardEvent): void {
  const select = (evt.target as HTMLElement).closest(
    '[data-select]'
  ) as HTMLElement
  select.classList.remove('is-invalid')

  if (evt.shiftKey && evt.key === 'Tab' && select.closest('.is-open')) {
    closeSelect()
  }
}

function setActiveSelectItemsState(
  multiple: boolean,
  // eslint-disable-next-line no-undef
  selectItems: NodeListOf<Element>
): void {
  let flag = true
  activeIndex = []
  selectItems.forEach((item: HTMLElement, index: number) => {
    if (multiple) {
      if (item.getAttribute('aria-selected') === 'true') {
        activeIndex.push(index)
      }
    } else {
      if (item.getAttribute('aria-selected') === 'true' && flag) {
        activeIndex.push(index)
        flag = false
      } else {
        item.setAttribute('aria-selected', 'false')
      }
    }
  })
}

function createSelectStructure(select: HTMLElement): void {
  if (select.querySelector('select')) return

  let options: IOptions = {
    items: [],
    activeIndexes: [],
    name: select.dataset.name || '',
    id: select.dataset.id || '',
    required: select.hasAttribute('data-required'),
    multiple: select.hasAttribute('data-multiple'),
    insert: select.hasAttribute('data-insert')
  }

  const selectItems = select.querySelectorAll('[data-select-value]')
  setActiveSelectItemsState(options.multiple, selectItems)

  if (activeIndex.length) {
    options.activeIndexes = activeIndex
    setSelectActiveState(select, options.multiple, options.insert)
  }

  selectItems.forEach((selectItem: HTMLElement) => {
    const itemInfo: IItemInfo = {
      text: selectItem.textContent || '',
      value: selectItem.dataset.selectValue || ''
    }
    options.items.push(itemInfo)
  })

  renderElement(select, createElement(createNativeSelectMarkup(options)))

  activeIndex.length = 0
}

function setSelectAction(item: HTMLElement): void {
  if (!item) {
    return
  }
  const button = item.querySelector('[data-select-btn]')
  const selectItems = item.querySelectorAll('[data-select-value]')

  button.addEventListener('click', onSelectClick)
  button.addEventListener('keydown', onSelectKeydown)

  selectItems.forEach((element: HTMLElement, index: number) => {
    element.addEventListener('click', () => {
      onSelectItemClick(element, index)
    })

    element.addEventListener('keydown', (evt) => {
      onSelectItemKeydown(evt, element, index)
    })

    if (index === selectItems.length - 1) {
      element.addEventListener('keydown', onLastItemKeydown)
    }
  })
}

function createNativeSelectMarkup({
  id,
  name,
  multiple,
  required,
  items,
  activeIndexes = []
}: IOptions): string {
  return `<select ${id ? `id="${id}"` : ''} ${name ? `name="${name}"` : ''} ${
    multiple ? 'multiple' : ''
  } ${required ? 'required' : ''} tabindex="-1" aria-hidden="true">
      <option value=""></option>
      ${items
    .map(
      (item, index) => `
        <option value="${item.value}" ${
  activeIndexes.includes(index) ? 'selected' : ''
}>${item.text}</option>
      `
    )
    .join('\n')}
    </select>`
}

window.initCustomSelect = initCustomSelect

export { initCustomSelect }
