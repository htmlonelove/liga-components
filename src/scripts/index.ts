import { initModals } from './modules/modals/modals'
import { mobileVhFix } from './utils/mobile-vh-fix'
// import { Accordions } from 'src/ui/Accordion/accordions'

mobileVhFix()
document.addEventListener(
  'DOMContentLoaded',
  () => {
    initModals()

    // let accordions = new Accordions()
    // accordions.init()
  },
  true
)
