import React, { useEffect } from 'react';
import { Form, Row, Col, FormInstance } from 'antd';
import Field from './Field';
import { FormSchema } from '../../../types/Form';
import { onFormChange, LayoutType, LayoutConfig } from './Form';
import '../index.css';

interface FormComponentProps<T extends object> {
  data: T;
  config: FormSchema<T>[];
  onChange?: onFormChange<T>;
  form: FormInstance;
  children?: React.ReactElement;
  layout?: LayoutType;
  formItemCol?: number;
  formItemLayout?: LayoutConfig;
}

function FormComponent<T extends object>(props: FormComponentProps<T>): React.ReactElement {
  const {
    layout,
    formItemLayout,
    data,
    config,
    form,
    onChange,
    children,
    formItemCol = 8,
  } = props;

  const onFieldChange = (values: any) => {
    // form.setFieldsValue(values);
    onChange && onChange(values, form);
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  const getFields = () =>
    config.map((item, index: number) => {
      const field = (
        <Field<T>
          data={data[item.name]}
          layout={layout}
          fieldProps={item}
          formItemCol={formItemCol}
          key={index}
          onChange={onFieldChange}
        />
      );
      return layout === 'vertical' ? (
        <Row className="max-width">{field}</Row>
      ) : (
        <Col span={formItemCol}>{field}</Col>
      );
    });
  const getWrapper = () => {
    const content = (
      <>
        {getFields()}
        {children}
      </>
    );

    return layout === 'vertical' ? (
      content
    ) : (
      <Row gutter={[5, 5]} className="max-width">
        {content}
      </Row>
    );
  };

  return (
    <Form requiredMark={true} layout={layout} form={form} {...formItemLayout}>
      {getWrapper()}
    </Form>
  );
}

export default FormComponent;
