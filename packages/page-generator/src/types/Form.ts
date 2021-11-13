export type FormItemType =
  | 'input'
  | 'input-number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'password'
  | 'switch'
  | 'custom'
  | 'date'
  | 'date-range';

export interface FieldData<T = any> {
  label: string;
  value: T;
}

export interface FormSchema<T extends object> {
  name: keyof T;
  label?: string;
  type?: FormItemType;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean; // 是否必填
  rules?: any; // 校验规则
  component?: any; // 当type为component时，将渲染此node
  fieldData?: FieldData[]; // 当type为select / radio时所需的数据
  mode?: string;
  validateTrigger?: string | string[];
  autoSize?: {
    minRows?: number;
    maxRows?: number;
  };

  // type为date-range的可选参数
  format?: string;
  showTime?: boolean;
}

export interface FormConfig<T extends object = any> {
  id: string
  schema: FormSchema<T>[]
}
