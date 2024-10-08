class EventObserver {
  constructor() {
    this.observers = []
  }

  subscribe(fn) {
    this.observers.push(fn)
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn)
  }

  fire(data) {
    this.observers.forEach((subscriber) => subscriber(data))
  }
}

const resizeObserver = new EventObserver()
const resizeObserverProto = new ResizeObserver(() =>
  setTimeout(() => resizeObserver.fire('resize'), 10)
)
resizeObserverProto.observe(document.documentElement)

export { resizeObserver }
