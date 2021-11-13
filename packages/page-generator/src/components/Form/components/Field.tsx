import React, { useCallback } from 'react';
import { Moment } from 'moment';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  Switch,
  DatePicker,
} from 'antd';
import { FormSchema } from '../../../types/Form';
import { LayoutType } from './Form';
import '../index.css';

interface FieldProps<T extends object> {
  data: any;
  fieldProps: FormSchema<T>;
  key: number;
  onChange: (val: any) => void;
  layout?: LayoutType;
  formItemCol?: number;
}

function Field<T extends object>(props: FieldProps<T>): React.ReactElement<T> {
  const { data, fieldProps, onChange } = props;
  const { label, name, type, rules, validateTrigger, ...restFieldProps } =
    fieldProps;

  const renderInput = (name: string, restFieldProps: any) => {
    return (
      <Input
        {...restFieldProps}
        value={data}
        onChange={(e) => onChange({ [name]: e.target.value })}
      />
    );
  };

  const renderInputNumber = (name: string, restFieldProps: any) => {
    return (
      <InputNumber
        {...restFieldProps}
        value={data}
        onChange={(value) => onChange({ [name]: value })}
      />
    );
  };

  const renderTextArea = (name: string, restFieldProps: any) => {
    return (
      <Input.TextArea
        {...restFieldProps}
        value={data}
        onChange={(e) => onChange({ [name]: e.target.value })}
      />
    );
  };

  const renderCheckbox = (name: string, restFieldProps: any) => {
    return (
      <Checkbox
        {...restFieldProps}
        value={data}
        onChange={(e) => onChange({ [name]: e.target.checked })}
      />
    );
  };

  const renderPassword = (name: string, restFieldProps: any) => {
    return (
      <Input.Password
        {...restFieldProps}
        value={data}
        onChange={(e) => onChange({ [name]: e.target.value })}
      />
    );
  };

  const renderSwitch = (name: string, restFieldProps: any) => {
    return (
      <Switch
        {...restFieldProps}
        value={data}
        onChange={(checked) => onChange({ [name]: checked })}
      />
    );
  };

  const renderSelect = (name: string, restFieldProps: any) => {
    const { fieldData, ...restSelectProps } = restFieldProps;
    return (
      <Select
        {...restSelectProps}
        allowClear
        showSearch
        value={data}
        optionFilterProp="children"
        onChange={(value) => onChange({ [name]: value })}
      >
        {(fieldData || []).map((item: any, index: number) => {
          return (
            <Select.Option key={index} value={item.value}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  };

  const renderRadio = (name: string, restFieldProps: any) => {
    const { fieldData, ...restRadioProps } = restFieldProps;
    return (
      <Radio.Group
        {...restRadioProps}
        value={data}
        onChange={(e) => onChange({ [name]: e.target.value })}
      >
        {(fieldData || []).map((item: any) => {
          return (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          );
        })}
      </Radio.Group>
    );
  };

  const renderDatePicker = (name: string, restFieldProps: any) => {
    const defaultFormat = 'YYYY-MM-DD';

    return (
      <DatePicker
        style={{ width: '100%' }}
        format={defaultFormat}
        value={data}
        onChange={(date: Moment) => onChange({ [name]: date })}
        {...restFieldProps}
      />
    );
  };

  const renderRangePicker = (name: string, restFieldProps: any) => {
    const defaultFormat = 'YYYY-MM-DD';

    return (
      <DatePicker.RangePicker
        style={{ width: '100%' }}
        format={defaultFormat}
        value={data}
        onChange={(dates: [Moment, Moment]) => onChange({ [name]: dates })}
        {...restFieldProps}
      />
    );
  };

  const renderCustom = (restFieldProps: any) => {
    const { component } = restFieldProps;
    const Component = component;
    const onCustomChange = useCallback(
      (value: any) => onChange({ [name]: value }),
      []
    );
    return (
      <Component
        disabled={restFieldProps.disabled}
        value={data}
        onChange={onCustomChange}
      />
    );
  };

  // 渲染表单项
  const renderField = (fieldProps: any) => {
    const { name, type, ...restFieldProps } = fieldProps;
    switch (type) {
      case 'input':
        return renderInput(name, restFieldProps);
      case 'input-number':
        return renderInputNumber(name, restFieldProps);
      case 'textarea':
        return renderTextArea(name, restFieldProps);
      case 'select':
        return renderSelect(name, restFieldProps);
      case 'radio':
        return renderRadio(name, restFieldProps);
      case 'checkbox':
        return renderCheckbox(name, restFieldProps);
      case 'password':
        return renderPassword(name, restFieldProps);
      case 'switch':
        return renderSwitch(name, restFieldProps);
      case 'date':
        return renderDatePicker(name, restFieldProps);
      case 'date-range':
        return renderRangePicker(name, restFieldProps);
      case 'custom':
        return renderCustom(restFieldProps);
      default:
        return null;
    }
  };

  return (
    <Form.Item
      className="max-width"
      label={label}
      rules={rules}
      name={name as string}
      validateTrigger={validateTrigger}
    >
      {renderField({
        name,
        type,
        ...restFieldProps,
      })}
    </Form.Item>
  );
}

export default Field;
