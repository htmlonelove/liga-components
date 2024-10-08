import { resizeObserver } from 'src/scripts/utils/observers'
import { debounce, type DebounceCallback } from 'src/scripts/utils/debounce'

let windowWidth = window.innerWidth

function initAccordions(): void {
  document.addEventListener('click', onClickHandler)
  resizeObserver.subscribe(() => debounce(onResizeHandler, 50))
  fullUpdate()
}

function onClickHandler(event: MouseEvent): void {
  const target = event.target as HTMLElement

  if (!target.closest('[data-accordion="button"]')) {
    return
  }

  event.preventDefault()
  const parent = target.closest('[data-accordion="parent"]') as HTMLElement

  if (
    parent.dataset.destroy &&
    !window.matchMedia(parent.dataset.destroy).matches
  ) {
    return
  }

  const element = target.closest('[data-accordion="element"]') as HTMLElement
  if (element.classList.contains('is-active')) {
    closeAccordion(element)
    return
  }

  openAccordion(element)
}

function onResizeHandler(): DebounceCallback {
  if (windowWidth === window.innerWidth) {
    return
  }

  windowWidth = window.innerWidth
  updateAccordionsHeight()
}

onResizeHandler.timerId = null

function fullUpdate(
  parent: HTMLElement = null,
  transition: boolean = false
): void {
  // eslint-disable-next-line no-undef
  let activeElements: NodeListOf<HTMLElement> = (
    parent ?? document
  ).querySelectorAll('[data-accordion="element"].is-active')

  activeElements.forEach((element) => {
    const innerParent = element.querySelector('[data-accordion="parent"]')
    if (innerParent) {
      return
    }
    openAccordion(element, transition)
  })

  updateAccordionsHeight()
}

function openAccordion(
  element: HTMLElement,
  transition: boolean = true,
  childHeight: number = 0
): void {
  const parentElement = element.closest(
    '[data-accordion="parent"]'
  ) as HTMLElement
  const contentElement = element.querySelector(
    '[data-accordion="content"]'
  ) as HTMLElement
  const openHeight = contentElement.scrollHeight + childHeight

  if (parentElement.hasAttribute('data-single')) {
    closeAllAccordions(parentElement)
  }

  element.classList.add('is-active')
  contentElement.style.maxHeight = `${openHeight}px`
  if (!transition) {
    contentElement.style.transition = 'none'
    setTimeout(() => {
      contentElement.style.transition = null
    }, 10)
  }

  const topLevelElement = parentElement.closest(
    '[data-accordion="element"]'
  ) as HTMLElement
  if (topLevelElement) {
    openAccordion(topLevelElement, transition, openHeight)
    return
  }
}

function closeAccordion(
  element: HTMLElement,
  transition: boolean = true
): void {
  const contentElement = element.querySelector(
    '[data-accordion="content"]'
  ) as HTMLElement
  if (!contentElement) {
    return
  }
  element.classList.remove('is-active')
  contentElement.style.maxHeight = '0'

  if (!transition) {
    contentElement.style.transition = 'none'
    setTimeout(() => {
      contentElement.style.transition = null
    }, 10)
  }
}

function closeAllAccordions(parent: HTMLElement): void {
  const elements = parent.querySelectorAll('[data-accordion="element"]')
  elements.forEach((element: HTMLElement) => {
    const currentParent = element.closest('[data-accordion="parent"]')
    if (currentParent === parent) {
      closeAccordion(element)
    }
  })
}

function updateAccordionsHeight(element: HTMLElement = null): void {
  if (element) {
    const content = element.querySelector(
      '[data-accordion="content"]'
    ) as HTMLElement
    content.style.transition = 'none'
    content.style.maxHeight = `${content.scrollHeight}px`
    setTimeout(() => {
      content.style.transition = null
    }, 10)
    return
  }

  const closedElements = document.querySelectorAll(
    '[data-accordion="element"]:not(.is-active)'
  )

  closedElements.forEach((closedElement: HTMLElement) => {
    const parent = closedElement.closest(
      '[data-accordion="parent"]'
    ) as HTMLElement
    const content = closedElement.querySelector(
      '[data-accordion="content"]'
    ) as HTMLElement
    if (
      parent.dataset.destroy &&
      !window.matchMedia(parent.dataset.destroy).matches
    ) {
      content.style.maxHeight = '100%'
      return
    }
    content.style.maxHeight = null
  })

  const activeElements = document.querySelectorAll(
    '[data-accordion="element"].is-active'
  )
  activeElements.forEach((activeElement) => {
    const content = activeElement.querySelector(
      '[data-accordion="content"]'
    ) as HTMLElement
    const parent = activeElement.closest(
      '[data-accordion="parent"]'
    ) as HTMLElement
    if (
      parent.dataset.destroy &&
      !window.matchMedia(parent.dataset.destroy).matches
    ) {
      content.style.maxHeight = '100%'
      return
    }
    content.style.transition = 'none'
    content.style.maxHeight = `${content.scrollHeight}px`
    setTimeout(() => {
      content.style.transition = null
    })

    const topLevelElement = parent.closest(
      '[data-accordion="element"]'
    ) as HTMLElement
    if (topLevelElement) {
      setTimeout(() => {
        openAccordion(topLevelElement, false)
      }, 0)
    }
  })
}

window.initAccordions = initAccordions

export { initAccordions }
