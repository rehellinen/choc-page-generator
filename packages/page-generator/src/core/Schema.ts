import * as R from 'ramda'
import { isObject, isString, parseText } from '../utils/utils';
import CustomMap from '../modules/Map'
import Module from '../modules/Module'
import Request, { ResponseType } from '../modules/Request'

export enum ModuleType {
  REQUEST = 'request',
  FORM = 'form',
  TABLE = 'table',
  MAP = 'map'
}

interface MapSchema {
  type: string
  map: any
  behavior?: string
}
interface FormSchema {
  id: string
  type: 'form'
  schema: any[]
  output?: MapSchema
}

export default class Schema {
  protected vueIns: any = {}
  protected schema: any = {}
  protected modules: Record<string, Module> = {}
  protected env = {
    R,
    ResponseType,
    item: {}
  }

  constructor(schema?: any) {
    this.init(schema)
  }

  async mounted() {
    for (const module of Object.values(this.modules)) {
      module.mounted()
    }
  }

  init(schema?: any, vueIns?: Vue) {
    if (!schema || !vueIns) {
      return
    }
    this.vueIns = vueIns
    this.schema = schema
    this.traverse()
    this.initCommonModules()
  }
  initCommonModules() {
    const schema = this.schema
    if (schema.request) {
      Array.isArray(schema.request)
        ? schema.request.forEach((i) => this.initRequest(i))
        : this.initRequest(schema.request)
    }

    if (schema.map) {
      Array.isArray(schema.map)
        ? schema.map.forEach((i) => this.initMap(i))
        : this.initMap(schema.map)
    }
  }
  initMap(schema) {
    this.defineModuleOutputProxy(schema, new CustomMap(schema, this))
  }
  initRequest(schema) {
    this.defineModuleOutputProxy(schema, new Request(schema, this))
  }

  defineModuleOutputProxy(schema, module) {
    this.modules[schema.id] = module
    Object.defineProperty(this.env, schema.id, {
      get() {
        return module.output
      }
    })
  }

  // 深度遍历schema并解析{{}}语法
  traverse() {
    this._traverse(this.schema)
  }
  _traverse(schema: any) {
    for (const [key, value] of Object.entries(schema)) {
      if (isObject(value)) {
        this._traverse(value)
      } else if (Array.isArray(value)) {
        for (const [arrKey, arrVal] of value.entries()) {
          if (isObject(arrVal) || Array.isArray(arrVal)) {
            this._traverse(arrVal)
          } else if (isString(arrVal)) {
            const { exp, isStatic } = parseText(arrVal as string)
            if (!isStatic) {
              this.defineProperty(value, arrKey, exp)
            }
          }
        }
      } else if (isString(value)) {
        const { exp, isStatic } = parseText(value as string)
        if (!isStatic) {
          this.defineProperty(schema, key, exp)
        }
      }
    }
  }

  defineProperty(obj: Object, key: string | number, value: any) {
    // eslint-disable-next-line no-new-func
    const func = new Function(`with(this) {
      return ${value}
    }`).bind(this.getEnv())

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        return func()
      },
      set: function reactiveSetter(newVal) {
        value = newVal
      }
    })
  }

  async getOutputByID(ids: string | string[], config?: any) {
    if (Array.isArray(ids)) {
      const data = await Promise.all(ids.map((i) => this._getOutputByID(i, config)))
      return Object.assign({}, ...data)
    }

    return this._getOutputByID(ids, config)
  }
  async _getOutputByID(id: string, config?: any) {
    const module = this.modules[id]
    if (!module) {
      throw new Error(`Can't find module with id '${id}'`)
    }
    return module.getOutput(config)
  }

  /* 自身成员属性相关 */
  getModuleByID(id: string) {
    return this.modules[id]
  }
  getSchema() {
    return this.schema
  }
  getEnv(name?: string) {
    return name ? this.env[name] : this.env
  }
  setEnv(name, value) {
    this.env[name] = value
  }
  setItem(value) {
    this.setEnv('item', value)
  }
  /* 自身成员属性相关 */
}
