import { type ExtractPropTypes, PropType, type Ref } from 'vue'
export type RequestFnOptions = {
  loading: Ref<boolean>
  onError: (message?: string) => void
  onSuccess: (image: string, thumbnail: string) => void
}
export type RequestFn = (options: RequestFnOptions) => void

export type VerifyOptions = {
  loading: Ref<boolean>
  points: number[] | [number, number][]
  onSuccess: (message?: string) => void
  onError: (message?: string) => void
}
export type VerifyFn = (options: VerifyOptions) => void
export const definePropType = <T>(val: any): PropType<T> => val

// 定义props类型声明
export const secureActionProps = {
  title: {
    type: String,
    default: '图形验证'
  },
  request: {
    type: Function as PropType<RequestFn>,
    required: true
  },
  verify: {
    type: Function as PropType<VerifyFn>,
    required: true
  },
  // loading 文本
  loadingText: {
    type: String,
    default: '加载中...'
  },
  // 验证中文本
  validatingText: {
    type: String,
    default: '验证中,请稍等...'
  },
  // 成功文本
  successText: {
    type: String,
    default: '验证成功'
  },
  // 失败文本
  failText: {
    type: String,
    default: '验证失败，请按提示重新操作'
  },
  // 是否扁平化数组
  flat: {
    type: Boolean,
    default: true
  },
  // 验证错误时 间隔多少时间刷新
  errorRefreshWait: {
    type: Number,
    default: 2000
  },
  // 验证成功时 间隔多少时间关闭
  successCloseWait: {
    type: Number,
    default: 1200
  },
  // 是否点击遮罩层可以关闭对话框
  maskClosable: {
    type: Boolean,
    default: true
  },
  // 是否隐藏取消按钮
  hideCancel: {
    type: Boolean,
    default: false
  },
  // 是否显示关闭按钮
  closable: {
    type: Boolean,
    default: true
  },
  // 是否支持键盘 esc 关闭
  keyboard: {
    type: Boolean,
    default: true
  },
  // 确认按钮的内容
  okText: {
    type: String,
    default: '确认'
  },
  // 容器类名
  class: {
    type: String,
    default: ''
  },
  // 遮罩层类名
  maskClass: {
    type: String,
    default: ''
  },
  // 取消按钮的内容
  cancelText: {
    type: String,
    default: '取消'
  },
  maxPoint: {
    type: Number,
    default: 9
  },
  r: {
    type: Number,
    default: 10
  },
  // 图片加载失败时的背景色
  fallbackBg: {
    type: String,
    default: '#f5f5f5'
  },
  // 图片加载失败时的提示语
  fallbackText: {
    type: String,
    default: '加载失败'
  },
  // 底部按钮对齐位置
  footerAlign: {
    type: String,
    values: ['start', 'center', 'end'],
    default: 'end'
  }
}
export type SecureActionProps = ExtractPropTypes<typeof secureActionProps>
