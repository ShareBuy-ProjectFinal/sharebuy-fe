import { Form, Input, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import SelectForm from 'components/Input/SelectForm';
import React, { memo, useEffect, useState } from 'react';
import { checkFormValidate } from 'utils/function';
import { IAttribute } from '../AddProductPage';
import { useMutation } from '@tanstack/react-query';
import { AttributeApis } from 'apis/AttributeApis';
import { toastError, toastSucess } from 'utils/toats';
import { useUser } from 'contexts/UserProvider';
import TextCustom from 'components/Text/TextCustom';

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  attribute?: IAttribute;
  isAdd: boolean;
  listAttribute: IAttribute[];
  optionAttribute: any;
}

const ModalAddAttribute = (props: IProps) => {
  const {
    isOpen,
    isAdd,
    attribute,
    optionAttribute,
    listAttribute,
    setIsOpen,
  } = props;
  const [form] = useForm();
  const { user } = useUser();
  const [listAttributeValues, setListAttributeValues] = useState<any[]>([]);

  const mutateAddAttribute = useMutation({
    mutationFn: AttributeApis.createAttribute,
    onSuccess: (data: any) => {
      listAttribute.forEach(
        (item, index) =>
          (listAttribute[index] = {
            ...item,
            optionAttribute: [
              ...item.optionAttribute,
              {
                label: data?.attribute_name,
                value: data?._id,
              },
            ],
          }),
      );
      optionAttribute.push({
        label: data?.attribute_name,
        value: data?._id,
      });
      console.log('listAttribute', listAttribute);

      mutateAddAttributeValues.mutate({
        custom_attribute_id: data?._id,
        values: form.getFieldValue('attribute_value'),
      });
    },
    onError: (error) => {
      toastError('Thêm thuộc tính thất bại');
    },
  });

  const mutateAddAttributeValues = useMutation({
    mutationFn: AttributeApis.createAttributeValues,
    onSuccess: (data: any) => {
      setIsOpen(false);
      if (!isAdd) {
        const indexFind = listAttribute.findIndex(
          (item) => item.attribute_id == attribute?.attribute_id,
        );
        if (indexFind !== -1) {
          listAttribute[indexFind].optionAttributeValues = [
            ...listAttribute[indexFind].optionAttributeValues,
            ...data.map((item: any) => ({
              label: item.value,
              value: item._id,
            })),
          ];
        }
      }
      toastSucess('Thêm thành công');
    },
    onError: (error) => {
      toastError('Thêm thất bại');
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      //
      console.log(
        'attribute',
        attribute?.optionAttributeValues.map((item) => item.label),
      );

      setListAttributeValues(
        attribute?.optionAttributeValues.map((item) => item.label) || [],
      );
      form.setFieldsValue({
        attribute: attribute?.optionAttribute.filter(
          (item) => item.value == attribute.attribute_id,
        )?.[0].label,
      });
    } else {
      form.resetFields();
    }
  }, [user, attribute, isOpen]);

  const onFinish = async (values: any) => {
    if (!(await checkFormValidate(form))) {
      form.validateFields();
      return;
    }
    // console.log('values', form.getFieldsValue());
    if (isAdd) {
      mutateAddAttribute.mutate({
        shop_id: user?._id,
        attribute_name: form.getFieldValue('attribute'),
      });
    } else {
      mutateAddAttributeValues.mutate({
        custom_attribute_id: attribute?.attribute_id,
        values: form.getFieldValue('attribute_value'),
      });
    }
  };

  const handleChangeAttributeValues = (values: any) => {
    if (values && listAttributeValues.includes(values[values.length - 1])) {
      toastError('Giá trị thuộc tính đã tồn tại');
      form.setFieldsValue({
        attribute_value: values.slice(0, values.length - 1),
      });
    }
  };
  return (
    <Modal
      title="Thêm thuộc tính"
      open={isOpen}
      okText="Lưu"
      cancelText="Hủy"
      onOk={onFinish}
      onCancel={() => setIsOpen(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên thuộc tính"
          className="w-full mb-3"
          name={`attribute`}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên thuộc tính',
            },
          ]}
        >
          <Input
            size="large"
            placeholder={`Nhập thuộc tính `}
            className="flex-grow"
            disabled={!isAdd}
          />
        </Form.Item>
        {!isAdd && listAttributeValues.length > 0 && (
          <TextCustom
            value={`Thuộc tính đang có: ${listAttributeValues.join(', ')}`}
          />
        )}
        <Form.Item
          label="Giá trị thuộc tính"
          className="w-full mb-2"
          name={`attribute_value`}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá trị thuộc tính',
            },
          ]}
        >
          <SelectForm
            placeholder={`Nhập giá trị thuộc tính`}
            className="flex-grow"
            mode="tags"
            onChange={handleChangeAttributeValues}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(ModalAddAttribute);
