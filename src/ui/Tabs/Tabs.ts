/* eslint-disable no-undef */
interface Attributes {
  [key: string]: string
}

interface TabElement extends HTMLElement {
  accordionListener?: boolean
}

function initTabs(): void {
  initAllTabs()
  document.addEventListener('click', onClickHandler)
}

const resizeObserver = (function getResizeObserver(): ResizeObserver {
  return new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target.classList.contains('is-active')) {
        updateTabHeight()
      }
    }
  })
})()

function onClickHandler(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (!target.closest('[data-tabs="control"]')) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  const control = target.closest('[data-tabs="control"]') as HTMLElement
  openTab(control)

  const controlsItem = control.closest(
    '[data-tabs="controls-item"]'
  ) as HTMLElement
  const controlsList = control.closest('[data-tabs="controls"]') as HTMLElement
  if (controlsList && controlsItem) {
    const offset = controlsItem.offsetLeft
    controlsList.scrollTo({
      left: offset,
      behavior: 'smooth'
    })
  }
}

function initAllTabs(): void {
  const tabs = document.querySelectorAll('[data-tabs="parent"]')
  const forLoadTabs = document.querySelectorAll(
    '[data-tabs="element"].for-load'
  )
  tabs.forEach((tab: HTMLElement) => {
    initTab(tab)
  })
  forLoadTabs.forEach((tab) => {
    tab.classList.remove('for-load')
  })
}

function removeAllActiveClasses(
  tabControlElements: HTMLElement[],
  tabElements: HTMLElement[]
): void {
  tabElements.forEach((tab) => {
    tab.classList.remove('is-active')
  })

  tabControlElements.forEach((element: HTMLElement, index: number) => {
    element.classList.remove('is-active')
    element.setAttribute('data-index', index.toString())
  })
}

function setTabStartState({
  tab,
  dataHeight,
  tabElements,
  tabContentElement,
  tabControlElements,
  dataDelay
}: {
  tab: HTMLElement
  dataHeight: number | string
  tabElements: HTMLElement[]
  tabContentElement: HTMLElement
  tabControlElements: HTMLElement[]
  dataDelay: number
}): void {
  const activeIndex = returnActiveIndex(tabControlElements)
  const blockHeight =
    dataHeight === 'max'
      ? returnMaxHeight(tabElements)
      : tabElements[activeIndex].offsetHeight
  removeAllActiveClasses(tabControlElements, tabElements)
  tab.classList.add('no-transition')
  tabControlElements[activeIndex].classList.add('is-active')
  tabElements[activeIndex].classList.add('is-active')
  if (dataHeight !== 'unset') {
    tabContentElement.style.height = `${blockHeight}px`
  }
  setTimeout(() => {
    if (dataDelay) {
      tab.classList.remove('no-transition')
    }
  }, dataDelay)
}

function returnActiveIndex(tabControlElements: HTMLElement[]): number {
  let activeIndex = 0
  let flag = true

  tabControlElements.forEach((control, index) => {
    if (control.classList.contains('is-active') && flag) {
      activeIndex = index
      flag = false
    }
  })

  return activeIndex
}

function returnMaxHeight(tabElements: HTMLElement[]): number {
  let height = []
  tabElements.forEach((element) => {
    height.push(element.offsetHeight)
  })
  height.sort((a, b) => a - b)
  return height[height.length - 1]
}

function returnScopeList(
  nodeList: NodeListOf<HTMLElement>,
  parent: HTMLElement
): HTMLElement[] {
  const array = []
  nodeList.forEach((element) => {
    const elementParent = element.closest('[data-tabs="parent"]')
    if (elementParent === parent) {
      array.push(element)
    }
  })

  return array
}

function returnScopeChild(
  nodeList: NodeListOf<HTMLElement>,
  parent: HTMLElement
): HTMLElement {
  let currentChild: HTMLElement
  nodeList.forEach((element) => {
    const elementParent = element.closest('[data-tabs="parent"]')
    if (elementParent === parent) {
      currentChild = element
    }
  })

  return currentChild
}

function updateTabHeight(): void {
  const activeElements = document.querySelectorAll(
    '[data-tabs="element"].is-active'
  )
  activeElements.forEach((element: HTMLElement) => {
    let transition = false
    const parent = element.closest('[data-tabs="parent"]')
    if (parent.closest('[data-tabs="element"]')) {
      transition = true
    }
    setTabElementHeight(element, transition)
  })
}

function setTabElementHeight(element: HTMLElement, transition: boolean): void {
  const parentElement = element.closest('[data-tabs="parent"]') as HTMLElement
  const dataHeight = parentElement.dataset.height
  const contentElement = returnScopeChild(
    parentElement.querySelectorAll('[data-tabs="content"]'),
    parentElement
  )
  const tabElements = returnScopeList(
    parentElement.querySelectorAll('[data-tabs="element"]'),
    parentElement
  )

  if (!transition) {
    parentElement.classList.add('no-transition')
  }

  if (dataHeight === 'max') {
    contentElement.style.height = `${returnMaxHeight(tabElements)}px`
  } else if (dataHeight === 'unset') {
    contentElement.style.height = null
  } else {
    contentElement.style.height = `${
      returnScopeChild(
        parentElement.querySelectorAll('[data-tabs="element"].is-active'),
        parentElement
      ).offsetHeight
    }px`
  }

  setTimeout(() => parentElement.classList.remove('no-transition'))
}

