type Constructor<T> = new (...args: any[]) => T
type ConstructorParams<T extends Constructor<any>> = T extends (new (...args: infer P) => any) ? P : never
type ConstructorReturn<T extends Constructor<any>> = T extends (new (...args: any[]) => infer P ) ? P : never


export function createCreator<T extends Constructor<any>>(constructor: Constructor<ConstructorReturn<T>>) {
  return function creator(...args: ConstructorParams<T>) {
    return new constructor(...args)
  }
}
