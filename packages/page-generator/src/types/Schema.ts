import { TableConfig } from './Table';
import { FormConfig } from "./Form";

export interface Layout {
  id: string
  col: number
}

export interface ChocConfig {
  table: TableConfig | TableConfig[]
  form: FormConfig | FormConfig[]

  layout: Layout[][]
}