function createDOMElement(
  elementType: string,
  attributes: Attributes
): HTMLElement {
  const element = document.createElement(elementType) as HTMLElement
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      element.setAttribute(key, attributes[key])
    }
  }

  return element
}

function toggleAndRemoveClass(
  element: HTMLElement,
  accordion: HTMLElement
): void {
  accordion.classList.toggle(
    'is-active',
    element.classList.contains('is-active')
  )
  element.classList.remove('is-active')
}

function setAccordionState({
  parent,
  elements,
  controls
}: {
  parent: HTMLElement
  elements: HTMLElement[]
  controls: HTMLElement[]
}): void {
  if (parent.hasAttribute('data-accordion-init')) {
    return
  }
  parent.setAttribute('data-accordion-init', '')

  const controlList = returnScopeChild(
    parent.querySelectorAll('[data-tabs="controls"]'),
    parent
  )
  controlList.innerHTML = ''

  elements.forEach((element: HTMLElement, idx: number) => {
    const accordion = createDOMElement('div', {
      'data-tabs': 'accordion'
    })
    accordion.classList.add('tabs__accordion')
    const accordionWrapper = createDOMElement('div', {
      'data-tabs': 'accordion-wrapper'
    })
    accordionWrapper.classList.add('tabs__accordion-wrapper')
    const accordionContent = createDOMElement('div', {
      'data-tabs': 'accordion-content'
    })
    accordionContent.classList.add('tabs__accordion-content')

    accordion.append(controls[idx], accordionWrapper)
    accordionWrapper.append(accordionContent)
    accordionContent.append(element)

    parent.append(accordion)
    toggleAndRemoveClass(element, accordion)
  })
}

function removeAccordionState({
  parent,
  elements,
  controls
}: {
  parent: HTMLElement
  elements: HTMLElement[]
  controls: HTMLElement[]
}): void {
  if (!parent.hasAttribute('data-accordion-init')) {
    return
  }
  parent.removeAttribute('data-accordion-init')
  const controlList = returnScopeChild(
    parent.querySelectorAll('[data-tabs="controls"]'),
    parent
  )
  const content = returnScopeChild(
    parent.querySelectorAll('[data-tabs="content"]'),
    parent
  )
  const activeAccordions = returnScopeList(
    parent.querySelectorAll('[data-tabs="accordion"].is-active'),
    parent
  )
  const activeControl = activeAccordions.length
    ? activeAccordions[0].querySelector('[data-tabs="control"]')
    : controls[0]
  const activeElement = activeAccordions.length
    ? activeAccordions[0].querySelector('[data-tabs="element"]')
    : elements[0]

  elements.forEach((element: HTMLElement, idx: number) => {
    const accordion = element.closest('[data-tabs="accordion"]') as HTMLElement
    if (!accordion) {
      return
    }
    const listItem = document.createElement('li')
    listItem.classList.add('tabs-controls__item')
    listItem.append(controls[idx])
    controlList.append(listItem)
    content.append(element)
    toggleAndRemoveClass(element, accordion)
    accordion.remove()
  })

  activeControl.classList.add('is-active')
  activeElement.classList.add('is-active')
}

function accordionBreakpointChecker({
  media,
  parent,
  elements,
  controls
}: {
  media: MediaQueryList
  parent: HTMLElement
  elements: HTMLElement[]
  controls: HTMLElement[]
}): void {
  if (media.matches) {
    setAccordionState({ parent, elements, controls })
  } else {
    removeAccordionState({ parent, elements, controls })
  }
}

function initTab(tab: TabElement): void {
  const dataHeight = tab.dataset.height
  const dataDelay = tab.dataset.delay ? parseInt(tab.dataset.delay, 10) : 0
  const tabContentElement = tab.querySelector(
    '[data-tabs="content"]'
  ) as HTMLElement
  const tabControlElements = returnScopeList(
    tab.querySelectorAll('[data-tabs="control"]'),
    tab
  )
  const tabElements = returnScopeList(
    tab.querySelectorAll('[data-tabs="element"]'),
    tab
  )

  const accordionMedia = tab.getAttribute('data-accordion-media')
    ? window.matchMedia(tab.getAttribute('data-accordion-media'))
    : null

  setTabStartState({
    tab,
    dataHeight,
    tabElements,
    tabContentElement,
    tabControlElements,
    dataDelay
  })

  if (accordionMedia && !tab.accordionListener) {
    accordionBreakpointChecker({
      media: accordionMedia,
      parent: tab,
      elements: tabElements,
      controls: tabControlElements
    })
    accordionMedia.addEventListener('change', () => {
      accordionBreakpointChecker({
        media: accordionMedia,
        parent: tab,
        elements: tabElements,
        controls: tabControlElements
      })
    })
    tab.accordionListener = true
  }

  if (dataHeight !== 'unset') {
    tabElements.forEach((element) => {
      resizeObserver.observe(element)
    })
  }

  setTimeout(() => {
    tab.classList.remove('no-transition-global')
  }, 10)
}

