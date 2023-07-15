import { SecureAction } from './src/index'
import type { App } from 'vue'
import './src/assets/secure-action.less'
export * from './src'
export default {
  install: (app: App) => {
    app.component(SecureAction.name, SecureAction)
  }
}
