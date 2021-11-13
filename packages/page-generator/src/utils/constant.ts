export interface PageInfo {
  current: number
  total: number
  pageSize: number
  pageSizeOptions: number[]
}

export const DEFAULT_PAGE_INFO: PageInfo = {
  current: 1,
  total: 0,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 40]
}
