import { proxy } from 'valtio'

export default class Store {
  state = proxy({})
}
