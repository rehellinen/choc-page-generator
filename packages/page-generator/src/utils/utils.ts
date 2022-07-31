import { message } from 'antd'

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== null
}
export function isPromise(val: any): val is Promise<any> {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function'
}
export const isObject = (val: any) => val !== null && typeof val === 'object'
export const isString = (val: any) => typeof val === 'string'
export const isFunction = (val: any) => typeof val === 'function'

export const handleError = (e: Error) => {
  console.log(e)
  message.error(e.message)
}
