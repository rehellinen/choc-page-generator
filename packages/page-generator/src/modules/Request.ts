import { Repository } from '~/src/plugins/repository'
import Module from '~/src/components/PageGenerator/modules/Module'

enum NormalErrorCode {
  SUCCESS = 0,
  ERROR = 1,
  ERROR_PARAMS = 2,
  ERROR_AUTH = 3,
  ERROR_SESSION = 4,
  ERROR_SERVER = 5,
  ERROR_NO_DATA = 6,
  ERROR_FORBID = 7,
  ERROR_DATA_EXIST = 8,
  ERROR_DATA_LIMIT = 9,
  ERROR_QUOTA_LIMIT = 10,
  ERROR_MAINTENANCE = 11,

  ERROR_REF_ID_EXISTS = 10003, // partner_id and partner_txn_id exists
  ERROR_INVALID_CHECKSUM = 10004, // deprecated, no checksum required in grpc
  ERROR_ACCOUNT_NO_INVALID = 10005, // bank account no format error
  ERROR_AMOUNT_INVALID = 10006, // amount too large or over limit
  ERROR_EMAIL_INVALID = 10007, // email pass basic validation, but invalid

  // is_error_code_config error type
  ERROR_CODE_CHANNEL_API_EXIST_ERROR = 100, // channel api are existing in ErrorCode Mapping Config
  ERROR_CODE_ERROR_KEY_EXIST_ERROR = 101, // is error key existed error
  ERROR_CODE_MAPPING_EXIST_ERROR = 102, // is error code mapping existed error
  ERROR_CODE_PENDING_APPROVE_ERROR = 103, // The same record exists pending approval
  ERROR_CODE_SYSTEM_ERROR = 104, // is error code config system error or other unknown error
  ERROR_CODE_STATUS_CODE_EXIST_ERROR = 105, // is status + error code existed error
  ERROR_CODE_ERROR_KEY_CONFLICT_ERROR = 106 // is code + error key conflict error
}
enum GiroErrorCode {
  SUCCESS = '00'
}
enum BankTopUpErrorCode {
  SUCCESS = '0'
}
// NORMAL处理的返回格式 -> { result_code: 0, result_message: '' }
// HEADER处理的返回格式 -> { header: { errcode: 0, errmsg: '' } }
// GIRO处理的返回格式 -> { error_code: 0, message: '' }
export enum ResponseType {
  NORMAL = 1,
  HEADER = 2,
  GIRO = 3,
  BANK_TOP_UP = 4
}

interface NormalResponse {
  result_code: NormalErrorCode
  result_message?: string
  result_msg?: string
}
interface HeaderResponse {
  header: {
    errcode: NormalErrorCode
    errmsg: string
  }
}
interface GiroResponse {
  error_code: GiroErrorCode
  message: string
}
interface BankTopUpResponse {
  error_code: BankTopUpErrorCode
  message: string
}
interface RequestConfig {
  responseType?: ResponseType
}

export class Request extends Module {
  async request(repository, method, params, { responseType }: RequestConfig = {}) {
    const res = await Repository[repository].post(method, params)

    if (responseType == null || responseType === ResponseType.NORMAL) {
      if (Number((res as NormalResponse).result_code) !== NormalErrorCode.SUCCESS) {
        throw new Error(
          (res as NormalResponse).result_message || (res as NormalResponse).result_msg
        )
      }
    } else if (responseType === ResponseType.HEADER) {
      if (Number((res as HeaderResponse).header.errcode) !== NormalErrorCode.SUCCESS) {
        throw new Error((res as HeaderResponse).header.errmsg)
      }
    } else if (responseType === ResponseType.GIRO) {
      if (String((res as GiroResponse).error_code) !== GiroErrorCode.SUCCESS) {
        throw new Error((res as GiroResponse).message)
      }
    } else if (responseType === ResponseType.BANK_TOP_UP) {
      if (String((res as BankTopUpResponse).error_code) !== BankTopUpErrorCode.SUCCESS) {
        throw new Error((res as GiroResponse).message)
      }
    }

    return res
  }

  // 对于Request类，this.output保存的是未经map处理的数据
  async pendingRequest(config: any = {}) {
    const { repository, method, params, responseType } = Object.assign({}, this.schema, config)

    this.output = await this.request(repository, method, params, {
      responseType
    })
    return this.schema.output || this.output
  }
}

export default Request
