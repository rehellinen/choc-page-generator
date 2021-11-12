import React, { ReactNode } from 'react';
import { Modal, Form } from 'antd';
import FormComponent from './FormComponent';
import { getAllProps } from '../utils';
import { FormSchema } from '../../../types/Form';
import {
  onFormChange,
  onFormCancel,
  onFormSubmit,
  LayoutType,
  LayoutConfig,
} from './Form';

interface ModalFormProps<T extends object> {
  data: T;
  config: FormSchema<T>[];
  layout?: LayoutType;
  visible?: boolean;
  title?: string | ReactNode;
  loading?: boolean;
  modalWidth?: number | string;
  onChange?: onFormChange<T>;
  onCancel?: onFormCancel;
  onSubmit?: onFormSubmit<T>;
  formItemLayout?: LayoutConfig;
  confirmBtnText?: string; // 确定按钮文字
  cancelBtnText?: string; // 取消按钮文字
}

function ModalForm<T extends object>(props: ModalFormProps<T>): React.ReactElement {
  const {
    title,
    visible = false,
    loading = false,
    confirmBtnText = 'Confirm',
    cancelBtnText = 'Cancel',
    modalWidth = '80%',
    data,
    ...restProps
  } = props;

  const [form] = Form.useForm<T>();

  const onModalCancel = () => {
    props.onCancel && props.onCancel(form);
  };

  const onModalConform = () => {
    const validateProps = getAllProps<T>(restProps.config);

    form
      .validateFields(validateProps as any)
      .then((values) => {
        props.onSubmit && props.onSubmit(values, form);
      })
      .catch((error) => {
        console.log('form validate error');
        console.log(error);
      });
  };

  return (
    <Modal
      className="form-modal"
      title={title}
      width={modalWidth}
      visible={visible}
      closable
      okText={confirmBtnText}
      cancelText={cancelBtnText}
      confirmLoading={loading}
      onCancel={onModalCancel}
      onOk={onModalConform}
    >
      <FormComponent<T> form={form} data={data} {...restProps} />
    </Modal>
  );
}

export default ModalForm;
