// TODO: 生命周期的this要怎么推断出来
import Module from "../modules/Module";

export type LifeCycleFunction<
  T extends Module<any> = Module<any>
> = (this: T, ...args: any[]) => void

export type TableHookName = 'onChange' | 'mounted'
export type RequestHookName = 'onLoadingChanged' | 'onCompleted'
