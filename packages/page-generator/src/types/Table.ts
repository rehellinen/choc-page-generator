// 计划跟ant-design的Table组件的schema保持一致
export interface TableSchema {
  title: string,
  dataIndex: string,
  key: string,
}
export interface TableConfig {
  id: string
  schema: TableSchema[]
}