function reInit() {
  initAllTabs()
}

function toggleAccordion(accordion: HTMLElement): void {
  if (accordion.classList.contains('is-active')) {
    closeAccordion(accordion)
  } else {
    openAccordion(accordion)
  }
}

function openAccordion(accordion: HTMLElement): void {
  const parentElement = accordion.closest(
    '[data-accordion-init]'
  ) as HTMLElement
  const accordionWrapper = accordion.querySelector(
    '[data-tabs="accordion-wrapper"]'
  ) as HTMLElement

  accordionWrapper.style.maxHeight = `${accordionWrapper.offsetHeight}px`

  if (parentElement.hasAttribute('data-single')) {
    closeAllAccordion(parentElement)
  }

  accordion.classList.add('is-active')

  const control = accordion.querySelector(
    '[data-tabs="control"]'
  ) as HTMLElement
  control.classList.add('is-active')

  setTimeout(() => {
    accordionWrapper.style.maxHeight = `${accordionWrapper.scrollHeight}px`
    accordionWrapper.addEventListener(
      'transitionend',
      () => {
        accordionWrapper.style.maxHeight = null
      },
      { once: true }
    )
  }, 0)
}

function closeAllAccordion(parent: HTMLElement): void {
  const elements = parent.querySelectorAll('[data-tabs="accordion"]')
  elements.forEach((element: HTMLElement) => {
    const currentParent = element.closest(
      '[data-accordion-init]'
    ) as HTMLElement
    if (currentParent === parent && element.classList.contains('is-active')) {
      closeAccordion(element)
    }
  })
}

function closeAccordion(accordion: HTMLElement): void {
  const accordionWrapper = accordion.querySelector(
    '[data-tabs="accordion-wrapper"]'
  ) as HTMLElement
  accordion.classList.remove('is-active')
  accordionWrapper.style.transition = 'none'
  accordionWrapper.style.maxHeight = `${accordionWrapper.scrollHeight}px`

  const control = accordion.querySelector(
    '[data-tabs="control"]'
  ) as HTMLElement
  control.classList.remove('is-active')

  setTimeout(() => {
    accordionWrapper.style.transition = null
    accordionWrapper.style.maxHeight = '0px'
    accordionWrapper.addEventListener(
      'transitionend',
      () => {
        accordionWrapper.style.maxHeight = null
      },
      { once: true }
    )
  }, 0)
}

function openTab(control: HTMLElement): void {
  const currentIndex = control.dataset.index
  const parentElement = control.closest('[data-tabs="parent"]') as HTMLElement
  const accordion = control.closest('[data-tabs="accordion"]') as HTMLElement

  if (
    accordion &&
    accordion.closest('[data-tabs="parent"]') === parentElement
  ) {
    toggleAccordion(accordion)
    const focusedElement = document.activeElement as HTMLElement
    focusedElement.blur()
    return
  }

  if (
    control.classList.contains('is-active') ||
    parentElement.classList.contains('no-action')
  ) {
    return
  }

  const dataDelay = parentElement.dataset.delay
    ? parseInt(parentElement.dataset.delay, 10)
    : 0
  const dataHeight = parentElement.dataset.height
  const contentElement = parentElement.querySelector(
    '[data-tabs="content"]'
  ) as HTMLElement
  const tabElements = returnScopeList(
    parentElement.querySelectorAll('[data-tabs="element"]'),
    parentElement
  )

  const activeControl = returnScopeChild(
    parentElement.querySelectorAll('[data-tabs="control"].is-active'),
    parentElement
  )
  const activeElement = returnScopeChild(
    parentElement.querySelectorAll('[data-tabs="element"].is-active'),
    parentElement
  )
  const currentHeight = contentElement.offsetHeight
  const newHeight = tabElements[currentIndex].offsetHeight

  parentElement.classList.add('no-action')
  const focusedElement = document.activeElement as HTMLElement
  focusedElement.blur()

  if (activeControl) {
    activeControl.classList.remove('is-active')
  }

  if (activeElement) {
    activeElement.classList.remove('is-active')
  }

  if (currentHeight > newHeight) {
    setTimeout(() => {
      if (dataHeight !== 'max' && dataHeight !== 'unset') {
        contentElement.style.height = newHeight + 'px'
      }
      control.classList.add('is-active')
      tabElements[currentIndex].classList.add('is-active')
      parentElement.classList.remove('no-action')
    }, dataDelay)
  } else {
    if (dataHeight !== 'max' && dataHeight !== 'unset') {
      contentElement.style.height = newHeight + 'px'
    }
    setTimeout(() => {
      control.classList.add('is-active')
      tabElements[currentIndex].classList.add('is-active')
      parentElement.classList.remove('no-action')
    }, dataDelay)
  }
}

window.initTabs = initTabs
window.reInitTabs = reInit

export { initTabs, reInit }
