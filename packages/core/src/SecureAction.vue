<template>
  <teleport v-if="visible" to="body">
    <div :class="['secure-action__mask', maskClass]" @click.self="handleClose('mask')">
      <div :class="['secure-action', props.class]">
        <header class="secure-action__header">
          <slot name="title">
            <label class="sa-title">{{ title }}</label>
          </slot>
          <button
            @click="handleClose('closable')"
            v-if="closable"
            class="sa-button is-icon no-border"
          >
            <img :src="IconClose" />
          </button>
        </header>
        <section class="secure-action__body">
          <header class="sa-thumbnail-wrap">
            <label>请在下图<mark>依次</mark>点击：</label>
            <img
              class="sa-thumbnail"
              v-fallback-image
              :key="formState?.thumbnail"
              :src="formState?.thumbnail"
              :alt="title"
            />
            <button @click="handleRefresh" class="sa-button is-icon">
              <img :src="IconRefresh" />
            </button>
          </header>
          <div class="sa-loading-warpper">
            <div v-if="loading" class="loading-content">
              <slot name="loading">
                <svg
                  class="loading-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM3.1 8C3.1 10.7062 5.2938 12.9 8 12.9C10.7062 12.9 12.9 10.7062 12.9 8C12.9 5.2938 10.7062 3.1 8 3.1C5.2938 3.1 3.1 5.2938 3.1 8Z"
                    fill="white"
                  />
                  <path
                    d="M15 8C15 9.38447 14.5895 10.7378 13.8203 11.889C13.0511 13.0401 11.9579 13.9373 10.6788 14.4672C9.3997 14.997 7.99223 15.1356 6.63437 14.8655C5.2765 14.5954 4.02922 13.9287 3.05025 12.9497C2.07128 11.9708 1.4046 10.7235 1.1345 9.36563C0.864406 8.00777 1.00303 6.6003 1.53284 5.32122C2.06266 4.04213 2.95986 2.94888 4.11101 2.17971C5.26215 1.41054 6.61553 1 8 1V3.1C7.03087 3.1 6.08351 3.38738 5.27771 3.9258C4.4719 4.46422 3.84386 5.22949 3.47299 6.12485C3.10212 7.02021 3.00508 8.00544 3.19415 8.95594C3.38322 9.90645 3.8499 10.7795 4.53518 11.4648C5.22045 12.1501 6.09355 12.6168 7.04406 12.8058C7.99456 12.9949 8.97979 12.8979 9.87515 12.527C10.7705 12.1561 11.5358 11.5281 12.0742 10.7223C12.6126 9.91649 12.9 8.96913 12.9 8H15Z"
                    fill="#AEB5C5"
                  />
                </svg>
                {{ isValidating ? validatingText : loadingText }}
              </slot>
            </div>
            <main class="sa-image-wrap">
              <i
                v-for="(item, i) in points"
                class="sa-point"
                :style="{
                  '--sa-point-x': `${item[0]}px`,
                  '--sa-point-y': `${item[1]}px`
                }"
                :key="String(item)"
              >
                {{ i + 1 }}
              </i>
              <img
                v-fallback-image
                :key="formState?.image"
                :class="['sa-image', { 'is-disabled': points.length === props.maxPoint }]"
                @click="handleClickImage"
                @contextmenu.prevent.stop
                :src="formState?.image"
                :alt="title"
              />
              <slot name="fallback">
                <div v-if="!loading" class="sa-fallback">
                  <img :src="fallbackImg" class="sa-fallback__image" />
                  <span>{{ fallbackText }}</span>
                </div>
              </slot>
              <slot name="status" :status="status" :statusText="statusText">
                <div
                  :class="[
                    'sa-status',
                    {
                      'is-success': status === 'SUCCESS',
                      'is-error': status === 'ERROR',
                      'is-show': !!statusText
                    }
                  ]"
                >
                  {{ statusText }}
                </div>
              </slot>
            </main>
          </div>
        </section>
        <footer class="secure-action__footer" :class="[`is-${footerAlign}`]">
          <button v-if="!hideCancel" class="sa-button" @click="handleClose('cancel')">取消</button>
          <button :disabled="okDisabled" class="sa-button is-primary" @click="handleOk">
            确认
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watchPostEffect, watch, onUnmounted, computed } from 'vue'
// @ts-ignore
import IconClose from './assets/close.svg'
// @ts-ignore
import fallbackImg from './assets/fallback-img.svg'
// @ts-ignore
import IconRefresh from './assets/refresh.svg'
import { secureActionProps } from './props'
import { addPoint } from './utils'
import { useSecureActionStore } from './hooks/useSecureActionStore'
// 正常 成功 错误
type Status = '' | 'SUCCESS' | 'ERROR'
const status = ref<Status>('')

