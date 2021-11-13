import { cloneDeep } from 'lodash'
import Schema from '../core/Schema'
import { isObject } from '../utils/utils'

export default class Module {
  id: string = ''
  schema: any = {}
  schemaIns: any = {}
  initialOutput: any = {}
  output: any = {}

  constructor(schema: any, schemaIns: Schema) {
    this.schema = schema
    this.schemaIns = schemaIns
    this.id = schema.id
  }

  mounted() {}

  getSchema() {
    return this.schema
  }

  resetOutput() {
    this.output = cloneDeep(this.initialOutput)
    return this.output
  }
  getOutput(config: any = {}) {
    const outputSchema = this.schema.output
    if (config.origin || !outputSchema) {
      return this.output
    }
    return this.getOutputByID(outputSchema)
  }
  setOutput(data: any) {
    this.output = data
  }

  async getOutputByID(schema: any) {
    if (!schema) {
      return {}
    }
    if (schema.getOutputByID) {
      return this.schemaIns.getOutputByID(schema.getOutputByID)
    }
    return schema
  }

  async callHook(name, config) {
    const functions = this.schema[name]

    if (Array.isArray(functions)) {
      for (const func of functions) {
        if (isObject(func)) {
          if (func.pendingRequest) {
            // eslint-disable-next-line no-await-in-loop
            await this.schemaIns.getOutputByID(func.pendingRequest, config)
          }
        }
      }
    }
  }
}
