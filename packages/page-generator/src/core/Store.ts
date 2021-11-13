import { proxy } from 'valtio'

export default class Store {
  state = proxy({})

  register(id: string, data: any) {

  }
}
