import { TableColumnsType, TablePaginationConfig } from 'antd'
import { LifeCycleFunction } from "./index";
import {ModuleManager} from "../core/ModuleManager";

type RequestLifeCycleFunction = LifeCycleFunction | LifeCycleFunction[]
type TableLifeCycleFunction = LifeCycleFunction | LifeCycleFunction[]

// module config
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

type ConfigMap<ID extends string, PARAM1 extends object, PARAM2 extends object> = {
  'request': RequestConfig<ID, PARAM1, PARAM2>
  'table': TableConfig<ID, PARAM1>
}
// module config


// schema
export type RequestModule<ID extends string, REQ extends object, RES extends object> = [ID, 'request', REQ, RES]
export type TableModule<ID extends string, DATA extends object> = [ID, 'table', DATA]

export type Module = RequestModule<any, any, any> | TableModule<any, any>
export type ModuleConfig = Module[]
export type ModuleType = 'request' | 'table'

// 根据传入的type筛选出对应的Module
type GetModulesByType<CONFIG extends ModuleConfig, TYPE extends ModuleType> =
  CONFIG extends [infer FIRST, ...infer OTHERS]
    ? OTHERS extends ModuleConfig
      ? FIRST extends [infer ID, TYPE] | [infer ID, TYPE, any] | [infer ID, TYPE, any, any]
        ? [FIRST, ...GetModulesByType<OTHERS, TYPE>]
        : []
      : []
    : []

// 获取所有模块的ID
export type GetModuleIDs<CONFIG extends ModuleConfig> =
  CONFIG extends [infer FIRST, ...infer OTHERS]
    ? OTHERS extends ModuleConfig
      ? FIRST extends [infer ID, any] | [infer ID, any, any] | [infer ID, any, any, any]
        ? [ID, ...GetModuleIDs<OTHERS>]
        : []
    : []
  : []

// 将Module转为Config
type ModuleToConfig<CONFIG extends ModuleConfig> =
  CONFIG extends [infer FIRST, ...infer OTHERS]
    ? FIRST extends [infer ID, infer TYPE] | [infer ID, infer TYPE, infer PARAM1] | [infer ID, infer TYPE, infer PARAM1, infer PARAM2]
      ? OTHERS extends ModuleConfig
        ? ID extends string
          ? TYPE extends ModuleType ?
            PARAM1 extends object
              ? PARAM2 extends object
                ? [ConfigMap<ID, PARAM1, PARAM2>[TYPE], ...ModuleToConfig<OTHERS>]
                : [ConfigMap<ID, PARAM1, {}>[TYPE], ...ModuleToConfig<OTHERS>]
              : [ConfigMap<ID, {}, {}>[TYPE], ...ModuleToConfig<OTHERS>]
            : []
          : []
        : []
      : []
    : []

export type Schema<CONFIG extends ModuleConfig> = {
  request: ModuleToConfig<GetModulesByType<CONFIG, 'request'>>,
  table: ModuleToConfig<GetModulesByType<CONFIG, 'table'>>,

  initConnectors: (moduleManager: ModuleManager<CONFIG>) => void
  getComponent: (moduleManager: ModuleManager<CONFIG>) => void
}
// schema
