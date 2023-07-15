// 只是导入类型不是导入App的值
import type { App, Plugin } from 'vue'

/**
 * 组件外部使用use时执行install，然后将组件注册为全局
 */

// 类型必须导出否则生成不了.d.ts文件
export type SFCWithInstall<T> = T & { name: string } & Plugin

/**
 * 定义一个withInstall方法处理以下组件类型问题
 * @param comp
 */
export const withInstall = <T>(comp: T, name: string) => {
  /**
   * 直接写comp.install = function(){} 的话会报错，因为comp下没有install方法
   * 所以从vue中引入Plugin类型，断言comp的类型为T&Plugin
   */
  ;(comp as SFCWithInstall<T>).install = function (app: App) {
    app.component((comp as any).name, comp as any)
  }
  ;(comp as SFCWithInstall<T>).name = name

  return comp as SFCWithInstall<T>
}

/**
 * 判断新坐标点是否在半径为 r 的范围内
 * 并更新坐标点数组
 * @param points 坐标数组
 * @param newPoint 新坐标点
 * @returns
 */
export function addPoint(
  points: [number, number][],
  newPoint: [number, number],
  r = 5
): [number, number][] {
  // 记录是否存在 r 周围的坐标
  let flag = false
  // 记录在不在半径 r 周围
  const newPoints: [number, number][] = []
  // 遍历每个坐标点
  for (let i = 0; i < points.length; i++) {
    if (flag) continue
    // 获取当前坐标点的横纵坐标
    const [x1, y1] = points[i]
    // 获取新坐标点的横纵坐标
    const [x2, y2] = newPoint
    // 计算当前坐标点与新坐标点之间的欧几里得距离
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    // 如果距离小于 r ，则将当前坐标点 r 半径内存在一个点  进入下一次循环
    if (distance < r) {
      flag = true
      continue
    }
    newPoints.push(points[i])
  }
  if (!flag) newPoints.push(newPoint)
  return points.length < 1 ? [newPoint] : newPoints
}
