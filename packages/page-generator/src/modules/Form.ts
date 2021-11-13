import Schema from '../core/Schema'
import Module from './Module'
import { isObject } from '../utils/utils'
import Request from './Request'

export default class Form extends Module {
  constructor(schema: any, schemaIns: Schema) {
    super(schema, schemaIns)

    this.initFormOutput()
  }

  async mounted() {
    await this.fetchOptions()
  }
  async fetchOptions() {
    for (const schema of this.schema.schema) {
      if (isObject(schema.options) && schema.options.pendingRequest) {
        const { pendingRequest: requestID, ...config } = schema.options
        const requestModule: Request = this.schemaIns.getModuleByID(requestID)
        // eslint-disable-next-line no-await-in-loop
        schema.options = await requestModule.pendingRequest(config)
      }
    }
  }

  initFormOutput() {
    const formVal = {}
    for (const formConf of this.schema.schema) {
      formVal[formConf.key] = formConf.value
    }

    this.initialOutput = formVal
    this.resetOutput()
  }

  setOutput(data) {
    this.output = {
      ...this.initialOutput,
      ...this.output,
      ...data
    }

    return this.output
  }

  resetOutput() {
    this.schema.schema.forEach((i) => {
      i.value = this.initialOutput[i.key]
    })
    return super.resetOutput()
  }
}
