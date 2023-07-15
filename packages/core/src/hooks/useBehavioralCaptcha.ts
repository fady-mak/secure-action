import { SecureActionInstance } from '../index'
import { type Ref } from 'vue'
/**
 * useBehavioralCaptcha
 * 在 withInterceptor 方法中， 先执行一个 验证方法，成功后再执行 fn 方法。
 * @param fn 需要执行的方法
 * @returns
 */
export function useBehavioralCaptcha(
  instance: Ref<SecureActionInstance | undefined>,
  fn: Function
) {
  async function withInterceptor() {
    // 成功后才执行 handleSignIn
    const result = await instance.value?.verify()
    if (result) await fn()
  }

  return { withInterceptor }
}
