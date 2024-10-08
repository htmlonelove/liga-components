// import gsap from 'gsap'

export class EventObserver {
  #observers: Array<Function> = []

  constructor() {
    this.#observers = []
  }

  subscribe(fn: Function): void {
    this.#observers.push(fn)
  }

  unsubscribe(fn: Function): void {
    this.#observers = this.#observers.filter(
      (subscriber: Function) => subscriber !== fn
    )
  }

  fire(data: any): void {
    this.#observers.forEach((subscriber) => subscriber(data))
  }
}

const resizeObserver = new EventObserver()
const resizeObserverProto = new ResizeObserver(() =>
  setTimeout(() => resizeObserver.fire('resize'), 10)
)
resizeObserverProto.observe(document.documentElement)

export { resizeObserver }

// let scrollObserver
// export const initScrollObserver = () => {
//   scrollObserver = new EventObserver()
//   gsap.timeline({
//     scrollTrigger: {
//       trigger: '[data-scroll-container]',
//       scroller: '[data-scroll-container]',
//       start: 'top',
//       end: 'bottom',
//       scrub: true,
//       onUpdate: (self) => {
//         scrollObserver.fire(self)
//       }
//     }
//   })
// }
// // инициализирует обсервер скролла. работает с локо и тачем
// // везде следует использовать его прим: scrollObserver.subscribe(() => {console.log('asd')})
// export { scrollObserver }
