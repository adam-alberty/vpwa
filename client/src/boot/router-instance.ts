import { boot } from 'quasar/wrappers'
import type { Router } from 'vue-router'

let routerInstance: Router

export default boot(({ router }) => {
  routerInstance = router
})

export function useRouter() {
  return routerInstance
}
