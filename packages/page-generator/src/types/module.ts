import Table from "../modules/Table";
import Request from "../modules/Request";
import {ModuleConfig, ModuleType} from "./schema";
import {AppendToObject} from "./utils";

export type Module = (Table<any> | Request<any>)

export type ModuleTypeMap<ID extends string, PARAM1 extends object, PARAM2 extends object> = {
  'table': Table<ID, PARAM1>
  'request': Request<ID, PARAM1, PARAM2>
}

export type ModuleMap<CONFIG extends ModuleConfig> =
  CONFIG extends [infer FIRST, ...infer OTHERS]
    ? OTHERS extends ModuleConfig
      ? FIRST extends [infer ID, infer TYPE] | [infer ID, infer TYPE, infer PARAM1] | [infer ID, infer TYPE, infer PARAM1, infer PARAM2]
        ? ID extends string
          ? TYPE extends ModuleType
            ? PARAM1 extends object
              ? PARAM2 extends object
                ? AppendToObject<ModuleMap<OTHERS>, ID, ModuleTypeMap<ID, PARAM1, PARAM2>>
                : AppendToObject<ModuleMap<OTHERS>, ID, ModuleTypeMap<ID, PARAM1, {}>>
              : AppendToObject<ModuleMap<OTHERS>, ID, ModuleTypeMap<ID, {}, {}>>
            : {}
          : {}
        : {}
      : {}
    : {}
