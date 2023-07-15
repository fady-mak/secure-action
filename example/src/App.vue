<template>
  <SecureAction
    ref="secureActionRef"
    :request="behavioralCaptcha"
    :verify="handleVerify"
  ></SecureAction>
  <button @click="withInterceptor">登录</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SecureAction,
  useBehavioralCaptcha,
  type SecureActionInstance,
  type VerifyOptions,
  type RequestFnOptions
} from '../../packages/core'

const secureActionRef = ref<SecureActionInstance>()

const handleSignIn = () => {
  console.log('触发登录')
}

const { withInterceptor } = useBehavioralCaptcha(secureActionRef, handleSignIn)

const baseUrl = 'http://127.0.0.1:7001/v1/behavioral_captcha'
const behavioralCaptchaKey = ref('')
// 生成行为验证码
const behavioralCaptcha = ({ loading, onSuccess, onError }: RequestFnOptions) => {
  loading.value = true
  fetch(`${baseUrl}?account=Fady Mak&scene=1`)
    .then((res) => res.json())
    .then((res) => {
      if (String(res.code).endsWith('6200')) {
        const { image, thumbnail, key } = res.data
        onSuccess(image, thumbnail)
        behavioralCaptchaKey.value = key
      } else {
        onError(res.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 验证验证码
const handleVerify = ({ onError, onSuccess, points }: VerifyOptions) => {
  fetch(`${baseUrl}/verify`, {
    method: 'post',
    body: JSON.stringify({
      account: 'Fady Mak',
      scene: 1,
      dots: String(points),
      key: behavioralCaptchaKey.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (String(res.code).endsWith('6200')) {
        onSuccess()
      } else {
        onError(res.message)
      }
    })
}
</script>
