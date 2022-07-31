import { TablePaginationConfig, Table as TableComponent } from 'antd'
import {proxy, useSnapshot} from "valtio";
import React, {useEffect} from "react";
import Module from './Module'
import {TableHookName} from "../types";
import {TableConfig} from "../types/modules";
import {TableStore} from "../types/store";

const defaultConfig: {
  pagination: TablePaginationConfig
} = {
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  }
}

export default class TableModule<ID extends string, DATA extends object = {}> extends Module<TableHookName> {
  config: TableConfig<ID, DATA>
  store: TableStore<DATA>

  constructor(config: TableConfig<ID, DATA>) {
    super()

    this.config = proxy({
      ...config,
      pagination: config.pagination ?? defaultConfig.pagination,
    })
    this.store = proxy({
      data: [],
      recordIndex: -1,
      isLoading: false,
      pagination: config.pagination ?? defaultConfig.pagination,
    })
    this.initHooks(['onChange', 'mounted'])
  }

  getComponent() {
    return () => {
      const config = useSnapshot(this.config) as TableConfig<ID, DATA>
      const store = useSnapshot(this.store) as TableStore<DATA>

      useEffect(() => {
        this.callHook('mounted')
      }, [])

      return <TableComponent<DATA>
        columns={config.columns}
        pagination={store.pagination}
        dataSource={store.data}
        loading={store.isLoading}
        onChange={(pagination) => {
          this.updatePagination(pagination)
        }}
      />
    }
  }

  reset() {
    this.store.data = []
    this.store.pagination = this.config.pagination!
    this.store.recordIndex = -1
  }

  getRecord() {
    return this.store.data[this.store.recordIndex]
  }

  updateRecordIndex(index: number) {
    this.store.recordIndex = index
  }
  updatePagination(pagination: false | TablePaginationConfig) {
    if (typeof pagination === 'boolean') {
      this.store.pagination = pagination
    } else {
      this.store.pagination = {
        ...this.store.pagination,
        ...pagination,
      }
    }

    this.callHook('onChange')
  }

}
