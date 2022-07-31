import { TableColumnsType, TablePaginationConfig } from 'antd'
import { LifeCycleFunction } from "./index";

type RequestLifeCycleFunction = LifeCycleFunction | LifeCycleFunction[]
type TableLifeCycleFunction = LifeCycleFunction | LifeCycleFunction[]

export interface BaseConfig<ID extends string> {
  id: ID
}

export interface RequestConfig<
  ID extends string,
  REQUEST extends object = {},
  RESPONSE extends object = {},
> extends BaseConfig<ID> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string
  onLoadingChanged?: RequestLifeCycleFunction
  onResponseReceived?: RequestLifeCycleFunction
  onCompleted?: RequestLifeCycleFunction
}

export interface TableConfig<ID extends string, DATA extends object = {}> extends BaseConfig<ID> {
  columns: TableColumnsType<DATA>
  pagination?: false | TablePaginationConfig
  onChange?: TableLifeCycleFunction
}
