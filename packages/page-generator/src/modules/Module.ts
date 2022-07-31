import {handleError} from '../utils/utils'
import {LifeCycleFunction} from "../types";

export default class Module<HOOK_NAME extends string> {
  hooks: Record<string, LifeCycleFunction[]> = {}
  config: any = {}

  initHooks(hookNames: HOOK_NAME[]) {
    hookNames.forEach((hookName) => {
      if (this.config[hookName]) {
        this.addHook(hookName, this.config[hookName])
      }
    })
  }

  addHook(hookName: HOOK_NAME, func: LifeCycleFunction | LifeCycleFunction[]) {
    if (!Array.isArray(func)) {
      func = [func]
    }

    if (!this.hooks[hookName]) {
      this.hooks[hookName] = func
    } else {
      this.hooks[hookName].push(...func)
    }
  }

  async callHook(hookName: HOOK_NAME) {
    if (!this.hooks[hookName]) {
      return
    }

    try {
      for (const hook of this.hooks[hookName]) {
        await hook.apply(this)
      }
    } catch (e) {
      handleError(e)
    }
  }
}
