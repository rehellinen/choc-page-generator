import {TablePaginationConfig} from "antd";

export interface TableStore<DATA extends object = any> {
  data: DATA[]
  recordIndex: number
  pagination: false | TablePaginationConfig
  isLoading: boolean
}

export interface RequestStore<REQ extends object = any, RES extends object = any> {
  cachedRequestData?: REQ // 上一次请求的请求参数
  response?: RES
  isLoading: boolean,
  pendingCount: number // 处于pending状态中的请求数量
}
