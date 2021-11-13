import React from 'react';
import { FormInstance, ColProps } from 'antd';
import { FormSchema } from '../../../types/Form';
import NormalForm from './NormalForm';
import ModalForm from './ModalForm';

export type onFormSubmit<T> = (values: T, form: FormInstance) => void;
export type onFormChange<T> = (values: Partial<T>, form: FormInstance) => void;
export type onFormCancel = (form: FormInstance) => void;
export type LayoutType = 'horizontal' | 'vertical' | 'inline';
export type LayoutConfig = {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
};

interface FormProps<T extends object> {
  data: T;
  config: FormSchema<T>[];
  type?: 'modal' | 'normal';
  layout?: LayoutType;
  labelCol?: number; // label占宽
  wrapperCol?: number; // 表单组件占宽
  formItemCol?: number; // 每个form item占据的宽度
  loading?: boolean; // 确定按钮loading
  showCancelBtn?: boolean; // 展示取消按钮
  confirmBtnText?: string; // 确定按钮文字
  cancelBtnText?: string; // 取消按钮文字
  visible?: boolean; // modal是否展示
  modalWidth?: string; // modal宽度
  title?: string; // modal标题
  onSubmit: onFormSubmit<T>; // 点击确定按钮
  onCancel?: onFormCancel; // 点击取消按钮
  onChange?: onFormChange<T>; // 数值有所改变
}

function ChocForm<T extends object>(props: FormProps<T>): React.ReactElement {
  const {
    data,
    type = 'normal',
    layout = 'horizontal',
    labelCol = 5,
    wrapperCol = 18,
  } = props;

  let formItemLayout: LayoutConfig | undefined = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: labelCol },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: wrapperCol },
    },
  };
  if (layout !== 'horizontal') {
    formItemLayout = undefined;
  }

  const renderForm = (type: string) => {
    if (type === 'modal') {
      return (
        <ModalForm<T>
          {...props}
          layout={layout}
          data={data}
          formItemLayout={formItemLayout}
        />
      );
    } else {
      return (
        <NormalForm<T>
          {...props}
          layout={layout}
          data={data}
          formItemLayout={formItemLayout}
        />
      );
    }
  };

  return <>{renderForm(type)}</>;
}

export default ChocForm;
