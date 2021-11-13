import {ChocSchema} from "./types/Schema";
import Schema from "./core/Schema";

const creator = (schema: ChocSchema) => {


  return new Schema()
}

export default creator
