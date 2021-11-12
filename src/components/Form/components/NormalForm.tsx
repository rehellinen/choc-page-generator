import React from 'react';
import { Form, Button, Row } from 'antd';
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

import '../index.css';

interface NormalFormProps<T extends object> {
  data: T;
  config: FormSchema<T>[];
  layout?: LayoutType;
  formItemLayout?: LayoutConfig;
  formItemCol?: number;
  showCancelBtn?: boolean;
  loading?: boolean;
  onChange?: onFormChange<T>;
  onSubmit?: onFormSubmit<T>;
  onCancel?: onFormCancel;
  confirmBtnText?: string;
  cancelBtnText?: string;
}

function NormalForm<T extends object>(props: NormalFormProps<T>): React.ReactElement {
  const {
    showCancelBtn = false,
    confirmBtnText = 'Confirm',
    cancelBtnText = 'Cancel',
    loading = false,
    formItemCol,
    data,
    ...restProps
  } = props;
  const [form] = Form.useForm();

  const onFormSubmit = () => {
    const validateProps = getAllProps<T>(restProps.config);

    form
      .validateFields(validateProps as any)
      .then((values: any) => {
        props.onSubmit && props.onSubmit(values, form);
      })
      .catch(() => {
        console.log('form validate error');
      });
  };

  const onFormCancel = () => {
    props.onCancel && props.onCancel(form);
  };

  return (
    <FormComponent<T>
      formItemCol={formItemCol}
      form={form}
      data={data}
      {...restProps}
    >
      <Row justify="end" className="form-btn">
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          onClick={onFormSubmit}
        >
          {confirmBtnText}
        </Button>
        {showCancelBtn && (
          <Button className="cancel-btn" onClick={onFormCancel}>
            {cancelBtnText}
          </Button>
        )}
      </Row>
    </FormComponent>
  );
}

export default NormalForm;
