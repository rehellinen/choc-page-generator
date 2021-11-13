import { TableConfig } from './Table';
import { FormConfig } from "./Form";

export interface Layout {
  id: string
  col: number
}

export interface ChocSchema {
  table: TableConfig | TableConfig[]
  form: FormConfig | FormConfig[]

  layout: Layout[][]
}
