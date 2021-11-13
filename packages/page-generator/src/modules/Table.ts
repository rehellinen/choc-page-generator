import { cloneDeep } from 'lodash'
import Schema from './Schema'
import Module from './Module'
import Request from './Request'
import Components from '../components'
import { isObject } from '../utils/utils'
import {createCreator} from "../utils/creator";

export interface TablePageOptions {
  pageSize: number
  pageSizeOptions: number[]
  current: number
  total: number
  start: number
}

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40]
const defaultOutput = {
  pageSize: DEFAULT_PAGE_SIZE,
  pageSizeOptions: cloneDeep(DEFAULT_PAGE_SIZE_OPTIONS),
  current: 1,
  total: 0,
  start: 0
}

export default class Table extends Module {
  output: TablePageOptions = defaultOutput
  initialOutput: TablePageOptions = defaultOutput

  constructor(schema: any, schemaIns: Schema) {
    super(schema, schemaIns)

    this.initTableOutput()
    this.initRender()
  }

  initRender() {
    for (const item of this.schema.schema) {
      if (isObject(item.render) && item.render.component) {
        item.render = this.getComponentRenderFunction(item.key, item.render)
      }
      if (isObject(item.map)) {
        item.render = this.getMapRenderFunction(item.key, item.map)
      }
    }
  }

  initTableOutput() {
    const { pageSize = DEFAULT_PAGE_SIZE, pageSizeOptions = cloneDeep(DEFAULT_PAGE_SIZE_OPTIONS) } =
      this.schema.pageInfo ?? {}

    this.initialOutput = {
      pageSize,
      pageSizeOptions,
      current: 1,
      total: 0,
      start: 0
    }
    this.resetOutput()
  }

  // Table类特有方法getData，用于发送http请求获取Table所需数据
  async getTableData() {
    const { data: dataSchema } = this.schema
    if (!dataSchema) {
      return []
    }

    const { pendingRequest: requestID, ...config } = dataSchema
    const requestModule: Request = this.schemaIns.getModuleByID(requestID)
    const { total, data } = await requestModule.pendingRequest(config)
    this.output.total = total
    return data
  }

  setOutput(data) {
    if (data.current) {
      this.output.current = data.current
    }
    if (data.pageSize) {
      this.output.pageSize = data.pageSize
    }

    this.output.start = (this.output.current - 1) * this.output.pageSize
    return this.output
  }

  getMapRenderFunction(key: string, map: any) {
    return (h, { row }) => {
      return h('span', map[row[key]])
    }
  }
  getComponentRenderFunction(key: string, render: any) {
    const { component, ...config } = render
    return (h, { row, index }) => {
      return h(Components[component], {
        on: {
          'refresh-table-data': (params) => {
            this.schemaIns.vueIns.getTableData(params)
          },
          'reset-table-data': (params) => {
            this.schemaIns.resetSearchQuery()
            this.schemaIns.resetTablePageInfo()
            this.schemaIns.vueIns.getTableData(params)
          }
        },
        props: {
          row,
          key,
          index,
          value: row[key],
          schemaIns: this.schemaIns,
          ...config
        }
      })
    }
  }
}
