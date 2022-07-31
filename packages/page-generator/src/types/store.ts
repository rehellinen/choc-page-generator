import {TablePaginationConfig} from "antd";

export interface TableStore<DATA extends object = any> {
  data: DATA[]
  recordIndex: number
  pagination: false | TablePaginationConfig
  isLoading: boolean
}
