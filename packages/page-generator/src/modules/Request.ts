import {proxy} from "valtio";
import axios from "axios";
import { isEqual } from "lodash";
import Module from "./Module";
import {RequestConfig} from "../types/schema";
import {RequestStore} from "../types/store";
import {RequestHookName} from "../types";
import {handleError} from "../utils/utils";


export class Request<
  ID extends string,
  REQ extends object = {},
  RES extends object = {}
> extends Module<RequestHookName> {
  config: RequestConfig<ID, REQ, RES>
  store: RequestStore<REQ, RES>

  constructor(config: RequestConfig<ID, REQ, RES>) {
    super()

    this.config = proxy({
      ...config
    })
    this.store = proxy({
      cachedRequestData: undefined,
      response: undefined,
      isLoading: false,
      pendingCount: 0,
    })
    this.initHooks(['onLoadingChanged', 'onCompleted'])
  }

  setLoading(isLoading: boolean) {
    this.store.isLoading = isLoading
    this.callHook('onLoadingChanged')
  }

  async refetch() {
    return this.fetch(this.store.cachedRequestData, {
      isRefetch: true
    })
  }

  async fetch(data?: REQ, config?: { isRefetch: boolean }) {
    try {
      const { isRefetch } = config ?? {}

      if (isRefetch) {
        data = this.store.cachedRequestData
      }
      if (!isRefetch && isEqual(data, this.store.cachedRequestData)) {
        return this.store.response
      }

      this.store.cachedRequestData = data
      this.store.pendingCount++
      this.setLoading(true)

      const res = await axios({
        data,
        method: this.config.method,
        url: this.config.url,
      })

      this.store.response = res.data
      this.callHook('onCompleted')
    } catch (e) {
      handleError(e as Error)
    } finally {
      this.store.pendingCount--

      if (this.store.pendingCount === 0) {
        this.setLoading(false)
      }
    }
  }

}

export default Request
