import { withInstall } from './utils'
import _SecureAction from './SecureAction.vue'
export * from './props'
export * from './hooks/useBehavioralCaptcha'
export type SecureActionInstance = InstanceType<typeof _SecureAction>

export const SecureAction = withInstall(_SecureAction, 'SecureAction')
