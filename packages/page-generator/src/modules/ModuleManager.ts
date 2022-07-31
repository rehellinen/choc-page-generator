export class ModuleManager<CONFIG> {
  config: any
  modules: any[] = []

  add(module: any) {
    this.modules.push(module)
  }

  get<ID extends string>(id: ID) {
    const module = this.modules.find((module) => module.config.id === id)

    if (!module) {
      throw new Error(`Can't find module(id: ${id})`)
    }

    return module
  }
}