defineOptions({
  directives: {
    'fallback-image': {
      mounted(el: HTMLImageElement) {
        el.classList.remove('is-fallback')
        el.addEventListener('error', () => {
          el.classList.add('is-fallback')
        })
      }
    }
  }
})

const props = defineProps(secureActionProps)
/** 验证中 */
const isValidating = ref(false)
/** loading */
const loading = ref(true)
/** 是否显示 */
const visible = ref(false)
/** 选择的坐标点 */
const dots = ref<number[] | [number, number][]>([])
const emit = defineEmits<{
  (event: 'visible-change', value: boolean): void
}>()
const points = ref<[number, number][]>([])

interface FormState {
  image: string
  thumbnail: string
}
const formState = ref<FormState>({
  image: '',
  thumbnail: ''
})

const okDisabled = computed(() => {
  return (
    points.value.length < 1 || isValidating.value || loading.value || status.value === 'SUCCESS'
  )
})

const customMessage = ref('')
const statusText = computed(() => {
  if (customMessage.value.trim()) return customMessage.value
  if (status.value === 'SUCCESS') return props.successText || ''
  if (status.value === 'ERROR') return props.failText || ''
  return ''
})

/** 监听 ESC 事件 */
const handleListenerEsc = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    if (visible.value && props.keyboard) {
      visible.value = false
    }
  }
}

const onError = (refresh: boolean, message?: string) => {
  status.value = 'ERROR'
  customMessage.value = message || ''
  if (refresh) {
    setTimeout(() => {
      handleRefresh()
      status.value = ''
      customMessage.value = ''
    }, props.errorRefreshWait || 2000)
  }
}
const handleRefresh = () => {
  points.value = []
  isValidating.value = false
  props?.request?.({
    loading,
    onSuccess(image, thumbnail) {
      handleReset(false)
      formState.value.image = image
      formState.value.thumbnail = thumbnail
    },
    onError: (message) => onError(false, message)
  })
}
const { openPromise, openResolve } = useSecureActionStore()

/** 打开事件 */
const handleOpen = async () => {
  visible.value = true
  isValidating.value = false
  formState.value.image = ''
  formState.value.thumbnail = ''
  handleRefresh()
  document.addEventListener('keydown', handleListenerEsc)
  openPromise.value = new Promise((resolve) => {
    openResolve.value = resolve
  })
  return openPromise.value
}

/** 监听 visible 变化 */
watch(visible, (v) => {
  emit('visible-change', v)
  if (!v) handleReset()
})

const handleReset = (close = true) => {
  points.value = []
  isValidating.value = false
  formState.value.image = ''
  formState.value.thumbnail = ''
  customMessage.value = ''
  status.value = ''
  if (close) {
    visible.value = false
  }
}
/** 关闭类型 */
type CloseType = 'mask' | 'cancel' | 'closable'
/**
 * 关闭事件
 * @param type  'mask', 'cancel', 'closable'
 */
const handleClose = (type: CloseType) => {
  if (type === 'mask' && !props.maskClosable) return
  visible.value = false
  openResolve.value?.(false)
}

/**
 * 监听坐标点的变化 传递给 dots
 */
watchPostEffect(() => {
  dots.value = props.flat ? points.value.flat() : points.value
})

/**
 * 确认事件
 */
const handleOk = () => {
  props.verify &&
    props.verify({
      loading,
      points: dots.value,
      onError: (message) => onError(true, message),
      onSuccess: (message?: string) => {
        status.value = 'SUCCESS'
        customMessage.value = message || ''
        setTimeout(() => {
          handleReset()
          openResolve.value?.(true)
        }, props.successCloseWait || 2000)
      }
    })
}

/**
 * 图片点击标记坐标点
 */
const handleClickImage = (event: MouseEvent) => {
  if (points.value.length === props.maxPoint) return
  const newPoint: [number, number] = [event.offsetX, event.offsetY]
  const res = addPoint(points.value, newPoint, props.r)
  points.value = res
}

onUnmounted(() => {
  document?.removeEventListener('keydown', handleListenerEsc, false)
})

defineExpose({
  verify: handleOpen
})
</script>

<style scoped></style>
./hooks/store
