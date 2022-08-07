import {GetModuleIDs, ModuleConfig} from "../types/schema";
import {Module, ModuleMap} from "../types/module";

export class ModuleManager<CONFIG extends ModuleConfig> {
  modules: Module[] = []

  add(module: Module) {
    this.modules.push(module)
  }

  get<ID extends GetModuleIDs<CONFIG>[number]>(id: ID): ModuleMap<CONFIG>[ID] {
    const module = this.modules.find((module) => module.config.id === id)

    if (!module) {
      throw new Error(`Can't find module(id: ${id})`)
    }

    return module as ModuleMap<CONFIG>[ID]
  }
}
