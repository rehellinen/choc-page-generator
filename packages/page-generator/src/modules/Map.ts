import { cloneDeep } from 'lodash'
import Module from './Module'
import Schema from '../core/Schema'

export default class Map extends Module {
  constructor(schema: any, schemaIns: Schema) {
    super(schema, schemaIns)
    this.initOutput()
  }

  initOutput() {
    Object.defineProperty(this, 'output', {
      enumerable: true,
      configurable: true,
      get: () => {
        const newValue = {}
        for (const [key, value] of Object.entries(this.schema.output)) {
          if (value == null) {
            continue
          }

          if ((value as any).arrMap) {
            const source = (value as any).source
            if (!source) {
              continue
            }

            newValue[key] = source.map((item) => {
              this.schemaIns.setItem(item)
              const newItem = cloneDeep((value as any).arrMap)
              this.schemaIns.setItem({})
              return newItem
            })
          } else {
            newValue[key] = cloneDeep(value)
          }
        }

        return newValue
      }
    })
  }
}
