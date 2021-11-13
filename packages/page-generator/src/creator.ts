import {ChocConfig} from "./types/Schema";
import Schema from "./core/Schema";
import {TableConfig} from "./types/Table";
import Table from "./modules/Table";
import {createCreator} from "./utils/creator";

export const tableCreator = createCreator<typeof Table>(Table)

const initTable = (tableConfig: TableConfig | TableConfig[], schemaIns: Schema): Table[] => {
  if (Array.isArray(tableConfig)) {
    return Array.prototype.concat.call([], ...tableConfig.map(i => initTable(i, schemaIns)))
  }

  return [tableCreator(tableConfig, schemaIns)]
}

const creator = (schema: ChocConfig) => {
  const schemaIns = new Schema(schema)
  const tableIns = initTable(schema.table, schemaIns)

  return
}


export default creator
